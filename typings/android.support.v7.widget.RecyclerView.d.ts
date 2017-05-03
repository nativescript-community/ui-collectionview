declare module android {
	export module support {
		export module v4 {
			export module animation {
				export type ValueAnimatorCompat = any;
			}
		}
	}
}

import javalangClass = java.lang.Class;
import javalangObject = java.lang.Object;
/// <reference path="./java.lang.Class.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module util {
				export class AsyncListUtil<T> {
					public refresh(): void;
					public constructor(param0: javalangClass<T>, param1: number, param2: android.support.v7.util.AsyncListUtil.DataCallback, param3: android.support.v7.util.AsyncListUtil.ViewCallback);
					public getItemCount(): number;
					public onRangeChanged(): void;
					public getItem(param0: number): javalangObject;
				}
				export module AsyncListUtil {
					export abstract class DataCallback {
						public recycleData(param0: native.Array<javalangObject>, param1: number): void;
						public constructor();
						public fillData(param0: native.Array<javalangObject>, param1: number, param2: number): void;
						public refreshData(): number;
						public getMaxCachedTiles(): number;
					}
					export abstract class ViewCallback {
						public static HINT_SCROLL_NONE: number;
						public static HINT_SCROLL_DESC: number;
						public static HINT_SCROLL_ASC: number;
						public constructor();
						public onDataRefresh(): void;
						public extendRangeInto(param0: native.Array<number>, param1: native.Array<number>, param2: number): void;
						public getItemRangeInto(param0: native.Array<number>): void;
						public onItemLoaded(param0: number): void;
					}
				}
			}
		}
	}
}

/// <reference path="./java.lang.Object.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module util {
				export class MessageThreadUtil {
					public getMainThreadProxy(param0: android.support.v7.util.ThreadUtil.MainThreadCallback): android.support.v7.util.ThreadUtil.MainThreadCallback;
					public getBackgroundProxy(param0: android.support.v7.util.ThreadUtil.BackgroundCallback): android.support.v7.util.ThreadUtil.BackgroundCallback;
				}
				export module MessageThreadUtil {
					export class MessageQueue {
					}
					export class SyncQueueItem {
						public what: number;
						public arg1: number;
						public arg2: number;
						public arg3: number;
						public arg4: number;
						public arg5: number;
						public data: javalangObject;
					}
				}
			}
		}
	}
}

import javautilCollection = java.util.Collection;
/// <reference path="./java.lang.Class.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.util.Collection.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module util {
				export class SortedList<T> {
					public static INVALID_POSITION: number;
					public beginBatchedUpdates(): void;
					public constructor(param0: javalangClass<T>, param1: android.support.v7.util.SortedList.Callback, param2: number);
					public updateItemAt(param0: number, param1: javalangObject): void;
					public size(): number;
					public add(param0: javalangObject): number;
					public remove(param0: javalangObject): boolean;
					public addAll(param0: javautilCollection<T>): void;
					public addAll(param0: native.Array<javalangObject>): void;
					public recalculatePositionOfItemAt(param0: number): void;
					public indexOf(param0: javalangObject): number;
					public clear(): void;
					public constructor(param0: javalangClass<T>, param1: android.support.v7.util.SortedList.Callback);
					public addAll(param0: native.Array<javalangObject>, param1: boolean): void;
					public get(param0: number): javalangObject;
					public endBatchedUpdates(): void;
					public removeItemAt(param0: number): javalangObject;
				}
				export module SortedList {
					export class BatchedCallback extends android.support.v7.util.SortedList.Callback {
						public constructor();
						public areContentsTheSame(param0: javalangObject, param1: javalangObject): boolean;
						public areItemsTheSame(param0: javalangObject, param1: javalangObject): boolean;
						public onChanged(param0: number, param1: number): void;
						public compare(param0: javalangObject, param1: javalangObject): number;
						public onRemoved(param0: number, param1: number): void;
						public constructor(param0: android.support.v7.util.SortedList.Callback);
						public onInserted(param0: number, param1: number): void;
						public dispatchLastEvent(): void;
						public onMoved(param0: number, param1: number): void;
					}
					export abstract class Callback {
						public constructor();
						public areContentsTheSame(param0: javalangObject, param1: javalangObject): boolean;
						public areItemsTheSame(param0: javalangObject, param1: javalangObject): boolean;
						public onChanged(param0: number, param1: number): void;
						public compare(param0: javalangObject, param1: javalangObject): number;
						public onRemoved(param0: number, param1: number): void;
						public onInserted(param0: number, param1: number): void;
						public onMoved(param0: number, param1: number): void;
					}
				}
			}
		}
	}
}

declare module android {
	export module support {
		export module v7 {
			export module util {
				export class ThreadUtil {
					/**
					 * Constructs a new instance of the android.support.v7.util.ThreadUtil interface with the provided implementation.
					 */
					public constructor(implementation: {
						getMainThreadProxy(param0: android.support.v7.util.ThreadUtil.MainThreadCallback): android.support.v7.util.ThreadUtil.MainThreadCallback;
						getBackgroundProxy(param0: android.support.v7.util.ThreadUtil.BackgroundCallback): android.support.v7.util.ThreadUtil.BackgroundCallback;
					});
					public getMainThreadProxy(param0: android.support.v7.util.ThreadUtil.MainThreadCallback): android.support.v7.util.ThreadUtil.MainThreadCallback;
					public getBackgroundProxy(param0: android.support.v7.util.ThreadUtil.BackgroundCallback): android.support.v7.util.ThreadUtil.BackgroundCallback;
				}
				export module ThreadUtil {
					export class BackgroundCallback {
						/**
						 * Constructs a new instance of the android.support.v7.util.ThreadUtil$BackgroundCallback interface with the provided implementation.
						 */
						public constructor(implementation: {
							refresh(param0: number): void;
							updateRange(param0: number, param1: number, param2: number, param3: number, param4: number): void;
							loadTile(param0: number, param1: number): void;
							recycleTile(param0: android.support.v7.util.TileList.Tile): void;
						});
						public recycleTile(param0: android.support.v7.util.TileList.Tile): void;
						public refresh(param0: number): void;
						public updateRange(param0: number, param1: number, param2: number, param3: number, param4: number): void;
						public loadTile(param0: number, param1: number): void;
					}
					export class MainThreadCallback {
						/**
						 * Constructs a new instance of the android.support.v7.util.ThreadUtil$MainThreadCallback interface with the provided implementation.
						 */
						public constructor(implementation: {
							updateItemCount(param0: number, param1: number): void;
							addTile(param0: number, param1: android.support.v7.util.TileList.Tile): void;
							removeTile(param0: number, param1: number): void;
						});
						public updateItemCount(param0: number, param1: number): void;
						public addTile(param0: number, param1: android.support.v7.util.TileList.Tile): void;
						public removeTile(param0: number, param1: number): void;
					}
				}
			}
		}
	}
}

/// <reference path="./java.lang.Class.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module util {
				export class TileList {
					public getItemAt(param0: number): javalangObject;
					public addOrReplace(param0: android.support.v7.util.TileList.Tile): android.support.v7.util.TileList.Tile;
					public getAtIndex(param0: number): android.support.v7.util.TileList.Tile;
					public clear(): void;
					public removeAtPos(param0: number): android.support.v7.util.TileList.Tile;
					public size(): number;
					public constructor(param0: number);
				}
				export module TileList {
					export class Tile {
						public mItems: native.Array<javalangObject>;
						public mStartPosition: number;
						public mItemCount: number;
						public constructor(param0: javalangClass<java.lang.Object>, param1: number);
					}
				}
			}
		}
	}
}

/// <reference path="./java.lang.Object.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class AdapterHelper {
					public obtainUpdateOp(param0: number, param1: number, param2: number, param3: javalangObject): android.support.v7.widget.AdapterHelper.UpdateOp;
					public recycleUpdateOp(param0: android.support.v7.widget.AdapterHelper.UpdateOp): void;
					public applyPendingUpdatesToPosition(param0: number): number;
				}
				export module AdapterHelper {
					export class Callback {
						/**
						 * Constructs a new instance of the android.support.v7.widget.AdapterHelper$Callback interface with the provided implementation.
						 */
						public constructor(implementation: {
							findViewHolder(param0: number): android.support.v7.widget.RecyclerView.ViewHolder;
							offsetPositionsForRemovingInvisible(param0: number, param1: number): void;
							offsetPositionsForRemovingLaidOutOrNewView(param0: number, param1: number): void;
							markViewHoldersUpdated(param0: number, param1: number, param2: javalangObject): void;
							onDispatchFirstPass(param0: android.support.v7.widget.AdapterHelper.UpdateOp): void;
							onDispatchSecondPass(param0: android.support.v7.widget.AdapterHelper.UpdateOp): void;
							offsetPositionsForAdd(param0: number, param1: number): void;
							offsetPositionsForMove(param0: number, param1: number): void;
						});
						public offsetPositionsForRemovingLaidOutOrNewView(param0: number, param1: number): void;
						public onDispatchFirstPass(param0: android.support.v7.widget.AdapterHelper.UpdateOp): void;
						public offsetPositionsForAdd(param0: number, param1: number): void;
						public findViewHolder(param0: number): android.support.v7.widget.RecyclerView.ViewHolder;
						public markViewHoldersUpdated(param0: number, param1: number, param2: javalangObject): void;
						public offsetPositionsForMove(param0: number, param1: number): void;
						public onDispatchSecondPass(param0: android.support.v7.widget.AdapterHelper.UpdateOp): void;
						public offsetPositionsForRemovingInvisible(param0: number, param1: number): void;
					}
					export class UpdateOp {
						public equals(param0: javalangObject): boolean;
						public hashCode(): number;
						public toString(): string;
					}
				}
			}
		}
	}
}

