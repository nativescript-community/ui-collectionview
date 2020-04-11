import * as observable from '@nativescript/core/data/observable';
import { ChangedData, ObservableArray } from '@nativescript/core/data/observable-array';
import * as builder from '@nativescript/core/ui/builder';
import { booleanConverter, heightProperty, makeParser, makeValidator, widthProperty, ViewBase } from '@nativescript/core/ui/content-view';
import { CoercibleProperty, KeyedTemplate, Length, PercentLength, Property, Template, View } from '@nativescript/core/ui/core/view';
import { addWeakEventListener, removeWeakEventListener } from '@nativescript/core/ui/core/weak-event-listener';
import { Label } from '@nativescript/core/ui/label';
import { ItemsSource } from '@nativescript/core/ui/list-view';
import { CollectionView as CollectionViewDefinition, Orientation } from './collectionview';
import { profile } from '@nativescript/core/profiling';
import { write, messageType, isEnabled } from '@nativescript/core/trace';

export const CollectionViewTraceCategory = 'NativescriptCollectionView';

declare module '@nativescript/core/ui/core/view-base' {
    interface ViewBase {
        _recursiveSuspendNativeUpdates(type);
        _recursiveResumeNativeUpdates(type);
        _recursiveBatchUpdates<T>(callback: () => T): T;
    }
}
ViewBase.prototype._recursiveSuspendNativeUpdates = profile('_recursiveSuspendNativeUpdates', function (type) {
    // console.log('_recursiveSuspendNativeUpdates', this, this._suspendNativeUpdatesCount);
    this._suspendNativeUpdates(type);
    this.eachChild((c) => c._recursiveSuspendNativeUpdates(type));
});
ViewBase.prototype._recursiveResumeNativeUpdates = profile('_recursiveResumeNativeUpdates', function (type) {
    // console.log('_recursiveResumeNativeUpdates', this, this._suspendNativeUpdatesCount);
    this._resumeNativeUpdates(type);
    this.eachChild((c) => c._recursiveResumeNativeUpdates(type));
});

// right now _recursiveBatchUpdates suppose no view is added in the callback. If so it will crash from _resumeNativeUpdates
ViewBase.prototype._recursiveBatchUpdates = profile('_recursiveBatchUpdates', function <T>(callback: () => T): T {
    try {
        this._recursiveSuspendNativeUpdates(0);

        return callback();
    } finally {
        this._recursiveResumeNativeUpdates(0);
    }
});

export enum CLogTypes {
    log = messageType.log,
    info = messageType.info,
    warning = messageType.warn,
    error = messageType.error,
}

export const CLog = (type: CLogTypes, ...args) => {
    write(args.join(' '), CollectionViewTraceCategory, type);
};

const autoEffectiveRowHeight = 0;
const autoEffectiveColWidth = 0;

// export * from 'ui/core/view';

export enum ListViewViewTypes {
    ItemView,
}

export namespace knownTemplates {
    export const itemTemplate = 'itemTemplate';
}

export namespace knownMultiTemplates {
    export const itemTemplates = 'itemTemplates';
}

export abstract class CollectionViewBase extends View implements CollectionViewDefinition {
    public static itemLoadingEvent = 'itemLoading';
    public static cellCreateEvent = 'cellCreate';
    public static scrollEvent = 'scroll';
    public static itemTapEvent = 'itemTap';
    public static loadMoreItemsEvent = 'loadMoreItems';
    public static dataPopulatedEvent = 'dataPopulated';
    public static knownFunctions = ['itemTemplateSelector', 'itemIdGenerator']; // See component-builder.ts isKnownFunction

    public isBounceEnabled: boolean;
    public isScrollEnabled: boolean;
    public orientation: Orientation;
    public itemTemplate: string | Template;
    public itemTemplates: string | KeyedTemplate[];
    public isItemsSourceIn: boolean;
    public rowHeight: PercentLength;
    public colWidth: PercentLength;
    public verticalSpacing: Length;
    public horizontalSpacing: Length;
    public _innerWidth: number = 0;
    public _innerHeight: number = 0;
    public _effectiveRowHeight: number;
    public _effectiveColWidth: number;

