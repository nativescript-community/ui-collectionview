import { ContentView, Trace, View } from '@nativescript/core';
import { CLog, CLogTypes, CollectionViewBase } from './index-common';
import { SharedCollectionViewPoolBase } from './shared-pool-common';

interface CollectionViewCellHolder extends com.nativescript.collectionview.CollectionViewCellHolder {
    // tslint:disable-next-line:no-misused-new
    new (androidView: android.view.View): CollectionViewCellHolder;
    view: View;
    clickListener: android.view.View.OnClickListener;
}

export class SharedCollectionViewPool extends SharedCollectionViewPoolBase {
    private recyclerListener: androidx.recyclerview.widget.RecyclerView.RecyclerListener;
    private recycledViewPool: com.nativescript.collectionview.RecycledViewPool;
    private recycledViewPoolDisposeListener: com.nativescript.collectionview.RecycledViewPool.ViewPoolListener;

    // used to store viewHolder and thus their corresponding Views
    // used to "destroy" cells when possible
    public _viewHolders = new Set<CollectionViewCellHolder>();

    public createNativeView() {
        // no need to create anything
        return null;
    }

    public initNativeView(): void {
        // const nativeView = this.nativeViewProtected;
        this.recycledViewPool = new com.nativescript.collectionview.RecycledViewPool();
        this.recycledViewPoolDisposeListener = new com.nativescript.collectionview.RecycledViewPool.ViewPoolListener({
            onViewHolderDisposed: (holder: CollectionViewCellHolder) => {
                if (Trace.isEnabled()) {
                    CLog(CLogTypes.log, 'onViewHolderDisposed', holder);
                }
                if (this._viewHolders) {
                    this._viewHolders.delete(holder);
                }
                const isNonSync = holder['defaultItemView'] === true;
                const view = isNonSync ? (holder.view as ContentView).content : holder.view;
                this.notifyForItemAtIndex(CollectionViewBase.itemDisposingEvent, view, holder.getAdapterPosition(), view.bindingContext, holder);
                if (view && view.isLoaded) {
                    view.callUnloaded();
                }
                view._isAddedToNativeVisualTree = false;
                //@ts-ignore
                view.parent = null;
                view._tearDownUI();
            }
        });
        (this.recycledViewPool as any).mListener = this.recycledViewPoolDisposeListener;

        this.recyclerListener = new androidx.recyclerview.widget.RecyclerView.RecyclerListener({
            onViewRecycled: (holder: CollectionViewCellHolder) => {
                if (Trace.isEnabled()) {
                    CLog(CLogTypes.log, 'onViewRecycled', holder);
                }
                const isNonSync = holder['defaultItemView'] === true;
                const view = isNonSync ? (holder.view as ContentView).content : holder.view;
                this.notifyForItemAtIndex(CollectionViewBase.itemRecyclingEvent, view, holder.getAdapterPosition(), view.bindingContext, holder);
            }
        });
    }

    public disposeNativeView() {
        this.collectionViews.forEach((collectionView) => {
            const nativeView = collectionView.nativeViewProtected;
            nativeView.setRecyclerListener(null);
            nativeView.setRecycledViewPool(null);
        });
        this.collectionViews.clear();
        this.recycledViewPoolDisposeListener = null;
        this.recycledViewPool = null;
        super.disposeNativeView();
    }

    public attachToCollectionView(collectionView: CollectionViewBase): void {
        super.attachToCollectionView(collectionView);

        const nativeView = collectionView.nativeViewProtected;
        nativeView.setRecyclerListener(this.recyclerListener);
        nativeView.setRecycledViewPool(this.recycledViewPool);
    }

    public detachFromCollectionView(collectionView: CollectionViewBase): void {
        super.detachFromCollectionView(collectionView);

        const nativeView = collectionView.nativeViewProtected;
        nativeView.setRecyclerListener(null);
        nativeView.setRecycledViewPool(null);
    }

    notifyForItemAtIndex(eventName: string, view: View, index: number, bindingContext?, native?: any) {
        const args = { eventName, object: this, index, view, ios: native, bindingContext };
        this.notify(args);
        return args as any;
    }
}
