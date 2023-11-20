declare namespace com {
    export namespace nativescript {
        export namespace collectionview {
            export class RecycledViewPool extends androidx.recyclerview.widget.RecyclerView.RecycledViewPool {}
            export namespace RecycledViewPool {
                export class ViewPoolListener {
                    onViewHolderDisposed(holder: CollectionViewCellHolder);
                    constructor(implementation?: { onViewHolderDisposed(holder: CollectionViewCellHolder) });
                }
            }
            export class GridLayoutManager extends androidx.recyclerview.widget.GridLayoutManager {
                isScrollEnabled: boolean;
                layoutCompletedListener: LayoutCompletedListener;
            }
            export namespace GridLayoutManager {

                export class LayoutCompletedListener {
                    onLayoutCompleted();
                    constructor(implementation?: { onLayoutCompleted() });
                } 
            }
            export class PreCachingGridLayoutManager extends GridLayoutManager {
                setExtraLayoutSpace(space: number);
            }
            export class CollectionViewCellHolder extends androidx.recyclerview.widget.RecyclerView.ViewHolder {}
            export class AdapterInterface {
                public onCreateViewHolder(param0: globalAndroid.view.ViewGroup, param1: number): CollectionViewCellHolder;
                public getItemViewType(param0: number): number;
                public getItemCount(): number;
                public getItemId(param0: number): number;
                public onBindViewHolder(param0: CollectionViewCellHolder, param1: number): void;
                public onViewRecycled(param0: CollectionViewCellHolder): void;
                constructor(implementation?: {
                    onCreateViewHolder(param0: globalAndroid.view.ViewGroup, param1: number): CollectionViewCellHolder;
                    getItemViewType(param0: number): number;
                    getItemCount(): number;
                    getItemId(param0: number): number;
                    onBindViewHolder(param0: CollectionViewCellHolder, param1: number): void;
                    onViewRecycled(param0: CollectionViewCellHolder): void;
                });
            }
            export class Adapter extends androidx.recyclerview.widget.RecyclerView.Adapter<CollectionViewCellHolder> {
                adapterInterface: AdapterInterface;
            }
            export class RecyclerView extends androidx.recyclerview.widget.RecyclerView {
                static createRecyclerView(context): RecyclerView;
                static inflate(context): RecyclerView;
                sizeChangedListener?: SizeChangedListener;
                smoothScrollToPosition(position: number, snapPosition?: number);
            }
            export class SizeChangedListener {
                constructor(impl?: { onLayout(changed:boolean, l: number, t: number, r: number, b: number); onMeasure(widthMeasureSpec: number, heightMeasureSpec: number) });
                onLayout(changed:boolean, l: number, t: number, r: number, b: number);
                onMeasure(widthMeasureSpec: number, heightMeasureSpec: number);
            }
            export class OnScrollListener extends androidx.recyclerview.widget.RecyclerView.OnScrollListener {
                constructor(listener: OnScrollListener.Listener);
                setListener(listener: OnScrollListener.Listener);
            }
            export namespace OnScrollListener {
                export class Listener {
                    constructor(implementation: {
                        onScrolled(param0: androidx.recyclerview.widget.RecyclerView, param1: number, param2: number): void;
                        onScrollStateChanged(param0: androidx.recyclerview.widget.RecyclerView, param1: number): void;
                    });
                    onScrolled(param0: androidx.recyclerview.widget.RecyclerView, param1: number, param2: number): void;
                    onScrollStateChanged(param0: androidx.recyclerview.widget.RecyclerView, param1: number): void;
                }
            }
            export class SpanSizeLookup extends androidx.recyclerview.widget.GridLayoutManager.SpanSizeLookup {
                constructor(inter: SpanSizeLookup.Interface);
                setListener(inter: SpanSizeLookup.Interface);
            }
            export namespace SpanSizeLookup {
                export class Interface {
                    constructor(implementation: { getSpanSize(param0: number): number });
                    getSpanSize(param0: number): number;
                }
            }

            export class SmoothScroller extends androidx.recyclerview.widget.LinearSmoothScroller {}
            export class OverlapDecoration extends androidx.recyclerview.widget.RecyclerView.ItemDecoration {
                public top: number;
                public right: number;
                public bottom: number;
                public left: number;
            }
        }
    }
}
