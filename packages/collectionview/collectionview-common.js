var CollectionViewBase_1;
import { Builder, CSSType, Label, Observable, ObservableArray, PercentLength, Property, ProxyViewContainer, Trace, View, addWeakEventListener, booleanConverter, heightProperty, makeParser, makeValidator, profile, removeWeakEventListener, widthProperty } from '@nativescript/core';
export const CollectionViewTraceCategory = 'NativescriptCollectionView';
export var ContentInsetAdjustmentBehavior;
(function (ContentInsetAdjustmentBehavior) {
    ContentInsetAdjustmentBehavior[ContentInsetAdjustmentBehavior["Always"] = 0] = "Always";
    ContentInsetAdjustmentBehavior[ContentInsetAdjustmentBehavior["Automatic"] = 1] = "Automatic";
    ContentInsetAdjustmentBehavior[ContentInsetAdjustmentBehavior["Never"] = 2] = "Never";
    ContentInsetAdjustmentBehavior[ContentInsetAdjustmentBehavior["ScrollableAxes"] = 3] = "ScrollableAxes";
})(ContentInsetAdjustmentBehavior || (ContentInsetAdjustmentBehavior = {}));
export var CLogTypes;
(function (CLogTypes) {
    CLogTypes[CLogTypes["log"] = Trace.messageType.log] = "log";
    CLogTypes[CLogTypes["info"] = Trace.messageType.info] = "info";
    CLogTypes[CLogTypes["warning"] = Trace.messageType.warn] = "warning";
    CLogTypes[CLogTypes["error"] = Trace.messageType.error] = "error";
})(CLogTypes || (CLogTypes = {}));
export const CLog = (type, ...args) => {
    Trace.write(args.map(a => (a && typeof a === 'object' ? a.toString() : a)).join(' '), CollectionViewTraceCategory, type);
};
const autoEffectiveRowHeight = 0;
const autoEffectiveColWidth = 0;
export var ListViewViewTypes;
(function (ListViewViewTypes) {
    ListViewViewTypes[ListViewViewTypes["ItemView"] = 0] = "ItemView";
})(ListViewViewTypes || (ListViewViewTypes = {}));
export var knownTemplates;
(function (knownTemplates) {
    knownTemplates.itemTemplate = 'itemTemplate';
})(knownTemplates || (knownTemplates = {}));
export var knownMultiTemplates;
(function (knownMultiTemplates) {
    knownMultiTemplates.itemTemplates = 'itemTemplates';
})(knownMultiTemplates || (knownMultiTemplates = {}));
let CollectionViewBase = CollectionViewBase_1 = class CollectionViewBase extends View {
    constructor() {
        super();
        this._innerWidth = 0;
        this._innerHeight = 0;
        this._dataUpdatesSuspended = false;
        this.layoutStyle = 'grid';
        this.plugins = [];
        this._itemIdGenerator = null;
        this.onItemsChangedInternal = (oldValue, newValue) => {
            const getItem = newValue && newValue.getItem;
            this.isItemsSourceIn = typeof getItem === 'function';
            this.getItemAtIndex = this.isItemsSourceIn ? (index) => this.items.getItem(index) : (index) => this.items[index];
            if (oldValue instanceof Observable) {
                removeWeakEventListener(oldValue, ObservableArray.changeEvent, this.onSourceCollectionChangedInternal, this);
            }
            if (newValue instanceof Observable) {
                addWeakEventListener(newValue, ObservableArray.changeEvent, this.onSourceCollectionChangedInternal, this);
            }
            this.refresh();
        };
        this.onSpanSizeChangedInternal = (oldValue, newValue) => {
            this.spanSize = newValue;
            this.refresh();
        };
        this._isDataDirty = false;
        this._defaultTemplate = {
            key: 'default',
            createView: () => {
                if (this.itemTemplate) {
                    return Builder.parse(this.itemTemplate, this);
                }
                return undefined;
            },
        };
        this._itemTemplatesInternal = new Map();
        this._itemTemplatesInternal.set(this._defaultTemplate.key, this._defaultTemplate);
    }
    static registerPlugin(key, plugin) {
        this.plugins[key] = plugin;
    }
    static registerLayoutStyle(style, generator) {
        this.layoutStyles[style] = generator;
    }
    onLayout(left, top, right, bottom) {
        super.onLayout(left, top, right, bottom);
        this._innerWidth = right - left - this.effectivePaddingLeft - this.effectivePaddingRight;
        if (this.colWidth) {
            const newValue = PercentLength.toDevicePixels(this.colWidth, autoEffectiveColWidth, this._innerWidth);
            if (newValue !== this._effectiveColWidth) {
                this._effectiveColWidth = newValue;
            }
        }
        this._innerHeight = bottom - top - this.effectivePaddingTop - this.effectivePaddingBottom;
        if (this.rowHeight) {
            const newValue = PercentLength.toDevicePixels(this.rowHeight, autoEffectiveRowHeight, this._innerHeight);
            if (newValue !== this._effectiveRowHeight) {
                this._effectiveRowHeight = newValue;
            }
        }
    }
    _prepareItem(item, index) {
        const context = this.getItemAtIndex(index);
        if (item) {
            item.bindingContext = context;
        }
        return context;
    }
    notifyLoading(args) {
        this.notify(args);
    }
    getItemAtIndex(index) {
        const thisItems = this.items;
        return thisItems.getItem ? thisItems.getItem(index) : thisItems[index];
    }
    isHorizontal() {
        return this.orientation === 'horizontal';
    }
    computeSpanCount() {
        let spanCount = 1;
        if (this.isHorizontal()) {
            if (this._effectiveRowHeight) {
                spanCount = Math.max(Math.floor(this._innerHeight / this._effectiveRowHeight), 1) || 1;
            }
        }
        else {
            if (this._effectiveColWidth) {
                spanCount = Math.max(Math.floor(this._innerWidth / this._effectiveColWidth), 1) || 1;
            }
        }
        return spanCount;
    }
    _onRowHeightPropertyChanged(oldValue, newValue) {
        this.refresh();
    }
    _onColWidthPropertyChanged(oldValue, newValue) {
        this.refresh();
    }
    onItemViewLoaderChanged() { }
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
        return Builder.parse(template, this);
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
        return this._itemTemplatesInternal.get(templateKey.toLowerCase()) || this._itemTemplatesInternal.get('default');
    }
    getViewForViewType(viewType, templateKey) {
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
                }
                break;
        }
        return templateString === undefined ? undefined : this.resolveTemplateView(templateString);
    }
    onItemTemplateSelectorChanged(oldValue, newValue) {
        if (typeof newValue === 'string') {
            if (!this._itemTemplateSelectorBindable) {
                this._itemTemplateSelectorBindable = new ProxyViewContainer();
            }
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
        }
        else if (typeof newValue === 'function') {
            this._itemTemplateSelector = newValue;
        }
    }
    onItemIdGeneratorChanged(oldValue, newValue) {
        if (typeof newValue === 'string') {
            if (!this._itemIdGeneratorBindable) {
                this._itemIdGeneratorBindable = new ProxyViewContainer();
            }
            this._itemIdGeneratorBindable.bind({
                sourceProperty: null,
                targetProperty: 'itemId',
                expression: newValue,
            });
            this._itemIdGenerator = function (item, index, items) {
                item['$index'] = index;
                this._itemIdGeneratorBindable.bindingContext = item;
                return this._itemIdGeneratorBindable.get('itemId');
            };
        }
        else if (typeof newValue === 'function') {
            this._itemIdGenerator = newValue;
        }
    }
    onTemplateAdded(t) { }
    onTemplateRemoved(key) { }
    addTemplate(key, t) {
        if (!t.key) {
            t.key = t._key;
            delete t._key;
        }
        this._itemTemplatesInternal.set(t.key.toLowerCase(), t);
        this.onTemplateAdded(t);
    }
    removeTemplate(key) {
        const didDelete = this._itemTemplatesInternal.delete(key.toLowerCase());
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
    onItemTemplateChanged(oldValue, newValue) { }
    onItemTemplatesPropertyChanged(oldValue, newValue) {
        this.onItemTemplatesChanged(oldValue, newValue);
    }
    onItemTemplatePropertyChanged(oldValue, newValue) {
        this.onItemTemplateChanged(oldValue, newValue);
    }
    onLoaded() {
        super.onLoaded();
        if (this._isDataDirty && this._effectiveColWidth !== undefined && this._effectiveRowHeight !== undefined) {
            this.refresh();
        }
    }
    onSourceCollectionChanged(event) {
        this.refresh();
    }
    onSourceCollectionChangedInternal(event) {
        if (this._dataUpdatesSuspended === false) {
            this.onSourceCollectionChanged(event);
        }
    }
    [widthProperty.getDefault]() {
        return '100%';
    }
    [heightProperty.getDefault]() {
        return '100%';
    }
    suspendUpdates() {
        this._dataUpdatesSuspended = true;
    }
    updatesSuspended() {
        return this._dataUpdatesSuspended;
    }
    resumeUpdates(refresh) {
        this._dataUpdatesSuspended = false;
        if (refresh === true) {
            this.refresh();
        }
    }
    _callItemReorderedEvent(oldPosition, newPosition, item) {
        const args = {
            eventName: CollectionViewBase_1.itemReorderedEvent,
            object: this,
            index: oldPosition,
            item,
            data: { targetIndex: newPosition },
            view: this.draggingView
        };
        this.notify(args);
        this.draggingView = null;
    }
    _reorderItemInSource(oldPosition, newPosition, callEvents = true) {
        this.suspendUpdates();
        const ownerSource = this.items;
        const item = this.getItemAtIndex(oldPosition);
        ownerSource.splice(oldPosition, 1);
        ownerSource.splice(newPosition, 0, item);
        this.resumeUpdates(false);
        if (callEvents) {
            this._callItemReorderedEvent(oldPosition, newPosition, item);
        }
    }
    shouldMoveItemAtIndex(index) {
        if (!this.reorderEnabled) {
            return false;
        }
        const item = this.getItemAtIndex(index);
        const view = this.draggingView = this.getViewForItemAtIndex(index);
        let args = {
            returnValue: true,
            eventName: CollectionViewBase_1.itemReorderStartingEvent,
            object: this,
            index,
            item,
            view
        };
        this.notify(args);
        if (!args.returnValue) {
            return false;
        }
        args = {
            eventName: CollectionViewBase_1.itemReorderStartedEvent,
            object: this,
            index,
            item,
            view
        };
        this.notify(args);
        return true;
    }
};
CollectionViewBase.itemLoadingEvent = 'itemLoading';
CollectionViewBase.scrollEvent = 'scroll';
CollectionViewBase.scrollEndEvent = 'scrollEnd';
CollectionViewBase.itemTapEvent = 'itemTap';
CollectionViewBase.displayItemEvent = 'displayItem';
CollectionViewBase.itemReorderedEvent = 'itemReordered';
CollectionViewBase.itemReorderStartingEvent = 'itemReorderStarting';
CollectionViewBase.itemReorderStartedEvent = 'itemReorderStarted';
CollectionViewBase.loadMoreItemsEvent = 'loadMoreItems';
CollectionViewBase.dataPopulatedEvent = 'dataPopulated';
CollectionViewBase.knownFunctions = ['itemTemplateSelector', 'itemIdGenerator'];
CollectionViewBase.plugins = {};
CollectionViewBase.layoutStyles = {};
__decorate([
    profile
], CollectionViewBase.prototype, "_prepareItem", null);
__decorate([
    profile
], CollectionViewBase.prototype, "notifyLoading", null);
CollectionViewBase = CollectionViewBase_1 = __decorate([
    CSSType('CollectionView')
], CollectionViewBase);
export { CollectionViewBase };
const defaultRowHeight = 'auto';
export const rowHeightProperty = new Property({
    name: 'rowHeight',
    defaultValue: defaultRowHeight,
    equalityComparer: PercentLength.equals,
    valueConverter: PercentLength.parse,
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveRowHeight = PercentLength.toDevicePixels(newValue, autoEffectiveRowHeight, target._innerHeight);
        target._onRowHeightPropertyChanged(oldValue, newValue);
    },
});
rowHeightProperty.register(CollectionViewBase);
const defaultColWidth = { unit: '%', value: 1 };
export const colWidthProperty = new Property({
    name: 'colWidth',
    defaultValue: defaultColWidth,
    equalityComparer: PercentLength.equals,
    valueConverter: PercentLength.parse,
    valueChanged: (target, oldValue, newValue) => {
        if (target._innerWidth !== 0) {
            target._effectiveColWidth = PercentLength.toDevicePixels(newValue, autoEffectiveColWidth, target._innerWidth);
        }
        target._onColWidthPropertyChanged(oldValue, newValue);
    },
});
colWidthProperty.register(CollectionViewBase);
const converter = makeParser(makeValidator('horizontal', 'vertical'));
export const orientationProperty = new Property({
    name: 'orientation',
    defaultValue: 'vertical',
    affectsLayout: true,
    valueChanged: (target, oldValue, newValue) => {
        target.refresh();
    },
    valueConverter: converter,
});
orientationProperty.register(CollectionViewBase);
export const itemTemplateProperty = new Property({
    name: 'itemTemplate',
    valueChanged(target, oldValue, newValue) {
        target.onItemTemplatePropertyChanged(oldValue, newValue);
    },
});
itemTemplateProperty.register(CollectionViewBase);
export const itemTemplatesProperty = new Property({
    name: 'itemTemplates',
    valueConverter: (value) => {
        if (typeof value === 'string') {
            return Builder.parseMultipleTemplates(value);
        }
        return value;
    },
    valueChanged(target, oldValue, newValue) {
        target.onItemTemplatesPropertyChanged(oldValue, newValue);
    },
});
itemTemplatesProperty.register(CollectionViewBase);
export const itemTemplateSelectorProperty = new Property({
    name: 'itemTemplateSelector',
    defaultValue: undefined,
    valueChanged(target, oldValue, newValue) {
        target.onItemTemplateSelectorChanged(oldValue, newValue);
    },
});
itemTemplateSelectorProperty.register(CollectionViewBase);
export const itemIdGeneratorProperty = new Property({
    name: 'itemIdGenerator',
    defaultValue: undefined,
    valueChanged(target, oldValue, newValue) {
        target.onItemIdGeneratorChanged(oldValue, newValue);
    },
});
itemIdGeneratorProperty.register(CollectionViewBase);
export const itemsProperty = new Property({
    name: 'items',
    defaultValue: undefined,
    valueChanged(target, oldValue, newValue) {
        target.onItemsChangedInternal(oldValue, newValue);
    },
});
itemsProperty.register(CollectionViewBase);
export const spanSizeProperty = new Property({
    name: 'spanSize',
    defaultValue: undefined,
    valueChanged(target, oldValue, newValue) {
        target.onSpanSizeChangedInternal(oldValue, newValue);
    },
});
spanSizeProperty.register(CollectionViewBase);
export const isScrollEnabledProperty = new Property({
    name: 'isScrollEnabled',
    defaultValue: true,
    valueConverter: booleanConverter,
});
isScrollEnabledProperty.register(CollectionViewBase);
export const isBounceEnabledProperty = new Property({
    name: 'isBounceEnabled',
    defaultValue: true,
    valueConverter: booleanConverter,
});
isBounceEnabledProperty.register(CollectionViewBase);
export const reverseLayoutProperty = new Property({
    name: 'reverseLayout',
    defaultValue: false,
    valueConverter: booleanConverter,
});
reverseLayoutProperty.register(CollectionViewBase);
export const loadMoreThresholdProperty = new Property({
    name: 'loadMoreThreshold',
    defaultValue: 1,
    valueConverter: v => parseInt(v, 10)
});
loadMoreThresholdProperty.register(CollectionViewBase);
export const reorderingEnabledProperty = new Property({
    name: 'reorderEnabled',
    defaultValue: false,
    valueConverter: booleanConverter,
});
reorderingEnabledProperty.register(CollectionViewBase);
export const reorderLongPressEnabledProperty = new Property({
    name: 'reorderLongPressEnabled',
    defaultValue: false,
    valueConverter: booleanConverter,
});
reorderLongPressEnabledProperty.register(CollectionViewBase);
export const scrollBarIndicatorVisibleProperty = new Property({
    name: 'scrollBarIndicatorVisible',
    defaultValue: true,
    valueConverter: booleanConverter,
});
scrollBarIndicatorVisibleProperty.register(CollectionViewBase);
//# sourceMappingURL=collectionview-common.js.map