/// <reference path="./android.view.View.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class ChildHelper {
					public toString(): string;
				}
				export module ChildHelper {
					export class Bucket {
						public toString(): string;
					}
					export class Callback {
						/**
						 * Constructs a new instance of the android.support.v7.widget.ChildHelper$Callback interface with the provided implementation.
						 */
						public constructor(implementation: {
							getChildCount(): number;
							addView(param0: android.view.View, param1: number): void;
							indexOfChild(param0: android.view.View): number;
							removeViewAt(param0: number): void;
							getChildAt(param0: number): android.view.View;
							removeAllViews(): void;
							getChildViewHolder(param0: android.view.View): android.support.v7.widget.RecyclerView.ViewHolder;
							attachViewToParent(param0: android.view.View, param1: number, param2: android.view.ViewGroup.LayoutParams): void;
							detachViewFromParent(param0: number): void;
							onEnteredHiddenState(param0: android.view.View): void;
							onLeftHiddenState(param0: android.view.View): void;
						});
						public onLeftHiddenState(param0: android.view.View): void;
						public removeAllViews(): void;
						public onEnteredHiddenState(param0: android.view.View): void;
						public getChildCount(): number;
						public addView(param0: android.view.View, param1: number): void;
						public attachViewToParent(param0: android.view.View, param1: number, param2: android.view.ViewGroup.LayoutParams): void;
						public removeViewAt(param0: number): void;
						public getChildAt(param0: number): android.view.View;
						public indexOfChild(param0: android.view.View): number;
						public getChildViewHolder(param0: android.view.View): android.support.v7.widget.RecyclerView.ViewHolder;
						public detachViewFromParent(param0: number): void;
					}
				}
			}
		}
	}
}

import javautilList = java.util.List;
/// <reference path="./android.view.View.d.ts" />
/// <reference path="./java.util.List.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class DefaultItemAnimator extends android.support.v7.widget.SimpleItemAnimator {
					public isRunning(param0: android.support.v7.widget.RecyclerView.ItemAnimator.ItemAnimatorFinishedListener): boolean;
					public animateChange(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ViewHolder, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param3: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): boolean;
					public endAnimations(): void;
					public runPendingAnimations(): void;
					public endAnimation(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public canReuseUpdatedViewHolder(param0: android.support.v7.widget.RecyclerView.ViewHolder): boolean;
					public animateRemove(param0: android.support.v7.widget.RecyclerView.ViewHolder): boolean;
					public animateChange(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ViewHolder, param2: number, param3: number, param4: number, param5: number): boolean;
					public constructor();
					public animateAdd(param0: android.support.v7.widget.RecyclerView.ViewHolder): boolean;
					public isRunning(): boolean;
					public canReuseUpdatedViewHolder(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: javautilList<java.lang.Object>): boolean;
					public animateMove(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: number, param2: number, param3: number, param4: number): boolean;
				}
				export module DefaultItemAnimator {
					export class ChangeInfo {
						public oldHolder: android.support.v7.widget.RecyclerView.ViewHolder;
						public newHolder: android.support.v7.widget.RecyclerView.ViewHolder;
						public fromX: number;
						public fromY: number;
						public toX: number;
						public toY: number;
						public toString(): string;
					}
					export class MoveInfo {
						public holder: android.support.v7.widget.RecyclerView.ViewHolder;
						public fromX: number;
						public fromY: number;
						public toX: number;
						public toY: number;
					}
					export class VpaListenerAdapter {
						public onAnimationCancel(param0: android.view.View): void;
						public onAnimationEnd(param0: android.view.View): void;
						public onAnimationStart(param0: android.view.View): void;
					}
				}
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.graphics.Rect.d.ts" />
/// <reference path="./android.support.v4.view.accessibility.AccessibilityNodeInfoCompat.d.ts" />
/// <reference path="./android.support.v7.widget.RecyclerView.d.ts" />
/// <reference path="./android.util.AttributeSet.d.ts" />
/// <reference path="./android.view.View.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class GridLayoutManager extends android.support.v7.widget.LinearLayoutManager {
					public static DEFAULT_SPAN_COUNT: number;
					public setMeasuredDimension(param0: number, param1: number): void;
					public constructor(context: android.content.Context, spanCount: number);
					public onItemsChanged(param0: android.support.v7.widget.RecyclerView): void;
					public onItemsUpdated(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number): void;
					public onItemsMoved(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number, param3: number): void;
					public setSpanSizeLookup(param0: android.support.v7.widget.GridLayoutManager.SpanSizeLookup): void;
					public supportsPredictiveItemAnimations(): boolean;
					public checkLayoutParams(param0: android.support.v7.widget.RecyclerView.LayoutParams): boolean;
					public constructor(context: android.content.Context, spanCount: number, orientation: number, reverseLayout: boolean);
					public onItemsAdded(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number): void;
					public scrollVerticallyBy(param0: number, param1: android.support.v7.widget.RecyclerView.Recycler, param2: android.support.v7.widget.RecyclerView.State): number;
					public onInitializeAccessibilityNodeInfoForItem(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State, param2: android.view.View, param3: android.support.v4.view.accessibility.AccessibilityNodeInfoCompat): void;
					public scrollHorizontallyBy(param0: number, param1: android.support.v7.widget.RecyclerView.Recycler, param2: android.support.v7.widget.RecyclerView.State): number;
					public constructor();
					public getRowCountForAccessibility(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): number;
					public prepareForDrop(param0: android.view.View, param1: android.view.View, param2: number, param3: number): void;
					public setSpanCount(param0: number): void;
					public setStackFromEnd(param0: boolean): void;
					public getSpanCount(): number;
					public onFocusSearchFailed(param0: android.view.View, param1: number, param2: android.support.v7.widget.RecyclerView.Recycler, param3: android.support.v7.widget.RecyclerView.State): android.view.View;
					public constructor(param0: android.content.Context, param1: number, param2: boolean);
					public generateDefaultLayoutParams(): android.support.v7.widget.RecyclerView.LayoutParams;
					public constructor(param0: android.content.Context, param1: android.util.AttributeSet, param2: number, param3: number);
					public generateLayoutParams(param0: android.content.Context, param1: android.util.AttributeSet): android.support.v7.widget.RecyclerView.LayoutParams;
					public generateLayoutParams(param0: android.view.ViewGroup.LayoutParams): android.support.v7.widget.RecyclerView.LayoutParams;
					public setMeasuredDimension(param0: android.graphics.Rect, param1: number, param2: number): void;
					public onItemsRemoved(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number): void;
					public constructor(param0: android.content.Context);
					public getSpanSizeLookup(): android.support.v7.widget.GridLayoutManager.SpanSizeLookup;
					public getColumnCountForAccessibility(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): number;
					public onItemsUpdated(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number, param3: javalangObject): void;
					public onLayoutChildren(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): void;
				}
				export module GridLayoutManager {
					export class DefaultSpanSizeLookup extends android.support.v7.widget.GridLayoutManager.SpanSizeLookup {
						public getSpanIndex(param0: number, param1: number): number;
						public getSpanSize(param0: number): number;
						public constructor();
					}
					export class LayoutParams extends android.support.v7.widget.RecyclerView.LayoutParams {
						public static INVALID_SPAN_ID: number;
						public constructor(param0: android.view.ViewGroup.MarginLayoutParams);
						public constructor(param0: android.view.ViewGroup.LayoutParams);
						public constructor(param0: android.content.Context, param1: android.util.AttributeSet);
						public getSpanIndex(): number;
						public getSpanSize(): number;
						public constructor(param0: android.support.v7.widget.RecyclerView.LayoutParams);
						public constructor(param0: number, param1: number);
					}
					export abstract class SpanSizeLookup {
						public getSpanIndex(param0: number, param1: number): number;
						public getSpanSize(param0: number): number;
						public constructor();
						public invalidateSpanIndexCache(): void;
						public setSpanIndexCacheEnabled(param0: boolean): void;
						public getSpanGroupIndex(param0: number, param1: number): number;
						public isSpanIndexCacheEnabled(): boolean;
					}
				}
			}
		}
	}
}

declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class LayoutState {
					public toString(): string;
				}
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.graphics.PointF.d.ts" />
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./android.os.Parcelable.d.ts" />
/// <reference path="./android.support.v7.widget.RecyclerView.d.ts" />
/// <reference path="./android.util.AttributeSet.d.ts" />
/// <reference path="./android.view.View.d.ts" />
/// <reference path="./android.view.accessibility.AccessibilityEvent.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class LinearLayoutManager extends android.support.v7.widget.RecyclerView.LayoutManager implements android.support.v7.widget.helper.ItemTouchHelper.ViewDropHandler {
					public static HORIZONTAL: number;
					public static VERTICAL: number;
					public static INVALID_OFFSET: number;
					public onInitializeAccessibilityEvent(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State, param2: android.view.accessibility.AccessibilityEvent): void;
					public computeVerticalScrollOffset(param0: android.support.v7.widget.RecyclerView.State): number;
					public computeHorizontalScrollExtent(param0: android.support.v7.widget.RecyclerView.State): number;
					public computeScrollVectorForPosition(param0: number): android.graphics.PointF;
					public findLastCompletelyVisibleItemPosition(): number;
					public onInitializeAccessibilityEvent(param0: android.view.accessibility.AccessibilityEvent): void;
					public computeHorizontalScrollRange(param0: android.support.v7.widget.RecyclerView.State): number;
					public assertNotInLayoutOrScroll(param0: string): void;
					public getReverseLayout(): boolean;
					public supportsPredictiveItemAnimations(): boolean;
					public setReverseLayout(param0: boolean): void;
					public scrollToPositionWithOffset(param0: number, param1: number): void;
					public setRecycleChildrenOnDetach(param0: boolean): void;
					public scrollToPosition(param0: number): void;
					public setSmoothScrollbarEnabled(param0: boolean): void;
					public scrollVerticallyBy(param0: number, param1: android.support.v7.widget.RecyclerView.Recycler, param2: android.support.v7.widget.RecyclerView.State): number;
					public scrollHorizontallyBy(param0: number, param1: android.support.v7.widget.RecyclerView.Recycler, param2: android.support.v7.widget.RecyclerView.State): number;
					public findLastVisibleItemPosition(): number;
					public getStackFromEnd(): boolean;
					public computeVerticalScrollRange(param0: android.support.v7.widget.RecyclerView.State): number;
					public constructor();
					public findFirstCompletelyVisibleItemPosition(): number;
					public prepareForDrop(param0: android.view.View, param1: android.view.View, param2: number, param3: number): void;
					public getRecycleChildrenOnDetach(): boolean;
					public findViewByPosition(param0: number): android.view.View;
					public computeHorizontalScrollOffset(param0: android.support.v7.widget.RecyclerView.State): number;
					public setStackFromEnd(param0: boolean): void;
					public smoothScrollToPosition(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.State, param2: number): void;
					public getOrientation(): number;
					public onDetachedFromWindow(param0: android.support.v7.widget.RecyclerView): void;
					public canScrollVertically(): boolean;
					public isLayoutRTL(): boolean;
					public getExtraLayoutSpace(param0: android.support.v7.widget.RecyclerView.State): number;
					public onFocusSearchFailed(param0: android.view.View, param1: number, param2: android.support.v7.widget.RecyclerView.Recycler, param3: android.support.v7.widget.RecyclerView.State): android.view.View;
					public constructor(param0: android.content.Context, param1: number, param2: boolean);
					public generateDefaultLayoutParams(): android.support.v7.widget.RecyclerView.LayoutParams;
					public onRestoreInstanceState(param0: android.os.Parcelable): void;
					public setOrientation(param0: number): void;
					public constructor(param0: android.content.Context, param1: android.util.AttributeSet, param2: number, param3: number);
					public isSmoothScrollbarEnabled(): boolean;
					public findFirstVisibleItemPosition(): number;
					public canScrollHorizontally(): boolean;
					public constructor(param0: android.content.Context);
					public computeVerticalScrollExtent(param0: android.support.v7.widget.RecyclerView.State): number;
					public onDetachedFromWindow(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.Recycler): void;
					public onLayoutChildren(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): void;
					public onSaveInstanceState(): android.os.Parcelable;
				}
				export module LinearLayoutManager {
					export class AnchorInfo {
						public assignFromViewAndKeepVisibleRect(param0: android.view.View): void;
						public assignFromView(param0: android.view.View): void;
						public toString(): string;
					}
					export class LayoutChunkResult {
						public mConsumed: number;
						public mFinished: boolean;
						public mIgnoreConsumed: boolean;
						public mFocusable: boolean;
						public constructor();
					}
					export class LayoutState {
						public nextViewInLimitedList(param0: android.view.View): android.view.View;
						public assignPositionFromScrapList(): void;
						public assignPositionFromScrapList(param0: android.view.View): void;
					}
					export class SavedState {
						public static CREATOR: android.os.Parcelable.Creator<SavedState>;
						public constructor();
						public describeContents(): number;
						public writeToParcel(param0: android.os.Parcel, param1: number): void;
						public constructor(param0: android.support.v7.widget.LinearLayoutManager.SavedState);
					}
				}
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.graphics.PointF.d.ts" />
/// <reference path="./android.util.DisplayMetrics.d.ts" />
/// <reference path="./android.view.View.d.ts" />
/// <reference path="./android.view.animation.DecelerateInterpolator.d.ts" />
/// <reference path="./android.view.animation.LinearInterpolator.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export abstract class LinearSmoothScroller extends android.support.v7.widget.RecyclerView.SmoothScroller {
					public static SNAP_TO_START: number;
					public static SNAP_TO_END: number;
					public static SNAP_TO_ANY: number;
					public mLinearInterpolator: android.view.animation.LinearInterpolator;
					public mDecelerateInterpolator: android.view.animation.DecelerateInterpolator;
					public mTargetVector: android.graphics.PointF;
					public mInterimTargetDx: number;
					public mInterimTargetDy: number;
					public getHorizontalSnapPreference(): number;
					public calculateSpeedPerPixel(param0: android.util.DisplayMetrics): number;
					public calculateTimeForScrolling(param0: number): number;
					public computeScrollVectorForPosition(param0: number): android.graphics.PointF;
					public calculateDxToMakeVisible(param0: android.view.View, param1: number): number;
					public onTargetFound(param0: android.view.View, param1: android.support.v7.widget.RecyclerView.State, param2: android.support.v7.widget.RecyclerView.SmoothScroller.Action): void;
					public onStart(): void;
					public onSeekTargetStep(param0: number, param1: number, param2: android.support.v7.widget.RecyclerView.State, param3: android.support.v7.widget.RecyclerView.SmoothScroller.Action): void;
					public updateActionForInterimTarget(param0: android.support.v7.widget.RecyclerView.SmoothScroller.Action): void;
					public constructor(param0: android.content.Context);
					public constructor();
					public onStop(): void;
					public calculateDyToMakeVisible(param0: android.view.View, param1: number): number;
					public calculateDtToFit(param0: number, param1: number, param2: number, param3: number, param4: number): number;
					public calculateTimeForDeceleration(param0: number): number;
					public getVerticalSnapPreference(): number;
				}
			}
		}
	}
}

/// <reference path="./java.lang.Object.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class OpReorderer {
					public constructor(param0: android.support.v7.widget.OpReorderer.Callback);
				}
				export module OpReorderer {
					export class Callback {
						/**
						 * Constructs a new instance of the android.support.v7.widget.OpReorderer$Callback interface with the provided implementation.
						 */
						public constructor(implementation: {
							obtainUpdateOp(param0: number, param1: number, param2: number, param3: javalangObject): android.support.v7.widget.AdapterHelper.UpdateOp;
							recycleUpdateOp(param0: android.support.v7.widget.AdapterHelper.UpdateOp): void;
						});
						public obtainUpdateOp(param0: number, param1: number, param2: number, param3: javalangObject): android.support.v7.widget.AdapterHelper.UpdateOp;
						public recycleUpdateOp(param0: android.support.v7.widget.AdapterHelper.UpdateOp): void;
					}
				}
			}
		}
	}
}

/// <reference path="./android.view.View.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export abstract class OrientationHelper {
					public mLayoutManager: android.support.v7.widget.RecyclerView.LayoutManager;
					public static HORIZONTAL: number;
					public static VERTICAL: number;
					public getTotalSpace(): number;
					public getEnd(): number;
					public getTotalSpaceChange(): number;
					public getEndAfterPadding(): number;
					public getDecoratedEnd(param0: android.view.View): number;
					public getDecoratedMeasurementInOther(param0: android.view.View): number;
					public getEndPadding(): number;
					public getDecoratedMeasurement(param0: android.view.View): number;
					public getStartAfterPadding(): number;
					public offsetChildren(param0: number): void;
					public static createVerticalHelper(param0: android.support.v7.widget.RecyclerView.LayoutManager): android.support.v7.widget.OrientationHelper;
					public static createHorizontalHelper(param0: android.support.v7.widget.RecyclerView.LayoutManager): android.support.v7.widget.OrientationHelper;
					public offsetChild(param0: android.view.View, param1: number): void;
					public getDecoratedStart(param0: android.view.View): number;
					public onLayoutComplete(): void;
					public getMode(): number;
					public static createOrientationHelper(param0: android.support.v7.widget.RecyclerView.LayoutManager, param1: number): android.support.v7.widget.OrientationHelper;
					public getModeInOther(): number;
				}
			}
		}
	}
}

import javautilArrayList = java.util.ArrayList;
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.util.ArrayList.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class PositionMap {
					public valueAt(param0: number): javalangObject;
					public keyAt(param0: number): number;
					public insertKeyRange(param0: number, param1: number): void;
					public indexOfValue(param0: javalangObject): number;
					public append(param0: number, param1: javalangObject): void;
					public size(): number;
					public removeAtRange(param0: number, param1: number): void;
					public clone(): android.support.v7.widget.PositionMap;
					public removeKeyRange(param0: javautilArrayList<java.lang.Object>, param1: number, param2: number): void;
					public setValueAt(param0: number, param1: javalangObject): void;
					public toString(): string;
					public put(param0: number, param1: javalangObject): void;
					public get(param0: number, param1: javalangObject): javalangObject;
					public constructor();
					public delete(param0: number): void;
					public clear(): void;
					public get(param0: number): javalangObject;
					public remove(param0: number): void;
					public removeAt(param0: number): void;
					public constructor(param0: number);
					public indexOfKey(param0: number): number;
				}
				export module PositionMap {
					export class ContainerHelpers {
					}
				}
			}
		}
	}
}