    protected _itemTemplatesInternal: Map<string, KeyedTemplate>;
    protected _defaultTemplate: KeyedTemplate;
    private _itemTemplateSelectorBindable = new Label();

    constructor() {
        super();
        this._defaultTemplate = {
            key: 'default',
            createView: () => {
                if (this.itemTemplate) {
                    return builder.parse(this.itemTemplate, this);
                }
                return undefined;
            },
        };
        this._itemTemplatesInternal = new Map();
        this._itemTemplatesInternal.set(this._defaultTemplate.key, this._defaultTemplate);
    }

    public itemIdGenerator: (item: any, index: number, items: any) => number = (_item: any, index: number) => index;

    public abstract refresh();
    public abstract scrollToIndex(index: number, animated: boolean);

    @profile
    public setMeasuredDimension(measuredWidth: number, measuredHeight: number) {
        super.setMeasuredDimension(measuredWidth, measuredHeight);
        let changed = false;
        this._innerWidth = measuredWidth - this.effectivePaddingLeft - this.effectivePaddingRight;
        if (this.colWidth) {
            const newValue = PercentLength.toDevicePixels(this.colWidth, autoEffectiveColWidth, this._innerWidth); // We cannot use 0 for auto as it throws for android.
            if (newValue !== this._effectiveColWidth) {
                this._effectiveColWidth = newValue;
                changed = true;
            }
        }

        this._innerHeight = measuredHeight - this.effectivePaddingTop - this.effectivePaddingBottom;
        if (this.rowHeight) {
            const newValue = PercentLength.toDevicePixels(this.rowHeight, autoEffectiveRowHeight, this._innerHeight);
            if (newValue !== this._effectiveRowHeight) {
                this._effectiveRowHeight = newValue;
                changed = true;
            }
        }
        if (changed) {
            this.refresh();
        }
    }
    // public onLayout(left: number, top: number, right: number, bottom: number) {
    //   super.onLayout(left, top, right, bottom);
    // }
    items: any[] | ItemsSource;

    @profile
    public _prepareItem(item: View, index: number) {
        const context = this.getItemAtIndex(index);
        if (item) {
            item.bindingContext = context;
        }
        return context;
    }

    public getItemAtIndex(index: number): any {
        const thisItems = this.items as ItemsSource;
        return thisItems.getItem ? thisItems.getItem(index) : thisItems[index];
    }

    public _onRowHeightPropertyChanged(oldValue: PercentLength, newValue: PercentLength) {
        this.refresh();
    }
    public _onColWidthPropertyChanged(oldValue: PercentLength, newValue: PercentLength) {
        this.refresh();
    }
    onItemViewLoaderChanged() {}
    _itemViewLoader;

