import { ChangedData, View } from '@nativescript/core';
import { CollectionViewBase } from './collectionview-common';
export * from './collectionview-common';
declare module '@nativescript/core/ui/core/view' {
    interface View {
        handleGestureTouch(event: android.view.MotionEvent): any;
    }
}
declare module '@nativescript/core/ui/core/view' {
    interface View {
        layoutChangeListenerIsSet: boolean;
        layoutChangeListener: android.view.View.OnLayoutChangeListener;
        _raiseLayoutChangedEvent(): any;
    }
}
export declare class CollectionView extends CollectionViewBase {
    static DEFAULT_TEMPLATE_VIEW_TYPE: number;
    static CUSTOM_TEMPLATE_ITEM_TYPE: number;
    nativeViewProtected: CollectionViewRecyclerView & {
        scrollListener: com.nativescript.collectionview.OnScrollListener;
        layoutManager: androidx.recyclerview.widget.RecyclerView.LayoutManager;
        owner?: WeakRef<CollectionView>;
    };
    private templateTypeNumberString;
    private templateStringTypeNumber;
    private _currentNativeItemType;
    private _viewHolders;
    private _viewHolderChildren;
    private _scrollOrLoadMoreChangeCount;
    private _nScrollListener;
    scrolling: boolean;
    private _hlayoutParams;
    private _vlayoutParams;
    private _lastLayoutKey;
    private _listViewAdapter;
    private _simpleItemTouchCallback;
    private _itemTouchHelper;
    createNativeView(): any;
    initNativeView(): void;
    _getSpanSize: (position: number) => number;
    getViewForItemAtIndex(index: number): View;
    set spanSize(inter: (position: number) => number);
    get spanSize(): (position: number) => number;
    onLoaded(): void;
    private attachScrollListener;
    private dettachScrollListener;
    onScrolled(view: androidx.recyclerview.widget.RecyclerView, dx: number, dy: number): void;
    onScrollStateChanged(view: androidx.recyclerview.widget.RecyclerView, newState: number): void;
    addEventListener(arg: string, callback: any, thisArg?: any): void;
    removeEventListener(arg: string, callback: any, thisArg?: any): void;
    disposeNativeView(): void;
    get android(): androidx.recyclerview.widget.RecyclerView;
    get layoutManager(): androidsupportv7widgetRecyclerView.LayoutManager;
    _getViewLayoutParams(): androidviewViewGroup.LayoutParams;
    protected updateScrollBarVisibility(value: any): void;
    startDragging(index: number): void;
    isDragging: boolean;
    startViewHolderDragging(index: any, viewHolder: CollectionViewCellHolder): void;
    onReorderLongPress(motionEvent: android.view.MotionEvent): void;
    _reorderItemInSource(oldPosition: number, newPosition: number): void;
    _longPressGesture: androidx.core.view.GestureDetectorCompat;
    _itemTouchListerner: androidx.recyclerview.widget.RecyclerView.OnItemTouchListener;
    onItemViewLoaderChanged(): void;
    onItemTemplateSelectorChanged(oldValue: any, newValue: any): void;
    onItemTemplateChanged(oldValue: any, newValue: any): void;
    onItemTemplatesChanged(oldValue: any, newValue: any): void;
    private setOnLayoutChangeListener;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    onSourceCollectionChanged(event: ChangedData<any>): void;
    refreshVisibleItems(): void;
    refresh(): void;
    get scrollOffset(): number;
    get verticalOffsetX(): number;
    get verticalOffsetY(): number;
    scrollToIndex(index: number, animated?: boolean): void;
    private _setPadding;
    private createComposedAdapter;
    getItemCount(): number;
    getItem(i: number): any;
    getItemId(i: number): any;
    onItemIdGeneratorChanged(oldValue: any, newValue: any): void;
    clearTemplateTypes(): void;
    getItemViewType(position: number): number;
    disposeViewHolderViews(): void;
    getKeyByValue(viewType: number): string;
    onCreateViewHolder(parent: android.view.ViewGroup, viewType: number): CollectionViewCellHolder;
    onBindViewHolder(holder: CollectionViewCellHolder, position: number): void;
}
interface CollectionViewCellHolder extends com.nativescript.collectionview.CollectionViewCellHolder {
    new (androidView: android.view.View): CollectionViewCellHolder;
    view: View;
    clickListener: android.view.View.OnClickListener;
}
declare let CollectionViewCellHolder: CollectionViewCellHolder;
export interface CollectionViewRecyclerView extends com.nativescript.collectionview.RecyclerView {
    new (context: any): CollectionViewRecyclerView;
}