import javalangRunnable = java.lang.Runnable;
/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.graphics.Canvas.d.ts" />
/// <reference path="./android.graphics.PointF.d.ts" />
/// <reference path="./android.graphics.Rect.d.ts" />
/// <reference path="./android.os.Bundle.d.ts" />
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./android.os.Parcelable.d.ts" />
/// <reference path="./android.support.v4.view.accessibility.AccessibilityNodeInfoCompat.d.ts" />
/// <reference path="./android.support.v7.widget.RecyclerView.d.ts" />
/// <reference path="./android.support.v7.widget.RecyclerViewAccessibilityDelegate.d.ts" />
/// <reference path="./android.util.AttributeSet.d.ts" />
/// <reference path="./android.util.SparseArray.d.ts" />
/// <reference path="./android.view.MotionEvent.d.ts" />
/// <reference path="./android.view.View.d.ts" />
/// <reference path="./android.view.ViewGroup.d.ts" />
/// <reference path="./android.view.accessibility.AccessibilityEvent.d.ts" />
/// <reference path="./android.view.animation.Interpolator.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.lang.Runnable.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.ArrayList.d.ts" />
/// <reference path="./java.util.List.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class RecyclerView {
					public static HORIZONTAL: number;
					public static VERTICAL: number;
					public static NO_POSITION: number;
					public static NO_ID: number;
					public static INVALID_TYPE: number;
					public static TOUCH_SLOP_DEFAULT: number;
					public static TOUCH_SLOP_PAGING: number;
					public static SCROLL_STATE_IDLE: number;
					public static SCROLL_STATE_DRAGGING: number;
					public static SCROLL_STATE_SETTLING: number;
					public onDraw(param0: android.graphics.Canvas): void;
					public getChildDrawingOrder(param0: number, param1: number): number;
					public addItemDecoration(param0: android.support.v7.widget.RecyclerView.ItemDecoration): void;
					public getChildAdapterPosition(param0: android.view.View): number;
					public scrollToPosition(param0: number): void;
					public removeItemDecoration(param0: android.support.v7.widget.RecyclerView.ItemDecoration): void;
					public onChildDetachedFromWindow(param0: android.view.View): void;
					public stopNestedScroll(): void;
					public computeHorizontalScrollExtent(): number;
					public getMinFlingVelocity(): number;
					public setAdapter(param0: android.support.v7.widget.RecyclerView.Adapter): void;
					public getAdapter(): android.support.v7.widget.RecyclerView.Adapter;
					public removeOnChildAttachStateChangeListener(param0: android.support.v7.widget.RecyclerView.OnChildAttachStateChangeListener): void;
					public onTouchEvent(param0: android.view.MotionEvent): boolean;
					public setRecycledViewPool(param0: android.support.v7.widget.RecyclerView.RecycledViewPool): void;
					public offsetChildrenHorizontal(param0: number): void;
					public isComputingLayout(): boolean;
					public addItemDecoration(param0: android.support.v7.widget.RecyclerView.ItemDecoration, param1: number): void;
					public onChildAttachedToWindow(param0: android.view.View): void;
					public removeDetachedView(param0: android.view.View, param1: boolean): void;
					public offsetChildrenVertical(param0: number): void;
					public dispatchNestedFling(param0: number, param1: number, param2: boolean): boolean;
					public setScrollingTouchSlop(param0: number): void;
					public scrollTo(param0: number, param1: number): void;
					public onGenericMotionEvent(param0: android.view.MotionEvent): boolean;
					public getRecycledViewPool(): android.support.v7.widget.RecyclerView.RecycledViewPool;
					public onInterceptTouchEvent(param0: android.view.MotionEvent): boolean;
					public removeOnItemTouchListener(param0: android.support.v7.widget.RecyclerView.OnItemTouchListener): void;
					public invalidateItemDecorations(): void;
					public isAnimating(): boolean;
					public getChildItemId(param0: android.view.View): number;
					public findViewHolderForLayoutPosition(param0: number): android.support.v7.widget.RecyclerView.ViewHolder;
					public requestChildRectangleOnScreen(param0: android.view.View, param1: android.graphics.Rect, param2: boolean): boolean;
					public getChildPosition(param0: android.view.View): number;
					public getChildViewHolder(param0: android.view.View): android.support.v7.widget.RecyclerView.ViewHolder;
					public addFocusables(param0: javautilArrayList<android.view.View>, param1: number, param2: number): void;
					public setNestedScrollingEnabled(param0: boolean): void;
					public generateDefaultLayoutParams(): android.view.ViewGroup.LayoutParams;
					public stopScroll(): void;
					public requestLayout(): void;
					public hasPendingAdapterUpdates(): boolean;
					public onDetachedFromWindow(): void;
					public onMeasure(param0: number, param1: number): void;
					public constructor(param0: android.content.Context, param1: android.util.AttributeSet, param2: number);
					public getItemAnimator(): android.support.v7.widget.RecyclerView.ItemAnimator;
					public computeVerticalScrollRange(): number;
					public onRestoreInstanceState(param0: android.os.Parcelable): void;
					public onScrolled(param0: number, param1: number): void;
					public setItemAnimator(param0: android.support.v7.widget.RecyclerView.ItemAnimator): void;
					public smoothScrollToPosition(param0: number): void;
					public constructor(param0: android.content.Context);
					public dispatchSaveInstanceState(param0: android.util.SparseArray<android.os.Parcelable>): void;
					public isNestedScrollingEnabled(): boolean;
					public focusSearch(focused: android.view.View, direction: number): android.view.View;
					public checkLayoutParams(param0: android.view.ViewGroup.LayoutParams): boolean;
					public getChildLayoutPosition(param0: android.view.View): number;
					public dispatchNestedPreFling(param0: number, param1: number): boolean;
					public computeHorizontalScrollOffset(): number;
					public setHasFixedSize(param0: boolean): void;
					public findContainingViewHolder(param0: android.view.View): android.support.v7.widget.RecyclerView.ViewHolder;
					public sendAccessibilityEventUnchecked(param0: android.view.accessibility.AccessibilityEvent): void;
					public getScrollState(): number;
					public dispatchNestedPreScroll(param0: number, param1: number, param2: native.Array<number>, param3: native.Array<number>): boolean;
					public computeHorizontalScrollRange(): number;
					public onAttachedToWindow(): void;
					public setAccessibilityDelegateCompat(param0: android.support.v7.widget.RecyclerViewAccessibilityDelegate): void;
					public findViewHolderForItemId(param0: number): android.support.v7.widget.RecyclerView.ViewHolder;
					public swapAdapter(param0: android.support.v7.widget.RecyclerView.Adapter, param1: boolean): void;
					public generateLayoutParams(param0: android.util.AttributeSet): android.view.ViewGroup.LayoutParams;
					public setItemViewCacheSize(param0: number): void;
					public computeVerticalScrollExtent(): number;
					public setChildDrawingOrderCallback(param0: android.support.v7.widget.RecyclerView.ChildDrawingOrderCallback): void;
					public addOnChildAttachStateChangeListener(param0: android.support.v7.widget.RecyclerView.OnChildAttachStateChangeListener): void;
					public requestChildFocus(param0: android.view.View, param1: android.view.View): void;
					public onScrollStateChanged(param0: number): void;
					public getCompatAccessibilityDelegate(): android.support.v7.widget.RecyclerViewAccessibilityDelegate;
					public getLayoutManager(): android.support.v7.widget.RecyclerView.LayoutManager;
					public computeVerticalScrollOffset(): number;
					public dispatchNestedScroll(param0: number, param1: number, param2: number, param3: number, param4: native.Array<number>): boolean;
					public findContainingItemView(param0: android.view.View): android.view.View;
					public setLayoutFrozen(param0: boolean): void;
					public dispatchRestoreInstanceState(param0: android.util.SparseArray<android.os.Parcelable>): void;
					public clearOnChildAttachStateChangeListeners(): void;
					public setLayoutManager(param0: android.support.v7.widget.RecyclerView.LayoutManager): void;
					public findViewHolderForAdapterPosition(param0: number): android.support.v7.widget.RecyclerView.ViewHolder;
					public onSaveInstanceState(): android.os.Parcelable;
					public isAttachedToWindow(): boolean;
					public scrollBy(param0: number, param1: number): void;
					public getBaseline(): number;
					public findChildViewUnder(param0: number, param1: number): android.view.View;
					public clearOnScrollListeners(): void;
					public addOnScrollListener(param0: android.support.v7.widget.RecyclerView.OnScrollListener): void;
					public requestDisallowInterceptTouchEvent(param0: boolean): void;
					public setClipToPadding(param0: boolean): void;
					public fling(param0: number, param1: number): boolean;
					public draw(param0: android.graphics.Canvas): void;
					public findViewHolderForPosition(param0: number): android.support.v7.widget.RecyclerView.ViewHolder;
					public hasFixedSize(): boolean;
					public isLayoutFrozen(): boolean;
					public generateLayoutParams(param0: android.view.ViewGroup.LayoutParams): android.view.ViewGroup.LayoutParams;
					public setOnScrollListener(param0: android.support.v7.widget.RecyclerView.OnScrollListener): void;
					public onSizeChanged(param0: number, param1: number, param2: number, param3: number): void;
					public getMaxFlingVelocity(): number;
					public setRecyclerListener(param0: android.support.v7.widget.RecyclerView.RecyclerListener): void;
					public constructor(param0: android.content.Context, param1: android.util.AttributeSet);
					public smoothScrollBy(param0: number, param1: number): void;
					public drawChild(param0: android.graphics.Canvas, param1: android.view.View, param2: number): boolean;
					public onLayout(param0: boolean, param1: number, param2: number, param3: number, param4: number): void;
					public setViewCacheExtension(param0: android.support.v7.widget.RecyclerView.ViewCacheExtension): void;
					public addOnItemTouchListener(param0: android.support.v7.widget.RecyclerView.OnItemTouchListener): void;
					public startNestedScroll(param0: number): boolean;
					public hasNestedScrollingParent(): boolean;
					public removeOnScrollListener(param0: android.support.v7.widget.RecyclerView.OnScrollListener): void;
				}
				export module RecyclerView {
					export abstract class Adapter {
						public notifyItemMoved(param0: number, param1: number): void;
						public setHasStableIds(param0: boolean): void;
						public unregisterAdapterDataObserver(param0: android.support.v7.widget.RecyclerView.AdapterDataObserver): void;
						public createViewHolder(param0: android.view.ViewGroup, param1: number): android.support.v7.widget.RecyclerView.ViewHolder;
						public hasStableIds(): boolean;
						public onCreateViewHolder(param0: android.view.ViewGroup, param1: number): android.support.v7.widget.RecyclerView.ViewHolder;
						public bindViewHolder(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: number): void;
						public onBindViewHolder(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: number, param2: javautilList<java.lang.Object>): void;
						public onFailedToRecycleView(param0: android.support.v7.widget.RecyclerView.ViewHolder): boolean;
						public getItemId(param0: number): number;
						public onViewRecycled(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public notifyItemChanged(param0: number): void;
						public notifyItemInserted(param0: number): void;
						public onAttachedToRecyclerView(param0: android.support.v7.widget.RecyclerView): void;
						public constructor();
						public hasObservers(): boolean;
						public onViewAttachedToWindow(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public onViewDetachedFromWindow(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public onBindViewHolder(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: number): void;
						public getItemViewType(param0: number): number;
						public notifyItemRangeChanged(param0: number, param1: number): void;
						public notifyItemRangeChanged(param0: number, param1: number, param2: javalangObject): void;
						public notifyItemRangeRemoved(param0: number, param1: number): void;
						public onDetachedFromRecyclerView(param0: android.support.v7.widget.RecyclerView): void;
						public notifyDataSetChanged(): void;
						public notifyItemRangeInserted(param0: number, param1: number): void;
						public getItemCount(): number;
						public notifyItemChanged(param0: number, param1: javalangObject): void;
						public notifyItemRemoved(param0: number): void;
						public registerAdapterDataObserver(param0: android.support.v7.widget.RecyclerView.AdapterDataObserver): void;
					}
					export class AdapterDataObservable {
						public notifyItemMoved(param0: number, param1: number): void;
						public hasObservers(): boolean;
						public notifyItemRangeInserted(param0: number, param1: number): void;
						public notifyItemRangeChanged(param0: number, param1: number): void;
						public notifyItemRangeChanged(param0: number, param1: number, param2: javalangObject): void;
						public notifyChanged(): void;
						public notifyItemRangeRemoved(param0: number, param1: number): void;
					}
					export abstract class AdapterDataObserver {
						public onItemRangeChanged(param0: number, param1: number, param2: javalangObject): void;
						public constructor();
						public onChanged(): void;
						public onItemRangeMoved(param0: number, param1: number, param2: number): void;
						public onItemRangeChanged(param0: number, param1: number): void;
						public onItemRangeInserted(param0: number, param1: number): void;
						public onItemRangeRemoved(param0: number, param1: number): void;
					}
					export class ChildDrawingOrderCallback {
						/**
						 * Constructs a new instance of the android.support.v7.widget.RecyclerView$ChildDrawingOrderCallback interface with the provided implementation.
						 */
						public constructor(implementation: {
							onGetChildDrawingOrder(param0: number, param1: number): number;
						});
						public onGetChildDrawingOrder(param0: number, param1: number): number;
					}
					export abstract class ItemAnimator {
						public static FLAG_CHANGED: number;
						public static FLAG_REMOVED: number;
						public static FLAG_INVALIDATED: number;
						public static FLAG_MOVED: number;
						public static FLAG_APPEARED_IN_PRE_LAYOUT: number;
						public setMoveDuration(param0: number): void;
						public animatePersistence(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): boolean;
						public dispatchAnimationStarted(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public getMoveDuration(): number;
						public endAnimations(): void;
						public animateAppearance(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): boolean;
						public isRunning(): boolean;
						public runPendingAnimations(): void;
						public animateDisappearance(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): boolean;
						public onAnimationFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public getAddDuration(): number;
						public setAddDuration(param0: number): void;
						public canReuseUpdatedViewHolder(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: javautilList<java.lang.Object>): boolean;
						public setChangeDuration(param0: number): void;
						public recordPostLayoutInformation(param0: android.support.v7.widget.RecyclerView.State, param1: android.support.v7.widget.RecyclerView.ViewHolder): android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo;
						public recordPreLayoutInformation(param0: android.support.v7.widget.RecyclerView.State, param1: android.support.v7.widget.RecyclerView.ViewHolder, param2: number, param3: javautilList<java.lang.Object>): android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo;
						public dispatchAnimationsFinished(): void;
						public getChangeDuration(): number;
						public constructor();
						public obtainHolderInfo(): android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo;
						public dispatchAnimationFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public canReuseUpdatedViewHolder(param0: android.support.v7.widget.RecyclerView.ViewHolder): boolean;
						public endAnimation(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public setRemoveDuration(param0: number): void;
						public animateChange(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ViewHolder, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param3: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): boolean;
						public onAnimationStarted(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public isRunning(param0: android.support.v7.widget.RecyclerView.ItemAnimator.ItemAnimatorFinishedListener): boolean;
						public getRemoveDuration(): number;
					}
					export module ItemAnimator {
						export class AdapterChanges {
							/**
							 * Constructs a new instance of the android.support.v7.widget.RecyclerView$ItemAnimator$AdapterChanges interface with the provided implementation.
							 */
							public constructor(implementation: {
							});
						}
						export class ItemAnimatorFinishedListener {
							/**
							 * Constructs a new instance of the android.support.v7.widget.RecyclerView$ItemAnimator$ItemAnimatorFinishedListener interface with the provided implementation.
							 */
							public constructor(implementation: {
								onAnimationsFinished(): void;
							});
							public onAnimationsFinished(): void;
						}
						export class ItemAnimatorListener {
							/**
							 * Constructs a new instance of the android.support.v7.widget.RecyclerView$ItemAnimator$ItemAnimatorListener interface with the provided implementation.
							 */
							public constructor(implementation: {
								onAnimationFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
							});
							public onAnimationFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						}
						export class ItemHolderInfo {
							public left: number;
							public top: number;
							public right: number;
							public bottom: number;
							public changeFlags: number;
							public constructor();
							public setFrom(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: number): android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo;
							public setFrom(param0: android.support.v7.widget.RecyclerView.ViewHolder): android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo;
						}
					}
					export class ItemAnimatorRestoreListener {
						public onAnimationFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					}
					export abstract class ItemDecoration {
						public onDrawOver(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.support.v7.widget.RecyclerView.State): void;
						public constructor();
						public onDraw(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView): void;
						public getItemOffsets(param0: android.graphics.Rect, param1: android.view.View, param2: android.support.v7.widget.RecyclerView, param3: android.support.v7.widget.RecyclerView.State): void;
						public onDraw(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.support.v7.widget.RecyclerView.State): void;
						public onDrawOver(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView): void;
						public getItemOffsets(param0: android.graphics.Rect, param1: number, param2: android.support.v7.widget.RecyclerView): void;
					}
					export abstract class LayoutManager {
						public onMeasure(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State, param2: number, param3: number): void;
						public isLayoutHierarchical(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): boolean;
						public measureChildWithMargins(param0: android.view.View, param1: number, param2: number): void;
						public onItemsRemoved(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number): void;
						public getPaddingBottom(): number;
						public onSaveInstanceState(): android.os.Parcelable;
						public onInitializeAccessibilityNodeInfoForItem(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State, param2: android.view.View, param3: android.support.v4.view.accessibility.AccessibilityNodeInfoCompat): void;
						public addView(param0: android.view.View): void;
						public computeVerticalScrollExtent(param0: android.support.v7.widget.RecyclerView.State): number;
						public getRowCountForAccessibility(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): number;
						public layoutDecorated(param0: android.view.View, param1: number, param2: number, param3: number, param4: number): void;
						public generateDefaultLayoutParams(): android.support.v7.widget.RecyclerView.LayoutParams;
						public constructor();
						public onDetachedFromWindow(param0: android.support.v7.widget.RecyclerView): void;
						public postOnAnimation(param0: javalangRunnable): void;
						public isAutoMeasureEnabled(): boolean;
						public onItemsAdded(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number): void;
						public getDecoratedBottom(param0: android.view.View): number;
						public isSmoothScrolling(): boolean;
						public detachAndScrapAttachedViews(param0: android.support.v7.widget.RecyclerView.Recycler): void;
						public getFocusedChild(): android.view.View;
						public requestLayout(): void;
						public onItemsMoved(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number, param3: number): void;
						public attachView(param0: android.view.View, param1: number): void;
						public removeAndRecycleAllViews(param0: android.support.v7.widget.RecyclerView.Recycler): void;
						public static getChildMeasureSpec(param0: number, param1: number, param2: number, param3: boolean): number;
						public generateLayoutParams(param0: android.content.Context, param1: android.util.AttributeSet): android.support.v7.widget.RecyclerView.LayoutParams;
						public getPaddingTop(): number;
						public computeHorizontalScrollOffset(param0: android.support.v7.widget.RecyclerView.State): number;
						public onAddFocusables(param0: android.support.v7.widget.RecyclerView, param1: javautilArrayList<android.view.View>, param2: number, param3: number): boolean;
						public getMinimumWidth(): number;
						public removeViewAt(param0: number): void;
						public getPaddingLeft(): number;
						public setMeasuredDimension(param0: number, param1: number): void;
						public isFocused(): boolean;
						public onItemsUpdated(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number, param3: javalangObject): void;
						public getDecoratedLeft(param0: android.view.View): number;
						public scrollHorizontallyBy(param0: number, param1: android.support.v7.widget.RecyclerView.Recycler, param2: android.support.v7.widget.RecyclerView.State): number;
						public isMeasurementCacheEnabled(): boolean;
						public removeAndRecycleViewAt(param0: number, param1: android.support.v7.widget.RecyclerView.Recycler): void;
						public assertInLayoutOrScroll(param0: string): void;
						public performAccessibilityAction(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State, param2: number, param3: android.os.Bundle): boolean;
						public onItemsChanged(param0: android.support.v7.widget.RecyclerView): void;
						public canScrollVertically(): boolean;
						public onDetachedFromWindow(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.Recycler): void;
						public getChildCount(): number;
						public getRightDecorationWidth(param0: android.view.View): number;
						public getWidthMode(): number;
						public getHeight(): number;
						public calculateItemDecorationsForChild(param0: android.view.View, param1: android.graphics.Rect): void;
						public supportsPredictiveItemAnimations(): boolean;
						public removeAllViews(): void;
						public onScrollStateChanged(param0: number): void;
						public getItemCount(): number;
						public getColumnCountForAccessibility(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): number;
						public findContainingItemView(param0: android.view.View): android.view.View;
						public removeAndRecycleView(param0: android.view.View, param1: android.support.v7.widget.RecyclerView.Recycler): void;
						public requestChildRectangleOnScreen(param0: android.support.v7.widget.RecyclerView, param1: android.view.View, param2: android.graphics.Rect, param3: boolean): boolean;
						public startSmoothScroll(param0: android.support.v7.widget.RecyclerView.SmoothScroller): void;
						public getLayoutDirection(): number;
						public getPosition(param0: android.view.View): number;
						public checkLayoutParams(param0: android.support.v7.widget.RecyclerView.LayoutParams): boolean;
						public detachAndScrapViewAt(param0: number, param1: android.support.v7.widget.RecyclerView.Recycler): void;
						public setMeasurementCacheEnabled(param0: boolean): void;
						public computeHorizontalScrollExtent(param0: android.support.v7.widget.RecyclerView.State): number;
						public getItemViewType(param0: android.view.View): number;
						public generateLayoutParams(param0: android.view.ViewGroup.LayoutParams): android.support.v7.widget.RecyclerView.LayoutParams;
						public getBaseline(): number;
						public getTopDecorationHeight(param0: android.view.View): number;
						public setAutoMeasureEnabled(param0: boolean): void;
						public removeCallbacks(param0: javalangRunnable): boolean;
						public onRequestChildFocus(param0: android.support.v7.widget.RecyclerView, param1: android.view.View, param2: android.view.View): boolean;
						public addDisappearingView(param0: android.view.View, param1: number): void;
						public onInitializeAccessibilityEvent(param0: android.view.accessibility.AccessibilityEvent): void;
						public getPaddingRight(): number;
						public getChildAt(param0: number): android.view.View;
						public ignoreView(param0: android.view.View): void;
						public onInitializeAccessibilityEvent(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State, param2: android.view.accessibility.AccessibilityEvent): void;
						public offsetChildrenHorizontal(param0: number): void;
						public onFocusSearchFailed(param0: android.view.View, param1: number, param2: android.support.v7.widget.RecyclerView.Recycler, param3: android.support.v7.widget.RecyclerView.State): android.view.View;
						public onAdapterChanged(param0: android.support.v7.widget.RecyclerView.Adapter, param1: android.support.v7.widget.RecyclerView.Adapter): void;
						public removeView(param0: android.view.View): void;
						public detachAndScrapView(param0: android.view.View, param1: android.support.v7.widget.RecyclerView.Recycler): void;
						public onInitializeAccessibilityNodeInfo(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State, param2: android.support.v4.view.accessibility.AccessibilityNodeInfoCompat): void;
						public getPaddingEnd(): number;
						public onLayoutChildren(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): void;
						public computeVerticalScrollRange(param0: android.support.v7.widget.RecyclerView.State): number;
						public getClipToPadding(): boolean;
						public onRequestChildFocus(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.State, param2: android.view.View, param3: android.view.View): boolean;
						public attachView(param0: android.view.View, param1: number, param2: android.support.v7.widget.RecyclerView.LayoutParams): void;
						public static getChildMeasureSpec(param0: number, param1: number, param2: number, param3: number, param4: boolean): number;
						public isAttachedToWindow(): boolean;
						public addView(param0: android.view.View, param1: number): void;
						public attachView(param0: android.view.View): void;
						public setMeasuredDimension(param0: android.graphics.Rect, param1: number, param2: number): void;
						public removeDetachedView(param0: android.view.View): void;
						public endAnimation(param0: android.view.View): void;
						public offsetChildrenVertical(param0: number): void;
						public static getProperties(param0: android.content.Context, param1: android.util.AttributeSet, param2: number, param3: number): android.support.v7.widget.RecyclerView.LayoutManager.Properties;
						public moveView(param0: number, param1: number): void;
						public getHeightMode(): number;
						public computeVerticalScrollOffset(param0: android.support.v7.widget.RecyclerView.State): number;
						public scrollToPosition(param0: number): void;
						public scrollVerticallyBy(param0: number, param1: android.support.v7.widget.RecyclerView.Recycler, param2: android.support.v7.widget.RecyclerView.State): number;
						public assertNotInLayoutOrScroll(param0: string): void;
						public getDecoratedTop(param0: android.view.View): number;
						public onInterceptFocusSearch(param0: android.view.View, param1: number): android.view.View;
						public requestSimpleAnimationsInNextLayout(): void;
						public smoothScrollToPosition(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.State, param2: number): void;
						public computeHorizontalScrollRange(param0: android.support.v7.widget.RecyclerView.State): number;
						public performAccessibilityActionForItem(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State, param2: android.view.View, param3: number, param4: android.os.Bundle): boolean;
						public onItemsUpdated(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number): void;
						public getSelectionModeForAccessibility(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): number;
						public hasFocus(): boolean;
						public getMinimumHeight(): number;
						public detachView(param0: android.view.View): void;
						public stopIgnoringView(param0: android.view.View): void;
						public measureChild(param0: android.view.View, param1: number, param2: number): void;
						public getBottomDecorationHeight(param0: android.view.View): number;
						public onAttachedToWindow(param0: android.support.v7.widget.RecyclerView): void;
						public getDecoratedMeasuredHeight(param0: android.view.View): number;
						public canScrollHorizontally(): boolean;
						public detachViewAt(param0: number): void;
						public static chooseSize(param0: number, param1: number, param2: number): number;
						public getWidth(): number;
						public addDisappearingView(param0: android.view.View): void;
						public getPaddingStart(): number;
						public getDecoratedRight(param0: android.view.View): number;
						public getLeftDecorationWidth(param0: android.view.View): number;
						public getDecoratedMeasuredWidth(param0: android.view.View): number;
						public onRestoreInstanceState(param0: android.os.Parcelable): void;
						public findViewByPosition(param0: number): android.view.View;
					}
					export module LayoutManager {
						export class Properties {
							public orientation: number;
							public spanCount: number;
							public reverseLayout: boolean;
							public stackFromEnd: boolean;
							public constructor();
						}
					}
					export class LayoutParams {
						public constructor(param0: android.view.ViewGroup.MarginLayoutParams);
						public isItemChanged(): boolean;
						public constructor(param0: android.content.Context, param1: android.util.AttributeSet);
						public constructor(param0: android.view.ViewGroup.LayoutParams);
						public isItemRemoved(): boolean;
						public getViewPosition(): number;
						public getViewAdapterPosition(): number;
						public isViewInvalid(): boolean;
						public constructor(param0: android.support.v7.widget.RecyclerView.LayoutParams);
						public getViewLayoutPosition(): number;
						public viewNeedsUpdate(): boolean;
						public constructor(param0: number, param1: number);
					}
					export class OnChildAttachStateChangeListener {
						/**
						 * Constructs a new instance of the android.support.v7.widget.RecyclerView$OnChildAttachStateChangeListener interface with the provided implementation.
						 */
						public constructor(implementation: {
							onChildViewAttachedToWindow(param0: android.view.View): void;
							onChildViewDetachedFromWindow(param0: android.view.View): void;
						});
						public onChildViewAttachedToWindow(param0: android.view.View): void;
						public onChildViewDetachedFromWindow(param0: android.view.View): void;
					}
					export class OnItemTouchListener {
						/**
						 * Constructs a new instance of the android.support.v7.widget.RecyclerView$OnItemTouchListener interface with the provided implementation.
						 */
						public constructor(implementation: {
							onInterceptTouchEvent(param0: android.support.v7.widget.RecyclerView, param1: android.view.MotionEvent): boolean;
							onTouchEvent(param0: android.support.v7.widget.RecyclerView, param1: android.view.MotionEvent): void;
							onRequestDisallowInterceptTouchEvent(param0: boolean): void;
						});
						public onInterceptTouchEvent(param0: android.support.v7.widget.RecyclerView, param1: android.view.MotionEvent): boolean;
						public onTouchEvent(param0: android.support.v7.widget.RecyclerView, param1: android.view.MotionEvent): void;
						public onRequestDisallowInterceptTouchEvent(param0: boolean): void;
					}
					export abstract class OnScrollListener {
						public constructor();
						public onScrolled(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number): void;
						public onScrollStateChanged(param0: android.support.v7.widget.RecyclerView, param1: number): void;
					}
					export class RecycledViewPool {
						public constructor();
						public putRecycledView(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public clear(): void;
						public setMaxRecycledViews(param0: number, param1: number): void;
						public getRecycledView(param0: number): android.support.v7.widget.RecyclerView.ViewHolder;
					}
					export class Recycler {
						public getViewForPosition(param0: number): android.view.View;
						public recycleView(param0: android.view.View): void;
						public constructor(param0: android.support.v7.widget.RecyclerView);
						public setViewCacheSize(param0: number): void;
						public getScrapList(): javautilList<android.support.v7.widget.RecyclerView.ViewHolder>;
						public clear(): void;
						public bindViewToPosition(param0: android.view.View, param1: number): void;
						public convertPreLayoutPositionToPostLayout(param0: number): number;
					}
					export class RecyclerListener {
						/**
						 * Constructs a new instance of the android.support.v7.widget.RecyclerView$RecyclerListener interface with the provided implementation.
						 */
						public constructor(implementation: {
							onViewRecycled(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						});
						public onViewRecycled(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					}
					export class RecyclerViewDataObserver extends android.support.v7.widget.RecyclerView.AdapterDataObserver {
						public onItemRangeChanged(param0: number, param1: number, param2: javalangObject): void;
						public onChanged(): void;
						public onItemRangeMoved(param0: number, param1: number, param2: number): void;
						public onItemRangeChanged(param0: number, param1: number): void;
						public onItemRangeInserted(param0: number, param1: number): void;
						public onItemRangeRemoved(param0: number, param1: number): void;
					}
					export class SavedState {
						public static CREATOR: android.os.Parcelable.Creator<SavedState>;
						public writeToParcel(param0: android.os.Parcel, param1: number): void;
					}
					export class SimpleOnItemTouchListener {
						public constructor();
						public onInterceptTouchEvent(param0: android.support.v7.widget.RecyclerView, param1: android.view.MotionEvent): boolean;
						public onTouchEvent(param0: android.support.v7.widget.RecyclerView, param1: android.view.MotionEvent): void;
						public onRequestDisallowInterceptTouchEvent(param0: boolean): void;
					}
					export abstract class SmoothScroller {
						public onTargetFound(param0: android.view.View, param1: android.support.v7.widget.RecyclerView.State, param2: android.support.v7.widget.RecyclerView.SmoothScroller.Action): void;
						public constructor();
						public getChildCount(): number;
						public getLayoutManager(): android.support.v7.widget.RecyclerView.LayoutManager;
						public onSeekTargetStep(param0: number, param1: number, param2: android.support.v7.widget.RecyclerView.State, param3: android.support.v7.widget.RecyclerView.SmoothScroller.Action): void;
						public onChildAttachedToWindow(param0: android.view.View): void;
						public stop(): void;
						public isRunning(): boolean;
						public onStop(): void;
						public setTargetPosition(param0: number): void;
						public getChildPosition(param0: android.view.View): number;
						public instantScrollToPosition(param0: number): void;
						public isPendingInitialRun(): boolean;
						public normalize(param0: android.graphics.PointF): void;
						public getTargetPosition(): number;
						public findViewByPosition(param0: number): android.view.View;
						public onStart(): void;
					}
					export module SmoothScroller {
						export class Action {
							public static UNDEFINED_DURATION: number;
							public constructor(param0: number, param1: number);
							public setDuration(param0: number): void;
							public getInterpolator(): android.view.animation.Interpolator;
							public setDy(param0: number): void;
							public update(param0: number, param1: number, param2: number, param3: android.view.animation.Interpolator): void;
							public getDx(): number;
							public constructor(param0: number, param1: number, param2: number);
							public constructor(param0: number, param1: number, param2: number, param3: android.view.animation.Interpolator);
							public setDx(param0: number): void;
							public getDy(): number;
							public setInterpolator(param0: android.view.animation.Interpolator): void;
							public getDuration(): number;
							public jumpTo(param0: number): void;
						}
					}
					export class State {
						public constructor();
						public isMeasuring(): boolean;
						public toString(): string;
						public getTargetScrollPosition(): number;
						public willRunPredictiveAnimations(): boolean;
						public get(param0: number): javalangObject;
						public hasTargetScrollPosition(): boolean;
						public willRunSimpleAnimations(): boolean;
						public getItemCount(): number;
						public didStructureChange(): boolean;
						public isPreLayout(): boolean;
						public remove(param0: number): void;
						public put(param0: number, param1: javalangObject): void;
					}
					export module State {
						export class LayoutState {
							/**
							 * Constructs a new instance of the android.support.v7.widget.RecyclerView$State$LayoutState interface with the provided implementation.
							 */
							public constructor(implementation: {
							});
						}
					}
					export abstract class ViewCacheExtension {
						public constructor();
						public getViewForPositionAndType(param0: android.support.v7.widget.RecyclerView.Recycler, param1: number, param2: number): android.view.View;
					}
					export class ViewFlinger {
						public smoothScrollBy(param0: number, param1: number, param2: number): void;
						public run(): void;
						public constructor(param0: android.support.v7.widget.RecyclerView);
						public smoothScrollBy(param0: number, param1: number, param2: number, param3: number): void;
						public smoothScrollBy(param0: number, param1: number): void;
						public smoothScrollBy(param0: number, param1: number, param2: number, param3: android.view.animation.Interpolator): void;
						public fling(param0: number, param1: number): void;
						public stop(): void;
					}
					export abstract class ViewHolder {
						public itemView: android.view.View;
						public isRecyclable(): boolean;
						public getAdapterPosition(): number;
						public constructor(param0: android.view.View);
						public getItemViewType(): number;
						public setIsRecyclable(param0: boolean): void;
						public getPosition(): number;
						public getLayoutPosition(): number;
						public getOldPosition(): number;
						public toString(): string;
						public getItemId(): number;
					}
				}
			}
		}
	}
}

/// <reference path="./android.os.Bundle.d.ts" />
/// <reference path="./android.support.v4.view.accessibility.AccessibilityNodeInfoCompat.d.ts" />
/// <reference path="./android.support.v7.widget.RecyclerView.d.ts" />
/// <reference path="./android.view.View.d.ts" />
/// <reference path="./android.view.accessibility.AccessibilityEvent.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class RecyclerViewAccessibilityDelegate {
					public performAccessibilityAction(param0: android.view.View, param1: number, param2: android.os.Bundle): boolean;
					public onInitializeAccessibilityNodeInfo(param0: android.view.View, param1: android.support.v4.view.accessibility.AccessibilityNodeInfoCompat): void;
					public constructor(param0: android.support.v7.widget.RecyclerView);
					public onInitializeAccessibilityEvent(param0: android.view.View, param1: android.view.accessibility.AccessibilityEvent): void;
				}
			}
		}
	}
}

declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class ScrollbarHelper {
				}
			}
		}
	}
}

/// <reference path="./java.util.List.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export abstract class SimpleItemAnimator extends android.support.v7.widget.RecyclerView.ItemAnimator {
					public dispatchRemoveFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public onMoveFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public onChangeStarting(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: boolean): void;
					public dispatchRemoveStarting(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public canReuseUpdatedViewHolder(param0: android.support.v7.widget.RecyclerView.ViewHolder): boolean;
					public dispatchChangeFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: boolean): void;
					public animateDisappearance(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): boolean;
					public animateRemove(param0: android.support.v7.widget.RecyclerView.ViewHolder): boolean;
					public onMoveStarting(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public onRemoveStarting(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public constructor();
					public onAddFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public animatePersistence(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): boolean;
					public canReuseUpdatedViewHolder(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: javautilList<java.lang.Object>): boolean;
					public dispatchAddStarting(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public setSupportsChangeAnimations(param0: boolean): void;
					public animateChange(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ViewHolder, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param3: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): boolean;
					public dispatchMoveFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public dispatchMoveStarting(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public onChangeFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: boolean): void;
					public animateChange(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ViewHolder, param2: number, param3: number, param4: number, param5: number): boolean;
					public animateAppearance(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): boolean;
					public onRemoveFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public dispatchChangeStarting(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: boolean): void;
					public dispatchAddFinished(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public onAddStarting(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
					public getSupportsChangeAnimations(): boolean;
					public animateAdd(param0: android.support.v7.widget.RecyclerView.ViewHolder): boolean;
					public animateMove(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: number, param2: number, param3: number, param4: number): boolean;
				}
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.graphics.Rect.d.ts" />
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./android.os.Parcelable.d.ts" />
/// <reference path="./android.support.v4.view.accessibility.AccessibilityNodeInfoCompat.d.ts" />
/// <reference path="./android.support.v7.widget.RecyclerView.d.ts" />
/// <reference path="./android.util.AttributeSet.d.ts" />
/// <reference path="./android.view.View.d.ts" />
/// <reference path="./android.view.accessibility.AccessibilityEvent.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class StaggeredGridLayoutManager extends android.support.v7.widget.RecyclerView.LayoutManager {
					public static TAG: string;
					public static HORIZONTAL: number;
					public static VERTICAL: number;
					public static GAP_HANDLING_NONE: number;
					public static GAP_HANDLING_LAZY: number;
					public static GAP_HANDLING_MOVE_ITEMS_BETWEEN_SPANS: number;
					public setMeasuredDimension(param0: number, param1: number): void;
					public findLastCompletelyVisibleItemPositions(param0: native.Array<number>): native.Array<number>;
					public computeVerticalScrollOffset(param0: android.support.v7.widget.RecyclerView.State): number;
					public onItemsChanged(param0: android.support.v7.widget.RecyclerView): void;
					public onItemsUpdated(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number): void;
					public invalidateSpanAssignments(): void;
					public computeHorizontalScrollRange(param0: android.support.v7.widget.RecyclerView.State): number;
					public supportsPredictiveItemAnimations(): boolean;
					public checkLayoutParams(param0: android.support.v7.widget.RecyclerView.LayoutParams): boolean;
					public setReverseLayout(param0: boolean): void;
					public scrollToPositionWithOffset(param0: number, param1: number): void;
					public findFirstCompletelyVisibleItemPositions(param0: native.Array<number>): native.Array<number>;
					public scrollToPosition(param0: number): void;
					public onItemsAdded(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number): void;
					public scrollVerticallyBy(param0: number, param1: android.support.v7.widget.RecyclerView.Recycler, param2: android.support.v7.widget.RecyclerView.State): number;
					public constructor();
					public getRowCountForAccessibility(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): number;
					public computeHorizontalScrollOffset(param0: android.support.v7.widget.RecyclerView.State): number;
					public getOrientation(): number;
					public constructor(param0: number, param1: number);
					public canScrollVertically(): boolean;
					public onScrollStateChanged(param0: number): void;
					public offsetChildrenHorizontal(param0: number): void;
					public getSpanCount(): number;
					public onFocusSearchFailed(param0: android.view.View, param1: number, param2: android.support.v7.widget.RecyclerView.Recycler, param3: android.support.v7.widget.RecyclerView.State): android.view.View;
					public generateDefaultLayoutParams(): android.support.v7.widget.RecyclerView.LayoutParams;
					public setOrientation(param0: number): void;
					public findFirstVisibleItemPositions(param0: native.Array<number>): native.Array<number>;
					public constructor(param0: android.content.Context, param1: android.util.AttributeSet, param2: number, param3: number);
					public setGapStrategy(param0: number): void;
					public getGapStrategy(): number;
					public generateLayoutParams(param0: android.view.ViewGroup.LayoutParams): android.support.v7.widget.RecyclerView.LayoutParams;
					public onItemsRemoved(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number): void;
					public canScrollHorizontally(): boolean;
					public offsetChildrenVertical(param0: number): void;
					public onDetachedFromWindow(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.Recycler): void;
					public onSaveInstanceState(): android.os.Parcelable;
					public onInitializeAccessibilityEvent(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State, param2: android.view.accessibility.AccessibilityEvent): void;
					public computeHorizontalScrollExtent(param0: android.support.v7.widget.RecyclerView.State): number;
					public onItemsMoved(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number, param3: number): void;
					public onInitializeAccessibilityEvent(param0: android.view.accessibility.AccessibilityEvent): void;
					public assertNotInLayoutOrScroll(param0: string): void;
					public getReverseLayout(): boolean;
					public onInitializeAccessibilityNodeInfoForItem(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State, param2: android.view.View, param3: android.support.v4.view.accessibility.AccessibilityNodeInfoCompat): void;
					public scrollHorizontallyBy(param0: number, param1: android.support.v7.widget.RecyclerView.Recycler, param2: android.support.v7.widget.RecyclerView.State): number;
					public computeVerticalScrollRange(param0: android.support.v7.widget.RecyclerView.State): number;
					public setSpanCount(param0: number): void;
					public smoothScrollToPosition(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.State, param2: number): void;
					public onDetachedFromWindow(param0: android.support.v7.widget.RecyclerView): void;
					public onRestoreInstanceState(param0: android.os.Parcelable): void;
					public generateLayoutParams(param0: android.content.Context, param1: android.util.AttributeSet): android.support.v7.widget.RecyclerView.LayoutParams;
					public setMeasuredDimension(param0: android.graphics.Rect, param1: number, param2: number): void;
					public computeVerticalScrollExtent(param0: android.support.v7.widget.RecyclerView.State): number;
					public getColumnCountForAccessibility(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): number;
					public onItemsUpdated(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number, param3: javalangObject): void;
					public onLayoutChildren(param0: android.support.v7.widget.RecyclerView.Recycler, param1: android.support.v7.widget.RecyclerView.State): void;
					public findLastVisibleItemPositions(param0: native.Array<number>): native.Array<number>;
				}
				export module StaggeredGridLayoutManager {
					export class AnchorInfo {
					}
					export class LayoutParams extends android.support.v7.widget.RecyclerView.LayoutParams {
						public static INVALID_SPAN_ID: number;
						public constructor(param0: android.view.ViewGroup.MarginLayoutParams);
						public constructor(param0: android.view.ViewGroup.LayoutParams);
						public constructor(param0: android.content.Context, param1: android.util.AttributeSet);
						public isFullSpan(): boolean;
						public getSpanIndex(): number;
						public constructor(param0: android.support.v7.widget.RecyclerView.LayoutParams);
						public constructor(param0: number, param1: number);
						public setFullSpan(param0: boolean): void;
					}
					export class LazySpanLookup {
						public addFullSpanItem(param0: android.support.v7.widget.StaggeredGridLayoutManager.LazySpanLookup.FullSpanItem): void;
						public getFirstFullSpanItemInRange(param0: number, param1: number, param2: number, param3: boolean): android.support.v7.widget.StaggeredGridLayoutManager.LazySpanLookup.FullSpanItem;
						public getFullSpanItem(param0: number): android.support.v7.widget.StaggeredGridLayoutManager.LazySpanLookup.FullSpanItem;
					}
					export module LazySpanLookup {
						export class FullSpanItem {
							public static CREATOR: android.os.Parcelable.Creator<LazySpanLookup>;
							public constructor();
							public describeContents(): number;
							public toString(): string;
							public writeToParcel(param0: android.os.Parcel, param1: number): void;
							public constructor(param0: android.os.Parcel);
						}
					}
					export class SavedState {
						public static CREATOR: android.os.Parcelable.Creator<SavedState>;
						public constructor();
						public describeContents(): number;
						public writeToParcel(param0: android.os.Parcel, param1: number): void;
						public constructor(param0: android.support.v7.widget.StaggeredGridLayoutManager.SavedState);
					}
					export class Span {
						public getFocusableViewAfter(param0: number, param1: number): android.view.View;
						public findLastCompletelyVisibleItemPosition(): number;
						public findFirstCompletelyVisibleItemPosition(): number;
						public getDeletedSize(): number;
						public findFirstVisibleItemPosition(): number;
						public findLastVisibleItemPosition(): number;
					}
				}
			}
		}
	}
}

