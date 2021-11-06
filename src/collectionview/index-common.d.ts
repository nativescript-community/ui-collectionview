import { ChangedData, CoreTypes, ItemsSource, KeyedTemplate, Label, Property, Template, View } from '@nativescript/core';
import { CollectionView as CollectionViewDefinition, Orientation } from '.';
export declare const CollectionViewTraceCategory = "NativescriptCollectionView";
export declare enum ContentInsetAdjustmentBehavior {
    Always = 0,
    Automatic = 1,
    Never = 2,
    ScrollableAxes = 3
}
export declare enum CLogTypes {
    log,
    info,
    warning,
    error
}
export declare const CLog: (type: CLogTypes, ...args: any[]) => void;
export declare enum ListViewViewTypes {
    ItemView = 0
}
export declare namespace knownTemplates {
    const itemTemplate = "itemTemplate";
}
export declare namespace knownMultiTemplates {
    const itemTemplates = "itemTemplates";
}
export interface Plugin {
    onLayout?: Function;
}
export declare abstract class CollectionViewBase extends View implements CollectionViewDefinition {
    static itemLoadingEvent: string;
    static scrollEvent: string;
    static scrollStartEvent: string;
    static scrollEndEvent: string;
    static itemTapEvent: string;
    static displayItemEvent: string;
    static itemReorderedEvent: string;
    static itemReorderStartingEvent: string;
    static itemReorderStartedEvent: string;
    static loadMoreItemsEvent: string;
    static dataPopulatedEvent: string;
    static knownFunctions: string[];
    isBounceEnabled: boolean;
    isScrollEnabled: boolean;
    reverseLayout: boolean;
    orientation: Orientation;
    itemTemplate: string | Template;
    itemTemplates: string | KeyedTemplate[];
    isItemsSourceIn: boolean;
    rowHeight: CoreTypes.PercentLengthType;
    colWidth: CoreTypes.PercentLengthType;
    verticalSpacing: CoreTypes.LengthType;
    horizontalSpacing: CoreTypes.LengthType;
    _innerWidth: number;
    _innerHeight: number;
    _effectiveRowHeight: number;
    _effectiveColWidth: number;
    loadMoreThreshold: number;
    scrollOffset: number;
    reorderEnabled: boolean;
    reorderLongPressEnabled: boolean;
    protected _dataUpdatesSuspended: boolean;
    scrollBarIndicatorVisible: boolean;
    layoutStyle: string;
    plugins: string[];
    static plugins: {
        [k: string]: Plugin;
    };
    static registerPlugin(key: string, plugin: Plugin): void;
    static layoutStyles: {
        [k: string]: {
            createLayout: Function;
            createDelegate?: Function;
        };
    };
    static registerLayoutStyle(style: string, generator: {
        createLayout: Function;
        createDelegate?: Function;
    }): void;
    protected _itemTemplatesInternal: Map<string, KeyedTemplate>;
    protected _defaultTemplate: KeyedTemplate;
    constructor();
    abstract refresh(): any;
    abstract refreshVisibleItems(): any;
    abstract isItemAtIndexVisible(index: number): any;
    abstract scrollToIndex(index: number, animated: boolean): any;
    protected updateInnerSize(): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    items: any[] | ItemsSource;
    _prepareItem(item: View, index: number): any;
    notifyLoading(args: any): void;
    getItemAtIndex(index: number): any;
    isHorizontal(): boolean;
    computeSpanCount(): number;
    _onRowHeightPropertyChanged(oldValue: CoreTypes.PercentLengthType, newValue: CoreTypes.PercentLengthType): void;
    _onColWidthPropertyChanged(oldValue: CoreTypes.PercentLengthType, newValue: CoreTypes.PercentLengthType): void;
    onItemViewLoaderChanged(): void;
    _itemViewLoader: any;
    get itemViewLoader(): any;
    set itemViewLoader(value: any);
    get padding(): string | CoreTypes.LengthType;
    set padding(value: string | CoreTypes.LengthType);
    get paddingTop(): CoreTypes.LengthType;
    set paddingTop(value: CoreTypes.LengthType);
    get paddingRight(): CoreTypes.LengthType;
    set paddingRight(value: CoreTypes.LengthType);
    get paddingBottom(): CoreTypes.LengthType;
    set paddingBottom(value: CoreTypes.LengthType);
    get paddingLeft(): CoreTypes.LengthType;
    set paddingLeft(value: CoreTypes.LengthType);
    resolveTemplateView(template: any): View;
    _getDefaultItemContent(): Label;
    getTemplateFromSelector(templateKey: any): KeyedTemplate;
    getViewForViewType(viewType: ListViewViewTypes, templateKey: string): any;
    private _itemTemplateSelectorBindable;
    _itemTemplateSelector: Function;
    onItemTemplateSelectorChanged(oldValue: any, newValue: any): void;
    private _itemIdGeneratorBindable;
    _itemIdGenerator: (item: any, index: number, items: any) => number;
    onItemIdGeneratorChanged(oldValue: any, newValue: any): void;
    onTemplateAdded(t: any): void;
    onTemplateRemoved(key: any): void;
    addTemplate(key: any, t: any): void;
    removeTemplate(key: any): void;
    onItemTemplatesChanged(oldValue: any, newValue: any): void;
    onItemTemplateChanged(oldValue: any, newValue: any): void;
    onItemTemplatesPropertyChanged(oldValue: any, newValue: any): void;
    onItemTemplatePropertyChanged(oldValue: any, newValue: any): void;
    onItemsChangedInternal: (oldValue: any, newValue: any) => void;
    spanSize: (item: any, index: number) => number;
    onSpanSizeChangedInternal: (oldValue: any, newValue: any) => void;
    _isDataDirty: boolean;
    onLoaded(): void;
    onSourceCollectionChanged(event: ChangedData<any>): void;
    onSourceCollectionChangedInternal(event: ChangedData<any>): void;
    suspendUpdates(): void;
    updatesSuspended(): boolean;
    resumeUpdates(refresh: boolean): void;
    abstract getViewForItemAtIndex(index: number): View;
    abstract startDragging(index: number): any;
    draggingView: View;
    _callItemReorderedEvent(oldPosition: any, newPosition: any, item: any): void;
    _reorderItemInSource(oldPosition: number, newPosition: number, callEvents?: boolean): void;
    shouldMoveItemAtIndex(index: number): boolean;
}
export declare const rowHeightProperty: Property<CollectionViewBase, CoreTypes.PercentLengthType>;
export declare const colWidthProperty: Property<CollectionViewBase, CoreTypes.PercentLengthType>;
export declare const orientationProperty: Property<CollectionViewBase, Orientation>;
export declare const itemTemplateProperty: Property<CollectionViewBase, string | Template>;
export declare const itemTemplatesProperty: Property<CollectionViewBase, KeyedTemplate[]>;
export declare const itemTemplateSelectorProperty: Property<CollectionViewBase, Function>;
export declare const itemIdGeneratorProperty: Property<CollectionViewBase, Function>;
export declare const itemsProperty: Property<CollectionViewBase, Function>;
export declare const spanSizeProperty: Property<CollectionViewBase, Function>;
export declare const isScrollEnabledProperty: Property<CollectionViewBase, boolean>;
export declare const isBounceEnabledProperty: Property<CollectionViewBase, boolean>;
export declare const reverseLayoutProperty: Property<CollectionViewBase, boolean>;
export declare const loadMoreThresholdProperty: Property<CollectionViewBase, number>;
export declare const reorderingEnabledProperty: Property<CollectionViewBase, boolean>;
export declare const reorderLongPressEnabledProperty: Property<CollectionViewBase, boolean>;
export declare const scrollBarIndicatorVisibleProperty: Property<CollectionViewBase, boolean>;