    get itemViewLoader() {
        return this._itemViewLoader;
    }
    set itemViewLoader(value) {
        if (this._itemViewLoader !== value) {
            this._itemViewLoader = value;
            this.onItemViewLoaderChanged();
        }
    }
    resolveTemplateView(template) {
        return builder.parse(template, this);
    }
    _getDefaultItemContent() {
        const lbl = new Label();
        lbl['defaultItemView'] = true;
        lbl.bind({
            targetProperty: 'text',
            sourceProperty: '$value',
        });
        return lbl;
    }
    getTemplateFromSelector(templateKey) {
        return this._itemTemplatesInternal.get(templateKey) || this._itemTemplatesInternal.get('default');
        // for (let i = 0, length_1 = this._itemTemplatesInternal.length; i < length_1; i++) {
        //     if (this._itemTemplatesInternal[i].key.toLowerCase() === templateKey.toLowerCase()) {
        //         return this._itemTemplatesInternal[i];
        //     }
        // }
        // // This is the default template
        // return this._itemTemplatesInternal[0];
    }
    getViewForViewType(viewType: ListViewViewTypes, templateKey: string) {
        let newView;
        if (templateKey) {
            const template = this.getTemplateFromSelector(templateKey);
            newView = template.createView();
        }
        if (!newView && this._itemViewLoader !== undefined) {
            newView = this._itemViewLoader(templateKey);
        }
        if (newView) {
            return newView;
        }
        let templateString;
        switch (viewType) {
            case ListViewViewTypes.ItemView:
                templateString = this.itemTemplate;
                if (templateString === undefined) {
                    return undefined;
                    // return this._getDefaultItemContent();
                }
                break;
        }
        return templateString === undefined ? undefined : this.resolveTemplateView(templateString);
    }
    _itemTemplateSelector: Function;
    onItemTemplateSelectorChanged(oldValue, newValue) {
        console.log('onItemTemplateSelectorChanged');
        if (typeof newValue === 'string') {
            this._itemTemplateSelectorBindable.bind({
                sourceProperty: null,
                targetProperty: 'templateKey',
                expression: newValue,
            });
            this._itemTemplateSelector = function (item, index, items) {
                item['$index'] = index;
                this._itemTemplateSelectorBindable.bindingContext = item;
                return this._itemTemplateSelectorBindable.get('templateKey');
            };
        } else if (typeof newValue === 'function') {
            this._itemTemplateSelector = newValue;
        }
    }
    onTemplateAdded(t) {}
    onTemplateRemoved(key) {}
    addTemplate(key, t) {
        if (!t.key) {
            t.key = t._key;
            delete t._key;
        }
        this._itemTemplatesInternal.set(t.key, t);
        this.onTemplateAdded(t);
    }
    removeTemplate(key) {
        const didDelete = this._itemTemplatesInternal.delete(key);
        if (didDelete) {
            this.onTemplateRemoved(key);
        }
    }
    onItemTemplatesChanged(oldValue, newValue) {
        this._itemTemplatesInternal = new Map();
        if (newValue) {
            newValue.forEach((t) => {
                if (!t.key) {
                    t.key = t._key;
                    delete t._key;
                }
                this._itemTemplatesInternal.set(t.key, t);
            });
        }
        if (!this._itemTemplatesInternal.has(this._defaultTemplate.key)) {
            this._itemTemplatesInternal.set(this._defaultTemplate.key, this._defaultTemplate);
        }
    }
    onItemTemplateChanged(oldValue, newValue) {}
    onItemTemplateSelectorPropertyChanged(oldValue, newValue) {
        this.onItemTemplateSelectorChanged(oldValue, newValue);
    }
    onItemTemplatesPropertyChanged(oldValue, newValue) {
        this.onItemTemplatesChanged(oldValue, newValue);
    }
    onItemTemplatePropertyChanged(oldValue, newValue) {
        this.onItemTemplateChanged(oldValue, newValue);
    }

    onItemsChangedInternal = (oldValue, newValue) => {
        const getItem = newValue && (newValue as ItemsSource).getItem;
        this.isItemsSourceIn = typeof getItem === 'function';
        // we override the method to prevent the test on every getItem
        this.getItemAtIndex = this.isItemsSourceIn ? (index: number) => (this.items as ItemsSource).getItem(index) : (index: number) => this.items[index];
        if (oldValue instanceof observable.Observable) {
            removeWeakEventListener(oldValue, ObservableArray.changeEvent, this.onSourceCollectionChangedInternal, this);
        }

        if (newValue instanceof observable.Observable) {
            addWeakEventListener(newValue, ObservableArray.changeEvent, this.onSourceCollectionChangedInternal, this);
        }
        this.refresh();
    };
    _isDataDirty = false;
    onLoaded() {
        super.onLoaded();
        if (this._isDataDirty) {
            this.refresh();
        }
    }
    onSourceCollectionChanged(event: ChangedData<any>) {
        this.refresh();
    }
    onSourceCollectionChangedInternal(event: ChangedData<any>) {
        this.onSourceCollectionChanged(event);
    }
    onItemsChanged(oldValue, newValue) {
        this.onItemsChangedInternal(oldValue, newValue);
    }