declare module android {
	export module support {
		export module v7 {
			export module widget {
				export class ViewInfoStore {
					public onViewDetached(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
				}
				export module ViewInfoStore {
					export class InfoRecord {
					}
					export class ProcessCallback {
						/**
						 * Constructs a new instance of the android.support.v7.widget.ViewInfoStore$ProcessCallback interface with the provided implementation.
						 */
						public constructor(implementation: {
							processDisappeared(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): void;
							processAppeared(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): void;
							processPersistent(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): void;
							unused(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						});
						public unused(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public processDisappeared(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): void;
						public processAppeared(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): void;
						public processPersistent(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo, param2: android.support.v7.widget.RecyclerView.ItemAnimator.ItemHolderInfo): void;
					}
				}
			}
		}
	}
}

/// <reference path="./android.graphics.Canvas.d.ts" />
/// <reference path="./android.graphics.Rect.d.ts" />
/// <reference path="./android.support.v4.animation.ValueAnimatorCompat.d.ts" />
/// <reference path="./android.support.v7.widget.RecyclerView.d.ts" />
/// <reference path="./android.support.v7.widget.helper.ItemTouchHelper.d.ts" />
/// <reference path="./android.support.v7.widget.helper.ItemTouchUIUtil.d.ts" />
/// <reference path="./android.view.MotionEvent.d.ts" />
/// <reference path="./android.view.View.d.ts" />
/// <reference path="./java.util.List.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export module helper {
					export class ItemTouchHelper extends android.support.v7.widget.RecyclerView.ItemDecoration implements android.support.v7.widget.RecyclerView.OnChildAttachStateChangeListener {
						public static UP: number;
						public static DOWN: number;
						public static LEFT: number;
						public static RIGHT: number;
						public static START: number;
						public static END: number;
						public static ACTION_STATE_IDLE: number;
						public static ACTION_STATE_SWIPE: number;
						public static ACTION_STATE_DRAG: number;
						public static ANIMATION_TYPE_SWIPE_SUCCESS: number;
						public static ANIMATION_TYPE_SWIPE_CANCEL: number;
						public static ANIMATION_TYPE_DRAG: number;
						public onDrawOver(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.support.v7.widget.RecyclerView.State): void;
						public constructor();
						public onDraw(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView): void;
						public getItemOffsets(param0: android.graphics.Rect, param1: android.view.View, param2: android.support.v7.widget.RecyclerView, param3: android.support.v7.widget.RecyclerView.State): void;
						public onDrawOver(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView): void;
						public onDraw(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.support.v7.widget.RecyclerView.State): void;
						public startDrag(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public getItemOffsets(param0: android.graphics.Rect, param1: number, param2: android.support.v7.widget.RecyclerView): void;
						public constructor(param0: android.support.v7.widget.helper.ItemTouchHelper.Callback);
						public startSwipe(param0: android.support.v7.widget.RecyclerView.ViewHolder): void;
						public onChildViewAttachedToWindow(param0: android.view.View): void;
						public attachToRecyclerView(param0: android.support.v7.widget.RecyclerView): void;
						public onChildViewDetachedFromWindow(param0: android.view.View): void;
					}
					export module ItemTouchHelper {
						export abstract class Callback {
							public static DEFAULT_DRAG_ANIMATION_DURATION: number;
							public static DEFAULT_SWIPE_ANIMATION_DURATION: number;
							public getAnimationDuration(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number, param3: number): number;
							public interpolateOutOfBoundsScroll(param0: android.support.v7.widget.RecyclerView, param1: number, param2: number, param3: number, param4: number): number;
							public static makeMovementFlags(param0: number, param1: number): number;
							public getSwipeVelocityThreshold(param0: number): number;
							public getMovementFlags(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.ViewHolder): number;
							public onChildDraw(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.support.v7.widget.RecyclerView.ViewHolder, param3: number, param4: number, param5: number, param6: boolean): void;
							public chooseDropTarget(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: javautilList<android.support.v7.widget.RecyclerView.ViewHolder>, param2: number, param3: number): android.support.v7.widget.RecyclerView.ViewHolder;
							public getSwipeEscapeVelocity(param0: number): number;
							public isItemViewSwipeEnabled(): boolean;
							public clearView(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.ViewHolder): void;
							public getMoveThreshold(param0: android.support.v7.widget.RecyclerView.ViewHolder): number;
							public constructor();
							public onSelectedChanged(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: number): void;
							public onSwiped(param0: android.support.v7.widget.RecyclerView.ViewHolder, param1: number): void;
							public static getDefaultUIUtil(): android.support.v7.widget.helper.ItemTouchUIUtil;
							public static makeFlag(param0: number, param1: number): number;
							public getBoundingBoxMargin(): number;
							public canDropOver(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.ViewHolder, param2: android.support.v7.widget.RecyclerView.ViewHolder): boolean;
							public convertToAbsoluteDirection(param0: number, param1: number): number;
							public onMoved(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.ViewHolder, param2: number, param3: android.support.v7.widget.RecyclerView.ViewHolder, param4: number, param5: number, param6: number): void;
							public onChildDrawOver(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.support.v7.widget.RecyclerView.ViewHolder, param3: number, param4: number, param5: number, param6: boolean): void;
							public onMove(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.ViewHolder, param2: android.support.v7.widget.RecyclerView.ViewHolder): boolean;
							public getSwipeThreshold(param0: android.support.v7.widget.RecyclerView.ViewHolder): number;
							public static convertToRelativeDirection(param0: number, param1: number): number;
							public isLongPressDragEnabled(): boolean;
						}
						export class ItemTouchHelperGestureListener {
							public onLongPress(param0: android.view.MotionEvent): void;
							public onDown(param0: android.view.MotionEvent): boolean;
						}
						export class RecoverAnimation {
							public mIsPendingCleanup: boolean;
							public cancel(): void;
							public onAnimationCancel(param0: android.support.v4.animation.ValueAnimatorCompat): void;
							public setFraction(param0: number): void;
							public setDuration(param0: number): void;
							public onAnimationStart(param0: android.support.v4.animation.ValueAnimatorCompat): void;
							public start(): void;
							public constructor(param0: android.support.v7.widget.helper.ItemTouchHelper, param1: android.support.v7.widget.RecyclerView.ViewHolder, param2: number, param3: number, param4: number, param5: number, param6: number, param7: number);
							public onAnimationRepeat(param0: android.support.v4.animation.ValueAnimatorCompat): void;
							public onAnimationEnd(param0: android.support.v4.animation.ValueAnimatorCompat): void;
							public update(): void;
						}
						export abstract class SimpleCallback extends android.support.v7.widget.helper.ItemTouchHelper.Callback {
							public constructor();
							public constructor(param0: number, param1: number);
							public getSwipeDirs(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.ViewHolder): number;
							public getMovementFlags(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.ViewHolder): number;
							public getDragDirs(param0: android.support.v7.widget.RecyclerView, param1: android.support.v7.widget.RecyclerView.ViewHolder): number;
							public setDefaultSwipeDirs(param0: number): void;
							public setDefaultDragDirs(param0: number): void;
						}
						export class ViewDropHandler {
							/**
							 * Constructs a new instance of the android.support.v7.widget.helper.ItemTouchHelper$ViewDropHandler interface with the provided implementation.
							 */
							public constructor(implementation: {
								prepareForDrop(param0: android.view.View, param1: android.view.View, param2: number, param3: number): void;
							});
							public prepareForDrop(param0: android.view.View, param1: android.view.View, param2: number, param3: number): void;
						}
					}
				}
			}
		}
	}
}

/// <reference path="./android.graphics.Canvas.d.ts" />
/// <reference path="./android.support.v7.widget.RecyclerView.d.ts" />
/// <reference path="./android.view.View.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export module helper {
					export class ItemTouchUIUtil {
						/**
						 * Constructs a new instance of the android.support.v7.widget.helper.ItemTouchUIUtil interface with the provided implementation.
						 */
						public constructor(implementation: {
							onDraw(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.view.View, param3: number, param4: number, param5: number, param6: boolean): void;
							onDrawOver(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.view.View, param3: number, param4: number, param5: number, param6: boolean): void;
							clearView(param0: android.view.View): void;
							onSelected(param0: android.view.View): void;
						});
						public onDraw(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.view.View, param3: number, param4: number, param5: number, param6: boolean): void;
						public clearView(param0: android.view.View): void;
						public onDrawOver(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.view.View, param3: number, param4: number, param5: number, param6: boolean): void;
						public onSelected(param0: android.view.View): void;
					}
				}
			}
		}
	}
}

/// <reference path="./android.graphics.Canvas.d.ts" />
/// <reference path="./android.support.v7.widget.RecyclerView.d.ts" />
/// <reference path="./android.view.View.d.ts" />
declare module android {
	export module support {
		export module v7 {
			export module widget {
				export module helper {
					export class ItemTouchUIUtilImpl {
					}
					export module ItemTouchUIUtilImpl {
						export class Gingerbread {
							public onDrawOver(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.view.View, param3: number, param4: number, param5: number, param6: boolean): void;
							public clearView(param0: android.view.View): void;
							public onSelected(param0: android.view.View): void;
							public onDraw(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.view.View, param3: number, param4: number, param5: number, param6: boolean): void;
						}
						export class Honeycomb {
							public onDrawOver(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.view.View, param3: number, param4: number, param5: number, param6: boolean): void;
							public clearView(param0: android.view.View): void;
							public onSelected(param0: android.view.View): void;
							public onDraw(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.view.View, param3: number, param4: number, param5: number, param6: boolean): void;
						}
						export class Lollipop extends android.support.v7.widget.helper.ItemTouchUIUtilImpl.Honeycomb {
							public onDrawOver(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.view.View, param3: number, param4: number, param5: number, param6: boolean): void;
							public clearView(param0: android.view.View): void;
							public onSelected(param0: android.view.View): void;
							public onDraw(param0: android.graphics.Canvas, param1: android.support.v7.widget.RecyclerView, param2: android.view.View, param3: number, param4: number, param5: number, param6: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare module android {
	export module support {
		export module v7 {
			export module widget {
				export module util {
					export abstract class SortedListAdapterCallback extends android.support.v7.util.SortedList.Callback {
						public constructor();
						public constructor(param0: android.support.v7.widget.RecyclerView.Adapter);
						public onChanged(param0: number, param1: number): void;
						public onRemoved(param0: number, param1: number): void;
						public onInserted(param0: number, param1: number): void;
						public onMoved(param0: number, param1: number): void;
					}
				}
			}
		}
	}
}