    [widthProperty.getDefault]() {
        return '100%';
    }
    [heightProperty.getDefault]() {
        return '100%';
    }
}

const defaultRowHeight: Length = 'auto';
export const rowHeightProperty = new Property<CollectionViewBase, PercentLength>({
    name: 'rowHeight',
    defaultValue: defaultRowHeight,
    equalityComparer: PercentLength.equals,
    valueConverter: PercentLength.parse,
    // coerceValue: (target, value) => {
    //     console.log('coerceValue', !!target.nativeView, value, defaultRowHeight);
    //     // We coerce to default value if we don't have display density.
    //     return target.nativeView ? value : defaultRowHeight;
    // },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveRowHeight = PercentLength.toDevicePixels(newValue, autoEffectiveRowHeight, target._innerHeight);
        target._onRowHeightPropertyChanged(oldValue, newValue);
    },
});
rowHeightProperty.register(CollectionViewBase);

const defaultColWidth: PercentLength = { unit: '%', value: 1 };
export const colWidthProperty = new Property<CollectionViewBase, PercentLength>({
    name: 'colWidth',
    defaultValue: defaultColWidth,
    equalityComparer: PercentLength.equals,
    valueConverter: PercentLength.parse,
    // coerceValue: (target, value) => {
    //     // We coerce to default value if we don't have display density.
    //     return target.nativeView ? value : defaultColWidth;
    // },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveColWidth = PercentLength.toDevicePixels(newValue, autoEffectiveColWidth, target._innerWidth);
        target._onColWidthPropertyChanged(oldValue, newValue);
    },
});
colWidthProperty.register(CollectionViewBase);

const converter = makeParser<Orientation>(makeValidator('horizontal', 'vertical'));
export const orientationProperty = new Property<CollectionViewBase, Orientation>({
    name: 'orientation',
    defaultValue: 'vertical',
    affectsLayout: true,
    valueChanged: (target: CollectionViewBase, oldValue: Orientation, newValue: Orientation) => {
        target.refresh();
    },
    valueConverter: converter,
});
orientationProperty.register(CollectionViewBase);

export const itemTemplateProperty = new Property<CollectionViewBase, string | Template>({
    name: 'itemTemplate',
    valueChanged(target, oldValue, newValue) {
        target.onItemTemplatePropertyChanged(oldValue, newValue);
    },
});
itemTemplateProperty.register(CollectionViewBase);

export const itemTemplatesProperty = new Property<CollectionViewBase, KeyedTemplate[]>({
    name: 'itemTemplates',
    valueConverter: (value) => {
        if (typeof value === 'string') {
            return builder.parseMultipleTemplates(value);
        }

        return value;
    },
    valueChanged(target, oldValue, newValue) {
        target.onItemTemplatesPropertyChanged(oldValue, newValue);
    },
});
itemTemplatesProperty.register(CollectionViewBase);

export const itemTemplateSelectorProperty = new Property<CollectionViewBase, Function>({
    name: 'itemTemplateSelector',
    defaultValue: undefined,
    valueChanged(target, oldValue, newValue) {
        target.onItemTemplateSelectorPropertyChanged(oldValue, newValue);
    },
});
itemTemplateSelectorProperty.register(CollectionViewBase);

export const itemsProperty = new Property<CollectionViewBase, Function>({
    name: 'items',
    defaultValue: undefined,
    valueChanged(target, oldValue, newValue) {
        target.onItemsChanged(oldValue, newValue);
    },
});
itemsProperty.register(CollectionViewBase);

export const isScrollEnabledProperty = new Property<CollectionViewBase, boolean>({
    name: 'isScrollEnabled',
    defaultValue: true,
    valueConverter: booleanConverter,
});
isScrollEnabledProperty.register(CollectionViewBase);
export const isBounceEnabledProperty = new Property<CollectionViewBase, boolean>({
    name: 'isBounceEnabled',
    defaultValue: true,
    valueConverter: booleanConverter,
});
isBounceEnabledProperty.register(CollectionViewBase);
