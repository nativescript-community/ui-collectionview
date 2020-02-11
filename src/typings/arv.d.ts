
import javalangObject = java.lang.Object;
import javalangClass = java.lang.Class;
import javalangannotationAnnotation = java.lang.annotation.Annotation;
import javalangRunnable = java.lang.Runnable;
import javautilList = java.util.List;


declare module com {
    export module nativescript {
        export module collectionview {
            export class GridLayoutManager extends androidx.recyclerview.widget.GridLayoutManager {
                isScrollEnabled: boolean;
            }
            export class CollectionViewCellHolder extends androidx.recyclerview.widget.RecyclerView.ViewHolder {
            }
        }
    }
}
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export class BuildConfig extends javalangObject {
						public static DEBUG: boolean;
						public static APPLICATION_ID: string;
						public static BUILD_TYPE: string;
						public static FLAVOR: string;
						public static VERSION_CODE: number;
						public static VERSION_NAME: string;
						public constructor();
					}
				}
			}
		}
	}

	export module telerik {
		export module widget {
			export module list {
				export class ListViewHolder extends androidx.recyclerview.widget.RecyclerView.ViewHolder {
					public static class: java.lang.Class<com.telerik.widget.list.ListViewHolder>;
					public constructor(param0: globalAndroid.view.View);
				}
			}
		}
	}
}

import androidsupportv7widgetRecyclerViewAdapter = androidx.recyclerview.widget.RecyclerView.Adapter;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module adapter {
						export class AdapterPath extends javalangObject {
							public constructor();
							public append(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment): com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPath;
							public lastSegment(): com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment;
							public segments(): javautilList<any>;
							public clear(): com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPath;
							public firstSegment(): com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment;
							public isEmpty(): boolean;
							public append(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.UnwrapPositionResult): com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPath;
							public append(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject): com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPath;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module adapter {
						export class AdapterPathSegment extends javalangObject {
							public adapter: androidsupportv7widgetRecyclerViewAdapter<any>;
							public tag: javalangObject;
							public constructor(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject);
						}
					}
				}
			}
		}
	}
}

import androidsupportv7widgetRecyclerViewAdapterDataObserver = androidx.recyclerview.widget.RecyclerView.AdapterDataObserver;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module adapter {
						export class BridgeAdapterDataObserver extends androidsupportv7widgetRecyclerViewAdapterDataObserver {
							public constructor();
							public onChanged(): void;
							public getTag(): javalangObject;
							public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.BridgeAdapterDataObserver.Subscriber, param1: androidsupportv7widgetRecyclerViewAdapter<any>, param2: javalangObject);
							public onItemRangeInserted(param0: number, param1: number): void;
							public onItemRangeChanged(param0: number, param1: number): void;
							public onItemRangeRemoved(param0: number, param1: number): void;
							public onItemRangeChanged(param0: number, param1: number, param2: javalangObject): void;
							public onItemRangeMoved(param0: number, param1: number, param2: number): void;
						}
						export module BridgeAdapterDataObserver {
							export class Subscriber extends javalangObject {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.adapter.BridgeAdapterDataObserver$Subscriber interface with the provided implementation.
								 */
								public constructor();
								public onBridgedAdapterRangeMoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: number): void;
								public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
								public onBridgedAdapterItemRangeInserted(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
								public onBridgedAdapterChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject): void;
								public onBridgedAdapterItemRangeRemoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
								public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: javalangObject): void;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module adapter {
						export class ItemIdComposer extends javalangObject {
							public static BIT_OFFSET_RESERVED_SIGN_FLAG: number;
							public static BIT_OFFSET_SEGMENT: number;
							public static BIT_OFFSET_GROUP_ID: number;
							public static BIT_OFFSET_CHILD_ID: number;
							public static BIT_WIDTH_RESERVED_SIGN_FLAG: number;
							public static BIT_WIDTH_SEGMENT: number;
							public static BIT_WIDTH_GROUP_ID: number;
							public static BIT_WIDTH_CHILD_ID: number;
							public static BIT_MASK_RESERVED_SIGN_FLAG: number;
							public static BIT_MASK_SEGMENT: number;
							public static BIT_MASK_GROUP_ID: number;
							public static BIT_MASK_CHILD_ID: number;
							public static MIN_SEGMENT: number;
							public static MAX_SEGMENT: number;
							public static MIN_GROUP_ID: number;
							public static MAX_GROUP_ID: number;
							public static MIN_CHILD_ID: number;
							public static MAX_CHILD_ID: number;
							public static MIN_WRAPPED_ID: number;
							public static MAX_WRAPPED_ID: number;
							public static extractSegmentPart(param0: number): number;
							public static extractWrappedIdPart(param0: number): number;
							public static extractExpandableChildIdPart(param0: number): number;
							public static composeExpandableGroupId(param0: number): number;
							public static isExpandableGroup(param0: number): boolean;
							public static composeSegment(param0: number, param1: number): number;
							public static composeExpandableChildId(param0: number, param1: number): number;
							public static extractExpandableGroupIdPart(param0: number): number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module adapter {
						export class ItemViewTypeComposer extends javalangObject {
							public static BIT_OFFSET_EXPANDABLE_FLAG: number;
							public static BIT_OFFSET_SEGMENT: number;
							public static BIT_OFFSET_WRAPPED_VIEW_TYPE: number;
							public static BIT_WIDTH_EXPANDABLE_FLAG: number;
							public static BIT_WIDTH_SEGMENT: number;
							public static BIT_WIDTH_WRAPPED_VIEW_TYPE: number;
							public static BIT_MASK_EXPANDABLE_FLAG: number;
							public static BIT_MASK_SEGMENT: number;
							public static BIT_MASK_WRAPPED_VIEW_TYPE: number;
							public static MIN_SEGMENT: number;
							public static MAX_SEGMENT: number;
							public static MIN_WRAPPED_VIEW_TYPE: number;
							public static MAX_WRAPPED_VIEW_TYPE: number;
							public static extractSegmentPart(param0: number): number;
							public static extractWrappedViewTypePart(param0: number): number;
							public static isExpandableGroup(param0: number): boolean;
							public static composeSegment(param0: number, param1: number): number;
						}
					}
				}
			}
		}
	}
}

import androidsupportv7widgetRecyclerView = androidx.recyclerview.widget.RecyclerView;
import androidsupportv7widgetRecyclerViewViewHolder = androidx.recyclerview.widget.RecyclerView.ViewHolder;
import androidviewViewGroup = android.view.ViewGroup;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module adapter {
						export class SimpleWrapperAdapter extends androidsupportv7widgetRecyclerViewAdapter<any> implements com.h6ah4i.android.widget.advrecyclerview.adapter.WrapperAdapter, com.h6ah4i.android.widget.advrecyclerview.adapter.BridgeAdapterDataObserver.Subscriber {
							public static FULL_UPDATE_PAYLOADS: javautilList<any>;
							public onBridgedAdapterItemRangeInserted(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public getItemId(param0: number): number;
							public constructor(param0: androidsupportv7widgetRecyclerViewAdapter<any>);
							public onViewDetachedFromWindow(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public getItemViewType(param0: number): number;
							public onBridgedAdapterChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject): void;
							public unwrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.UnwrapPositionResult, param1: number): void;
							public onRelease(): void;
							public getWrappedAdapters(param0: javautilList<any>): void;
							public setHasStableIds(param0: boolean): void;
							public onFailedToRecycleView(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
							public onFailedToRecycleView(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): boolean;
							public onHandleWrappedAdapterRangeMoved(param0: number, param1: number, param2: number): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: javautilList<any>): void;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public constructor();
							public wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment, param1: number): number;
							public onBridgedAdapterItemRangeRemoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onViewDetachedFromWindow(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onHandleWrappedAdapterItemRangeInserted(param0: number, param1: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public release(): void;
							public onCreateViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							public onAttachedToRecyclerView(param0: androidsupportv7widgetRecyclerView): void;
							public isWrappedAdapterAlive(): boolean;
							public onBridgedAdapterRangeMoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: number): void;
							public onViewAttachedToWindow(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onViewAttachedToWindow(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onHandleWrappedAdapterItemRangeRemoved(param0: number, param1: number): void;
							public getItemCount(): number;
							public getWrappedAdapter(): androidsupportv7widgetRecyclerViewAdapter<any>;
							public onHandleWrappedAdapterItemRangeChanged(param0: number, param1: number, param2: javalangObject): void;
							public onHandleWrappedAdapterItemRangeChanged(param0: number, param1: number): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: javalangObject): void;
							public onDetachedFromRecyclerView(param0: androidsupportv7widgetRecyclerView): void;
							public onHandleWrappedAdapterChanged(): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module adapter {
						export class UnwrapPositionResult extends javalangObject {
							public adapter: androidsupportv7widgetRecyclerViewAdapter<any>;
							public tag: javalangObject;
							public position: number;
							public constructor();
							public clear(): void;
							public isValid(): boolean;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module adapter {
						export class WrappedAdapter extends javalangObject {
							/**
							 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.adapter.WrappedAdapter interface with the provided implementation.
							 */
							public constructor();
							public onViewAttachedToWindow(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onViewDetachedFromWindow(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onFailedToRecycleView(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): boolean;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module adapter {
						export class WrapperAdapter extends javalangObject implements com.h6ah4i.android.widget.advrecyclerview.adapter.WrappedAdapter {
							/**
							 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.adapter.WrapperAdapter interface with the provided implementation.
							 */
							public constructor();
							public wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment, param1: number): number;
							public onViewAttachedToWindow(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onViewDetachedFromWindow(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public unwrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.UnwrapPositionResult, param1: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public getWrappedAdapters(param0: javautilList<any>): void;
							public release(): void;
							public onFailedToRecycleView(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): boolean;
						}
					}
				}
			}
		}
	}
}

import androidsupportv7widgetSimpleItemAnimator = androidx.recyclerview.widget.SimpleItemAnimator;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export abstract class BaseItemAnimator extends androidsupportv7widgetSimpleItemAnimator {
							public constructor();
							public onRemoveStartingImpl(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onAddFinishedImpl(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onMoveStarting(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onAddStarting(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onRemoveFinished(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onChangeStartingItem(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: boolean): void;
							public onMoveFinishedImpl(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onChangeFinished(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: boolean): void;
							public onMoveStartingImpl(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onChangeStarting(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: boolean): void;
							public dispatchFinishedWhenDone(): boolean;
							public debugLogEnabled(): boolean;
							public onAddFinished(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onRemoveStarting(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onMoveFinished(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onAddStartingImpl(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onRemoveFinishedImpl(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onChangeFinishedImpl(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: boolean): void;
							public setListener(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator.ItemAnimatorListener): void;
						}
						export module BaseItemAnimator {
							export interface ItemAnimatorListener  {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator$ItemAnimatorListener interface with the provided implementation.
								 */
								 onRemoveFinished(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								 onChangeFinished(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								 onAddFinished(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								 onMoveFinished(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							}
						}
					}
				}
			}
		}
	}
}

import androidsupportv7widgetRecyclerViewItemAnimatorItemHolderInfo = androidx.recyclerview.widget.RecyclerView.ItemAnimator.ItemHolderInfo;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export class DraggableItemAnimator extends com.h6ah4i.android.widget.advrecyclerview.animator.RefactoredDefaultItemAnimator {
							public constructor();
							public animateChange(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number, param3: number, param4: number, param5: number): boolean;
							public onSetup(): void;
							public animateChange(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: androidsupportv7widgetRecyclerViewItemAnimatorItemHolderInfo, param3: androidsupportv7widgetRecyclerViewItemAnimatorItemHolderInfo): boolean;
						}
					}
				}
			}
		}
	}
}

import androidsupportv7widgetRecyclerViewItemAnimatorItemAnimatorFinishedListener = androidx.recyclerview.widget.RecyclerView.ItemAnimator.ItemAnimatorFinishedListener;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export abstract class GeneralItemAnimator extends com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator {
							public animateMove(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: number): boolean;
							public getItemMoveAnimationsManager(): com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemMoveAnimationManager;
							public getItemAddAnimationsManager(): com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAddAnimationManager;
							public setDebug(param0: boolean): void;
							public schedulePendingAnimationsByDefaultRule(): void;
							public onSchedulePendingAnimations(): void;
							public animateChange(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number, param3: number, param4: number, param5: number): boolean;
							public isRunning(): boolean;
							public getItemChangeAnimationsManager(): com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemChangeAnimationManager;
							public animateAdd(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
							public dispatchFinishedWhenDone(): boolean;
							public endAnimations(): void;
							public constructor();
							public animateRemove(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
							public setItemRemoveAnimationManager(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemRemoveAnimationManager): void;
							public cancelAnimations(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public animateChange(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: androidsupportv7widgetRecyclerViewItemAnimatorItemHolderInfo, param3: androidsupportv7widgetRecyclerViewItemAnimatorItemHolderInfo): boolean;
							public setItemChangeAnimationsManager(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemChangeAnimationManager): void;
							public endAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public setItemAddAnimationsManager(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAddAnimationManager): void;
							public onSetup(): void;
							public getRemoveAnimationManager(): com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemRemoveAnimationManager;
							public debugLogEnabled(): boolean;
							public isDebug(): boolean;
							public isRunning(param0: androidsupportv7widgetRecyclerViewItemAnimatorItemAnimatorFinishedListener): boolean;
							public setItemMoveAnimationsManager(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemMoveAnimationManager): void;
							public runPendingAnimations(): void;
							public hasPendingAnimations(): boolean;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export class RefactoredDefaultItemAnimator extends com.h6ah4i.android.widget.advrecyclerview.animator.GeneralItemAnimator {
							public constructor();
							public canReuseUpdatedViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
							public onSetup(): void;
							public canReuseUpdatedViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: javautilList<any>): boolean;
							public onSchedulePendingAnimations(): void;
						}
						export module RefactoredDefaultItemAnimator {
							export class DefaultItemAddAnimationManager extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAddAnimationManager {
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator);
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.AddAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo): void;
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.AddAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.AddAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public addPendingAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.AddAnimationInfo): void;
							}
							export class DefaultItemChangeAnimationManager extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemChangeAnimationManager {
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator);
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onCreateChangeAnimationForNewItem(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo): void;
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onCreateChangeAnimationForOldItem(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo): void;
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public addPendingAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number, param3: number, param4: number, param5: number): boolean;
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
							}
							export class DefaultItemMoveAnimationManager extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemMoveAnimationManager {
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.MoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.MoveAnimationInfo): void;
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.MoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator);
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo): void;
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.MoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public addPendingAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: number): boolean;
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
							}
							export class DefaultItemRemoveAnimationManager extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemRemoveAnimationManager {
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator);
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo): void;
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public addPendingAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo): void;
							}
						}
					}
				}
			}
		}
	}
}

import androidviewanimationInterpolator = android.view.animation.Interpolator;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export class SwipeDismissItemAnimator extends com.h6ah4i.android.widget.advrecyclerview.animator.DraggableItemAnimator {
							public static MOVE_INTERPOLATOR: androidviewanimationInterpolator;
							public constructor();
							public onSetup(): void;
						}
						export module SwipeDismissItemAnimator {
							export class SwipeDismissItemRemoveAnimationManager extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemRemoveAnimationManager {
								public static DEFAULT_INTERPOLATOR: androidviewanimationInterpolator;
								public static isSwipeDismissed(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo): boolean;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator);
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo): void;
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public addPendingAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public static isSwipeDismissed(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo): void;
							}
							export class SwipeDismissRemoveAnimationInfo extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo {
								public constructor();
								public constructor(param0: androidsupportv7widgetRecyclerViewViewHolder);
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export module impl {
							export class AddAnimationInfo extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo {
								public holder: androidsupportv7widgetRecyclerViewViewHolder;
								public clear(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public toString(): string;
								public getAvailableViewHolder(): androidsupportv7widgetRecyclerViewViewHolder;
								public constructor();
								public constructor(param0: androidsupportv7widgetRecyclerViewViewHolder);
							}
						}
					}
				}
			}
		}
	}
}

import androidsupportv4viewViewPropertyAnimatorCompat = androidx.core.view.ViewPropertyAnimatorCompat;
import androidsupportv4viewViewPropertyAnimatorListener = androidx.core.view.ViewPropertyAnimatorListener;
import androidviewView = android.view.View;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export module impl {
							export abstract class BaseItemAnimationManager extends javalangObject {
								public mItemAnimator: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator;
								public mPending: javautilList<any>;
								public mDeferredReadySets: javautilList<any>;
								public mActive: javautilList<any>;
								public dispatchFinishedWhenDone(): void;
								public endNotStartedAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public enqueuePendingAnimationInfo(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo): void;
								public onAnimationEndedSuccessfully(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public debugLogEnabled(): boolean;
								public endAllPendingAnimations(): void;
								public isRunning(): boolean;
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo): void;
								public cancelAllStartedAnimations(): void;
								public setDuration(param0: number): void;
								public endPendingAnimations(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public removeFromActive(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public dispatchFinished(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public endAllDeferredReadyAnimations(): void;
								public startActiveItemAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: androidsupportv4viewViewPropertyAnimatorCompat): void;
								public dispatchStarting(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator);
								public getDuration(): number;
								public runPendingAnimations(param0: boolean, param1: number): void;
								public onAnimationCancel(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onAnimationEndedBeforeStarted(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public resetAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public hasPending(): boolean;
								public endDeferredReadyAnimations(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public endAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							}
							export module BaseItemAnimationManager {
								export class BaseAnimatorListener extends javalangObject implements androidsupportv4viewViewPropertyAnimatorListener {
									public onAnimationStart(param0: androidviewView): void;
									public onAnimationEnd(param0: androidviewView): void;
									public onAnimationCancel(param0: androidviewView): void;
									public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.BaseItemAnimationManager, param1: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param2: androidsupportv7widgetRecyclerViewViewHolder, param3: androidsupportv4viewViewPropertyAnimatorCompat);
								}
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export module impl {
							export class ChangeAnimationInfo extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo {
								public newHolder: androidsupportv7widgetRecyclerViewViewHolder;
								public oldHolder: androidsupportv7widgetRecyclerViewViewHolder;
								public fromX: number;
								public fromY: number;
								public toX: number;
								public toY: number;
								public constructor(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number, param3: number, param4: number, param5: number);
								public clear(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public toString(): string;
								public getAvailableViewHolder(): androidsupportv7widgetRecyclerViewViewHolder;
								public constructor();
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export module impl {
							export abstract class ItemAddAnimationManager extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.BaseItemAnimationManager {
								public dispatchStarting(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator);
								public getDuration(): number;
								public dispatchStarting(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.AddAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public endNotStartedAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public setDuration(param0: number): void;
								public dispatchFinished(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.AddAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public endNotStartedAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.AddAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public addPendingAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public dispatchFinished(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export module impl {
							export abstract class ItemAnimationInfo extends javalangObject {
								public clear(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public getAvailableViewHolder(): androidsupportv7widgetRecyclerViewViewHolder;
								public constructor();
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export module impl {
							export abstract class ItemChangeAnimationManager extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.BaseItemAnimationManager {
								public dispatchStarting(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public dispatchStarting(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator);
								public getDuration(): number;
								public endNotStartedAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public onCreateChangeAnimationForNewItem(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo): void;
								public dispatchFinished(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo): void;
								public onCreateAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo): void;
								public setDuration(param0: number): void;
								public endNotStartedAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public dispatchFinished(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public onCreateChangeAnimationForOldItem(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ChangeAnimationInfo): void;
								public addPendingAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number, param3: number, param4: number, param5: number): boolean;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export module impl {
							export abstract class ItemMoveAnimationManager extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.BaseItemAnimationManager {
								public static TAG: string;
								public dispatchStarting(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator);
								public getDuration(): number;
								public endNotStartedAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public setDuration(param0: number): void;
								public dispatchStarting(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.MoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public addPendingAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: number): boolean;
								public endNotStartedAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.MoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public dispatchFinished(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public dispatchFinished(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.MoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export module impl {
							export abstract class ItemRemoveAnimationManager extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.BaseItemAnimationManager {
								public dispatchStarting(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.animator.BaseItemAnimator);
								public getDuration(): number;
								public endNotStartedAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public setDuration(param0: number): void;
								public addPendingAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public dispatchStarting(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public dispatchFinished(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public dispatchFinished(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
								public endNotStartedAnimation(param0: com.h6ah4i.android.widget.advrecyclerview.animator.impl.RemoveAnimationInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): boolean;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export module impl {
							export class MoveAnimationInfo extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo {
								public holder: androidsupportv7widgetRecyclerViewViewHolder;
								public fromX: number;
								public fromY: number;
								public toX: number;
								public toY: number;
								public clear(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public toString(): string;
								public getAvailableViewHolder(): androidsupportv7widgetRecyclerViewViewHolder;
								public constructor();
								public constructor(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: number);
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module animator {
						export module impl {
							export class RemoveAnimationInfo extends com.h6ah4i.android.widget.advrecyclerview.animator.impl.ItemAnimationInfo {
								public holder: androidsupportv7widgetRecyclerViewViewHolder;
								public clear(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public toString(): string;
								public getAvailableViewHolder(): androidsupportv7widgetRecyclerViewViewHolder;
								public constructor();
								public constructor(param0: androidsupportv7widgetRecyclerViewViewHolder);
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module composedadapter {
						export class AdaptersSet extends javalangObject {
							public static NO_SEGMENTED_POSITION: number;
							public getUniqueAdaptersList(): javautilList<any>;
							public getTag(param0: number): com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedChildAdapterTag;
							public static extractSegmentOffset(param0: number): number;
							public getAdapter(param0: number): androidsupportv7widgetRecyclerViewAdapter<any>;
							public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.BridgeAdapterDataObserver.Subscriber);
							public addAdapter(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: number): com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedChildAdapterTag;
							public removeAdapter(param0: com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedChildAdapterTag): androidsupportv7widgetRecyclerViewAdapter<any>;
							public getAdapterSegment(param0: com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedChildAdapterTag): number;
							public release(): void;
							public static extractSegment(param0: number): number;
							public getSegmentCount(): number;
							public static composeSegmentedPosition(param0: number, param1: number): number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module composedadapter {
						export class ComposedAdapter extends androidsupportv7widgetRecyclerViewAdapter<any> implements com.h6ah4i.android.widget.advrecyclerview.adapter.WrapperAdapter, com.h6ah4i.android.widget.advrecyclerview.adapter.BridgeAdapterDataObserver.Subscriber {
							public static NO_SEGMENTED_POSITION: number;
							public onBridgedAdapterItemRangeInserted(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public getItemId(param0: number): number;
							public getItemViewType(param0: number): number;
							public onViewDetachedFromWindow(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onHandleWrappedAdapterRangeMoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javautilList<any>, param2: number, param3: number, param4: number): void;
							public onBridgedAdapterChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject): void;
							public onRelease(): void;
							public static extractSegmentOffsetPart(param0: number): number;
							public unwrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.UnwrapPositionResult, param1: number): void;
							public onHandleWrappedAdapterItemRangeRemoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javautilList<any>, param2: number, param3: number): void;
							public getWrappedAdapters(param0: javautilList<any>): void;
							public setHasStableIds(param0: boolean): void;
							public onFailedToRecycleView(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
							public onFailedToRecycleView(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): boolean;
							public getChildAdapterCount(): number;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: javautilList<any>): void;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onHandleWrappedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javautilList<any>, param2: number, param3: number): void;
							public constructor();
							public static extractSegmentPart(param0: number): number;
							public removeAdapter(param0: com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedChildAdapterTag): boolean;
							public wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment, param1: number): number;
							public onBridgedAdapterItemRangeRemoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onViewDetachedFromWindow(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public addAdapter(param0: androidsupportv7widgetRecyclerViewAdapter<any>): com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedChildAdapterTag;
							public addAdapter(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: number): com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedChildAdapterTag;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onHandleWrappedAdapterItemRangeInserted(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javautilList<any>, param2: number, param3: number): void;
							public release(): void;
							public getSegment(param0: com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedChildAdapterTag): number;
							public onCreateViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							public onAttachedToRecyclerView(param0: androidsupportv7widgetRecyclerView): void;
							public onBridgedAdapterRangeMoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: number): void;
							public onHandleWrappedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javautilList<any>, param2: number, param3: number, param4: javalangObject): void;
							public onViewAttachedToWindow(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onViewAttachedToWindow(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public getItemCount(): number;
							public getSegmentedPosition(param0: number): number;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: javalangObject): void;
							public onDetachedFromRecyclerView(param0: androidsupportv7widgetRecyclerView): void;
							public onHandleWrappedAdapterChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javautilList<any>): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module composedadapter {
						export class ComposedChildAdapterDataObserver extends com.h6ah4i.android.widget.advrecyclerview.adapter.BridgeAdapterDataObserver {
							public constructor();
							public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.BridgeAdapterDataObserver.Subscriber, param1: androidsupportv7widgetRecyclerViewAdapter<any>);
							public hasChildAdapters(): boolean;
							public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.BridgeAdapterDataObserver.Subscriber, param1: androidsupportv7widgetRecyclerViewAdapter<any>, param2: javalangObject);
							public registerChildAdapterTag(param0: com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedChildAdapterTag): void;
							public release(): void;
							public unregisterChildAdapterTag(param0: com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedChildAdapterTag): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module composedadapter {
						export class ComposedChildAdapterTag extends javalangObject {
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module composedadapter {
						export class SegmentedPositionTranslator extends javalangObject {
							public invalidateAll(): void;
							public invalidateSegment(param0: number): void;
							public getTotalItemCount(): number;
							public getFlatPosition(param0: number, param1: number): number;
							public getSegmentedPosition(param0: number): number;
							public release(): void;
							public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.composedadapter.AdaptersSet);
							public getSegmentItemCount(param0: number): number;
							public getSegmentOffset(param0: number): number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module composedadapter {
						export class SegmentedViewTypeTranslator extends javalangObject {
							public constructor();
							public static extractWrapperSegment(param0: number): number;
							public unwrapViewType(param0: number): number;
							public wrapItemViewType(param0: number, param1: number): number;
							public static extractWrappedViewType(param0: number): number;
						}
					}
				}
			}
		}
	}
}

import androidsupportv7widgetRecyclerViewItemDecoration = androidx.recyclerview.widget.RecyclerView.ItemDecoration;
import androidgraphicsdrawableNinePatchDrawable = android.graphics.drawable.NinePatchDrawable;
import androidgraphicsCanvas = android.graphics.Canvas;
import androidsupportv7widgetRecyclerViewState = androidx.recyclerview.widget.RecyclerView.State;
import androidgraphicsRect = android.graphics.Rect;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module decoration {
						export class ItemShadowDecorator extends androidsupportv7widgetRecyclerViewItemDecoration {
							public constructor();
							public getItemOffsets(param0: androidgraphicsRect, param1: androidviewView, param2: androidsupportv7widgetRecyclerView, param3: androidsupportv7widgetRecyclerViewState): void;
							public constructor(param0: androidgraphicsdrawableNinePatchDrawable);
							public getItemOffsets(param0: androidgraphicsRect, param1: number, param2: androidsupportv7widgetRecyclerView): void;
							public onDraw(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView, param2: androidsupportv7widgetRecyclerViewState): void;
							public constructor(param0: androidgraphicsdrawableNinePatchDrawable, param1: boolean);
							public onDraw(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView): void;
						}
					}
				}
			}
		}
	}
}

import androidgraphicsdrawableDrawable = android.graphics.drawable.Drawable;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module decoration {
						export class SimpleListDividerDecorator extends androidsupportv7widgetRecyclerViewItemDecoration {
							public constructor();
							public getItemOffsets(param0: androidgraphicsRect, param1: androidviewView, param2: androidsupportv7widgetRecyclerView, param3: androidsupportv7widgetRecyclerViewState): void;
							public constructor(param0: androidgraphicsdrawableDrawable, param1: androidgraphicsdrawableDrawable, param2: boolean);
							public getItemOffsets(param0: androidgraphicsRect, param1: number, param2: androidsupportv7widgetRecyclerView): void;
							public constructor(param0: androidgraphicsdrawableDrawable, param1: boolean);
							public onDrawOver(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView, param2: androidsupportv7widgetRecyclerViewState): void;
							public onDrawOver(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export abstract class BaseDraggableItemDecorator extends androidsupportv7widgetRecyclerViewItemDecoration {
							public mRecyclerView: androidsupportv7widgetRecyclerView;
							public mDraggingItemViewHolder: androidsupportv7widgetRecyclerViewViewHolder;
							public constructor();
							public determineMoveToDefaultPositionAnimationDurationFactor(param0: androidviewView, param1: number, param2: number, param3: number, param4: number): number;
							public setReturnToDefaultPositionAnimationDuration(param0: number): void;
							public static resetDraggingItemViewEffects(param0: androidviewView, param1: number): void;
							public constructor(param0: androidsupportv7widgetRecyclerView, param1: androidsupportv7widgetRecyclerViewViewHolder);
							public static setItemTranslation(param0: androidsupportv7widgetRecyclerView, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number, param3: number): void;
							public setReturnToDefaultPositionAnimationInterpolator(param0: androidviewanimationInterpolator): void;
							public moveToDefaultPosition(param0: androidviewView, param1: number, param2: number, param3: number, param4: number, param5: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export abstract class BaseEdgeEffectDecorator extends androidsupportv7widgetRecyclerViewItemDecoration {
							public static EDGE_LEFT: number;
							public static EDGE_TOP: number;
							public static EDGE_RIGHT: number;
							public static EDGE_BOTTOM: number;
							public constructor();
							public finish(): void;
							public releaseBothGlows(): void;
							public getEdgeDirection(param0: number): number;
							public constructor(param0: androidsupportv7widgetRecyclerView);
							public start(): void;
							public pullSecondEdge(param0: number): void;
							public pullFirstEdge(param0: number): void;
							public onDrawOver(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView, param2: androidsupportv7widgetRecyclerViewState): void;
							public onDrawOver(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView): void;
							public reorderToTop(): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class BasicSwapTargetTranslationInterpolator extends javalangObject implements androidviewanimationInterpolator {
							public constructor();
							public getInterpolation(param0: number): number;
							public constructor(param0: number);
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class DraggableItemAdapter extends javalangObject {
							/**
							 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.draggable.DraggableItemAdapter interface with the provided implementation.
							 */
							public constructor();
							public onCheckCanDrop(param0: number, param1: number): boolean;
							public onMoveItem(param0: number, param1: number): void;
							public onGetItemDraggableRange(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange;
							public onCheckCanStartDrag(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): boolean;
							public onItemDragStarted(param0: number): void;
							public onItemDragFinished(param0: number, param1: number, param2: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class DraggableItemConstants extends javalangObject {
							/**
							 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.draggable.DraggableItemConstants interface with the provided implementation.
							 */
							public constructor();
							public static STATE_FLAG_DRAGGING: number;
							public static STATE_FLAG_IS_IN_RANGE: number;
							public static STATE_FLAG_IS_UPDATED: number;
							public static STATE_FLAG_IS_ACTIVE: number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export interface DraggableItemViewHolder {
							setDragStateFlags(param0: number): void;
							 getDragStateFlags(): number;
						}
					}
				}
			}
		}
	}
}
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class DraggableItemWrapperAdapter extends com.h6ah4i.android.widget.advrecyclerview.adapter.SimpleWrapperAdapter implements com.h6ah4i.android.widget.advrecyclerview.swipeable.SwipeableItemAdapter {
							public onBridgedAdapterItemRangeInserted(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public getItemId(param0: number): number;
							public constructor(param0: androidsupportv7widgetRecyclerViewAdapter<any>);
							public getItemViewType(param0: number): number;
							public onBridgedAdapterChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject): void;
							public onRelease(): void;
							public unwrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.UnwrapPositionResult, param1: number): void;
							public getWrappedAdapters(param0: javautilList<any>): void;
							public onSwipeItemStarted(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onHandleWrappedAdapterRangeMoved(param0: number, param1: number, param2: number): void;
							public isDragging(): boolean;
							public onSetSwipeBackground(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: javautilList<any>): void;
							public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.draggable.RecyclerViewDragDropManager, param1: androidsupportv7widgetRecyclerViewAdapter<any>);
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public constructor();
							public onSwipeItem(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction;
							public wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment, param1: number): number;
							public onBridgedAdapterItemRangeRemoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onHandleWrappedAdapterItemRangeInserted(param0: number, param1: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onGetSwipeReactionType(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): number;
							public release(): void;
							public onCreateViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							public static convertToOriginalPosition(param0: number, param1: number, param2: number, param3: number): number;
							public onBridgedAdapterRangeMoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: number): void;
							public onHandleWrappedAdapterItemRangeRemoved(param0: number, param1: number): void;
							public onHandleWrappedAdapterItemRangeChanged(param0: number, param1: number, param2: javalangObject): void;
							public onHandleWrappedAdapterItemRangeChanged(param0: number, param1: number): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: javalangObject): void;
							public onHandleWrappedAdapterChanged(): void;
						}
						export module DraggableItemWrapperAdapter {
							export class Constants extends javalangObject implements com.h6ah4i.android.widget.advrecyclerview.draggable.DraggableItemConstants {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.draggable.DraggableItemWrapperAdapter$Constants interface with the provided implementation.
								 */
								public constructor();
								public static STATE_FLAG_DRAGGING: number;
								public static STATE_FLAG_IS_IN_RANGE: number;
								public static STATE_FLAG_IS_UPDATED: number;
								public static STATE_FLAG_IS_ACTIVE: number;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class DraggingItemDecorator extends com.h6ah4i.android.widget.advrecyclerview.draggable.BaseDraggableItemDecorator {
							public setIsScrolling(param0: boolean): void;
							public constructor(param0: androidsupportv7widgetRecyclerView, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange);
							public isReachedToLeftLimit(): boolean;
							public isReachedToBottomLimit(): boolean;
							public onDrawOver(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView): void;
							public update(param0: number, param1: number, param2: boolean): boolean;
							public getTranslatedItemPositionBottom(): number;
							public getTranslatedItemPositionRight(): number;
							public setupDraggingItemEffects(param0: com.h6ah4i.android.widget.advrecyclerview.draggable.DraggingItemEffectsInfo): void;
							public getDraggingItemMoveOffsetX(): number;
							public getTranslatedItemPositionLeft(): number;
							public getDraggingItemTranslationY(): number;
							public constructor();
							public invalidateDraggingItem(): void;
							public getDraggingItemMoveOffsetY(): number;
							public getTranslatedItemPositionTop(): number;
							public getDraggingItemTranslationX(): number;
							public setShadowDrawable(param0: androidgraphicsdrawableNinePatchDrawable): void;
							public refresh(param0: boolean): boolean;
							public constructor(param0: androidsupportv7widgetRecyclerView, param1: androidsupportv7widgetRecyclerViewViewHolder);
							public start(param0: com.h6ah4i.android.widget.advrecyclerview.draggable.DraggingItemInfo, param1: number, param2: number): void;
							public updateDraggingItemView(param0: com.h6ah4i.android.widget.advrecyclerview.draggable.DraggingItemInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onDrawOver(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView, param2: androidsupportv7widgetRecyclerViewState): void;
							public isReachedToTopLimit(): boolean;
							public isReachedToRightLimit(): boolean;
							public setDraggingItemViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public finish(param0: boolean): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class DraggingItemEffectsInfo extends javalangObject {
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class DraggingItemInfo extends javalangObject {
							public width: number;
							public height: number;
							public id: number;
							public initialItemLeft: number;
							public initialItemTop: number;
							public grabbedPositionX: number;
							public grabbedPositionY: number;
							public margins: androidgraphicsRect;
							public spanSize: number;
							public static createWithNewView(param0: com.h6ah4i.android.widget.advrecyclerview.draggable.DraggingItemInfo, param1: androidsupportv7widgetRecyclerViewViewHolder): com.h6ah4i.android.widget.advrecyclerview.draggable.DraggingItemInfo;
							public constructor(param0: androidsupportv7widgetRecyclerView, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number, param3: number);
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class ItemDraggableRange extends javalangObject {
							public getClassName(): string;
							public constructor(param0: number, param1: number);
							public getStart(): number;
							public getEnd(): number;
							public checkInRange(param0: number): boolean;
							public toString(): string;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class LeftRightEdgeEffectDecorator extends com.h6ah4i.android.widget.advrecyclerview.draggable.BaseEdgeEffectDecorator {
							public constructor();
							public getEdgeDirection(param0: number): number;
							public constructor(param0: androidsupportv7widgetRecyclerView);
						}
					}
				}
			}
		}
	}
}

import androidosHandler = android.os.Handler;
import androidosHandlerCallback = android.os.Handler.Callback;
import androidosLooper = android.os.Looper;
import androidosMessage = android.os.Message;
import androidviewMotionEvent = android.view.MotionEvent;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class RecyclerViewDragDropManager extends javalangObject implements com.h6ah4i.android.widget.advrecyclerview.draggable.DraggableItemConstants {
							public static DEFAULT_SWAP_TARGET_TRANSITION_INTERPOLATOR: androidviewanimationInterpolator;
							public static DEFAULT_ITEM_SETTLE_BACK_INTO_PLACE_ANIMATION_INTERPOLATOR: androidviewanimationInterpolator;
							public static ITEM_MOVE_MODE_DEFAULT: number;
							public static ITEM_MOVE_MODE_SWAP: number;
							public setItemSettleBackIntoPlaceAnimationDuration(param0: number): void;
							public setDraggingItemShadowDrawable(param0: androidgraphicsdrawableNinePatchDrawable): void;
							public setSwapTargetTranslationInterpolator(): androidviewanimationInterpolator;
							public getDraggingItemScale(): number;
							public setDraggingItemAlpha(param0: number): void;
							public setOnItemDragEventListener(param0: com.h6ah4i.android.widget.advrecyclerview.draggable.RecyclerViewDragDropManager.OnItemDragEventListener): void;
							public getItemSettleBackIntoPlaceAnimationDuration(): number;
							public getDraggingItemAlpha(): number;
							public getDraggingItemRotation(): number;
							public setInitiateOnTouch(param0: boolean): void;
							public getOnItemDragEventListener(): com.h6ah4i.android.widget.advrecyclerview.draggable.RecyclerViewDragDropManager.OnItemDragEventListener;
							public setDragStartItemAnimationDuration(param0: number): void;
							public setSwapTargetTranslationInterpolator(param0: androidviewanimationInterpolator): void;
							public isInitiateOnLongPressEnabled(): boolean;
							public isDragging(): boolean;
							public setItemMoveMode(param0: number): void;
							public setInitiateOnMove(param0: boolean): void;
							public getDragStartItemScaleAnimationInterpolator(): androidviewanimationInterpolator;
							public setDragStartItemAlphaAnimationInterpolator(param0: androidviewanimationInterpolator): void;
							public constructor();
							public getItemMoveMode(): number;
							public isReleased(): boolean;
							public getDragEdgeScrollSpeed(): number;
							public isCheckCanDropEnabled(): boolean;
							public setDragStartItemRotationAnimationInterpolator(param0: androidviewanimationInterpolator): void;
							public createWrappedAdapter(param0: androidsupportv7widgetRecyclerViewAdapter<any>): androidsupportv7widgetRecyclerViewAdapter<any>;
							public release(): void;
							public setInitiateOnLongPress(param0: boolean): void;
							public getItemSettleBackIntoPlaceAnimationInterpolator(): androidviewanimationInterpolator;
							public attachRecyclerView(param0: androidsupportv7widgetRecyclerView): void;
							public setDraggingItemScale(param0: number): void;
							public getDragStartItemRotationAnimationInterpolator(): androidviewanimationInterpolator;
							public getDragStartItemAlphaAnimationInterpolator(): androidviewanimationInterpolator;
							public setItemSettleBackIntoPlaceAnimationInterpolator(param0: androidviewanimationInterpolator): void;
							public setLongPressTimeout(param0: number): void;
							public setDragEdgeScrollSpeed(param0: number): void;
							public setDragStartItemScaleAnimationInterpolator(param0: androidviewanimationInterpolator): void;
							public setDraggingItemRotation(param0: number): void;
							public isInitiateOnMoveEnabled(): boolean;
							public cancelDrag(): void;
							public getDragStartItemAnimationDuration(): number;
							public isInitiateOnTouchEnabled(): boolean;
							public setCheckCanDropEnabled(param0: boolean): void;
						}
						export module RecyclerViewDragDropManager {
							export class FindSwapTargetContext extends javalangObject {
								public rv: androidsupportv7widgetRecyclerView;
								public draggingItemInfo: com.h6ah4i.android.widget.advrecyclerview.draggable.DraggingItemInfo;
								public draggingItem: androidsupportv7widgetRecyclerViewViewHolder;
								public lastTouchX: number;
								public lastTouchY: number;
								public overlayItemLeft: number;
								public overlayItemTop: number;
								public overlayItemLeftNotClipped: number;
								public overlayItemTopNotClipped: number;
								public layoutType: number;
								public vertical: boolean;
								public wrappedAdapterRange: com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange;
								public rootAdapterRange: com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange;
								public checkCanSwap: boolean;
								public clear(): void;
								public setup(param0: androidsupportv7widgetRecyclerView, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: com.h6ah4i.android.widget.advrecyclerview.draggable.DraggingItemInfo, param3: number, param4: number, param5: com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange, param6: com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange, param7: boolean): void;
							}
							export class InternalHandler extends androidosHandler {
								public isCancelDragRequested(): boolean;
								public constructor();
								public startLongPressDetection(param0: androidviewMotionEvent, param1: number): void;
								public release(): void;
								public handleMessage(param0: androidosMessage): void;
								public removeDraggingItemViewSizeUpdateCheckRequest(): void;
								public scheduleDraggingItemViewSizeUpdateCheck(): void;
								public constructor(param0: androidosLooper);
								public constructor(param0: androidosLooper, param1: androidosHandlerCallback);
								public removeDeferredCancelDragRequest(): void;
								public requestDeferredCancelDrag(): void;
								public constructor(param0: androidosHandlerCallback);
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.draggable.RecyclerViewDragDropManager);
								public cancelLongPressDetection(): void;
							}
							export class ItemMoveMode extends javalangObject implements javalangannotationAnnotation {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.draggable.RecyclerViewDragDropManager$ItemMoveMode interface with the provided implementation.
								 */
								public constructor();
								public equals(param0: javalangObject): boolean;
								public toString(): string;
								public annotationType(): javalangClass<any>;
								public hashCode(): number;
							}
							export class OnItemDragEventListener extends javalangObject {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.draggable.RecyclerViewDragDropManager$OnItemDragEventListener interface with the provided implementation.
								 */
								public constructor(implementation: {
									onItemDragStarted(param0: number): void;
									onItemDragPositionChanged(param0: number, param1: number): void;
									onItemDragFinished(param0: number, param1: number, param2: boolean): void;
									onItemDragMoveDistanceUpdated(param0: number, param1: number): void;
								});
								public onItemDragFinished(param0: number, param1: number, param2: boolean): void;
								public onItemDragStarted(param0: number): void;
								public onItemDragMoveDistanceUpdated(param0: number, param1: number): void;
								public onItemDragPositionChanged(param0: number, param1: number): void;
							}
							export class ScrollOnDraggingProcessRunnable extends javalangObject implements javalangRunnable {
								public stop(): void;
								public run(): void;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.draggable.RecyclerViewDragDropManager);
								public start(): void;
								public release(): void;
							}
							export class SwapTarget extends javalangObject {
								public holder: androidsupportv7widgetRecyclerViewViewHolder;
								public position: number;
								public self: boolean;
								public clear(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class SwapTargetItemOperator extends com.h6ah4i.android.widget.advrecyclerview.draggable.BaseDraggableItemDecorator {
							public constructor();
							public setSwapTargetItem(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public constructor(param0: androidsupportv7widgetRecyclerView, param1: androidsupportv7widgetRecyclerViewViewHolder);
							public start(): void;
							public onDraw(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView, param2: androidsupportv7widgetRecyclerViewState): void;
							public update(param0: number, param1: number): void;
							public setSwapTargetTranslationInterpolator(param0: androidviewanimationInterpolator): void;
							public constructor(param0: androidsupportv7widgetRecyclerView, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: com.h6ah4i.android.widget.advrecyclerview.draggable.DraggingItemInfo);
							public onItemViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public finish(param0: boolean): void;
							public onDraw(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export class TopBottomEdgeEffectDecorator extends com.h6ah4i.android.widget.advrecyclerview.draggable.BaseEdgeEffectDecorator {
							public constructor();
							public getEdgeDirection(param0: number): number;
							public constructor(param0: androidsupportv7widgetRecyclerView);
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module draggable {
						export module annotation {
							export class DraggableItemStateFlags extends javalangObject implements javalangannotationAnnotation {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.draggable.annotation.DraggableItemStateFlags interface with the provided implementation.
								 */
								public constructor();
								public equals(param0: javalangObject): boolean;
								public toString(): string;
								public annotationType(): javalangClass<any>;
								public hashCode(): number;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module event {
						export abstract class BaseRecyclerViewEventDistributor extends javalangObject {
							public mReleased: boolean;
							public mRecyclerView: androidsupportv7widgetRecyclerView;
							public mListeners: javautilList<any>;
							public mPerformingClearMethod: boolean;
							public constructor();
							public size(): number;
							public isReleased(): boolean;
							public onRelease(): void;
							public clear(param0: boolean): void;
							public clear(): void;
							public getRecyclerView(): androidsupportv7widgetRecyclerView;
							public release(): void;
							public attachRecyclerView(param0: androidsupportv7widgetRecyclerView): void;
							public contains(param0: javalangObject): boolean;
							public add(param0: javalangObject, param1: number): boolean;
							public remove(param0: javalangObject): boolean;
							public verifyIsNotPerformingClearMethod(param0: string): void;
							public verifyIsNotReleased(param0: string): void;
							public add(param0: javalangObject): boolean;
							public onRecyclerViewAttached(param0: androidsupportv7widgetRecyclerView): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module event {
						export class RecyclerViewEventDistributorListener extends javalangObject {
							/**
							 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.event.RecyclerViewEventDistributorListener interface with the provided implementation.
							 */
							public constructor();
							public onAddedToEventDistributor(param0: com.h6ah4i.android.widget.advrecyclerview.event.BaseRecyclerViewEventDistributor): void;
							public onRemovedFromEventDistributor(param0: com.h6ah4i.android.widget.advrecyclerview.event.BaseRecyclerViewEventDistributor): void;
						}
					}
				}
			}
		}
	}
}

import androidsupportv7widgetRecyclerViewRecyclerListener = androidx.recyclerview.widget.RecyclerView.RecyclerListener;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module event {
						export class RecyclerViewRecyclerEventDistributor extends com.h6ah4i.android.widget.advrecyclerview.event.BaseRecyclerViewEventDistributor {
							public constructor();
							public onRelease(): void;
							public onRecyclerViewAttached(param0: androidsupportv7widgetRecyclerView): void;
						}
						export module RecyclerViewRecyclerEventDistributor {
							export class InternalRecyclerListener extends javalangObject implements androidsupportv7widgetRecyclerViewRecyclerListener {
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.event.RecyclerViewRecyclerEventDistributor);
								public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public release(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export interface BaseExpandableSwipeableItemAdapter {
							 onGetChildItemSwipeReactionType(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: number): number;
							 onSwipeGroupItemStarted(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							 onGetGroupItemSwipeReactionType(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): number;
							 onSetChildItemSwipeBackground(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): void;
							 onSwipeChildItemStarted(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): void;
							 onSetGroupItemSwipeBackground(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export class ChildPositionItemDraggableRange extends com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange {
							public getClassName(): string;
							public constructor(param0: number, param1: number);
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export class ExpandableAdapterHelper extends javalangObject {
							public static NO_EXPANDABLE_POSITION: number;
							public static getPackedPositionChild(param0: number): number;
							public static getPackedPositionForGroup(param0: number): number;
							public static getPackedPositionForChild(param0: number, param1: number): number;
							public static getPackedPositionGroup(param0: number): number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export class ExpandableDraggableItemAdapter extends javalangObject {
							/**
							 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.expandable.ExpandableDraggableItemAdapter interface with the provided implementation.
							 */
							public constructor();
							public onGetGroupItemDraggableRange(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange;
							public onChildDragStarted(param0: number, param1: number): void;
							public onMoveGroupItem(param0: number, param1: number): void;
							public onGroupDragFinished(param0: number, param1: number, param2: boolean): void;
							public onCheckGroupCanDrop(param0: number, param1: number): boolean;
							public onChildDragFinished(param0: number, param1: number, param2: number, param3: number, param4: boolean): void;
							public onCheckChildCanStartDrag(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: number): boolean;
							public onCheckGroupCanStartDrag(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): boolean;
							public onMoveChildItem(param0: number, param1: number, param2: number, param3: number): void;
							public onCheckChildCanDrop(param0: number, param1: number, param2: number, param3: number): boolean;
							public onGetChildItemDraggableRange(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange;
							public onGroupDragStarted(param0: number): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export interface ExpandableItemAdapter {
							 onBindGroupViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: javautilList<any>): void;
							 onCheckCanExpandOrCollapseGroup(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: boolean): boolean;
							 onHookGroupCollapse(param0: number, param1: boolean, param2: javalangObject): boolean;
							 onBindGroupViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): void;
							 onHookGroupExpand(param0: number, param1: boolean, param2: javalangObject): boolean;
							 getChildId(param0: number, param1: number): number;
							 getGroupItemViewType(param0: number): number;
							 getInitialGroupExpandedState(param0: number): boolean;
							 getChildCount(param0: number): number;
							 onBindChildViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): void;
							 onHookGroupExpand(param0: number, param1: boolean): boolean;
							 onCreateChildViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							 getChildItemViewType(param0: number, param1: number): number;
							 onBindChildViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: javautilList<any>): void;
							 onHookGroupCollapse(param0: number, param1: boolean): boolean;
							 onCreateGroupViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							 getGroupCount(): number;
							 getGroupId(param0: number): number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export class ExpandableItemConstants extends javalangObject {
							/**
							 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.expandable.ExpandableItemConstants interface with the provided implementation.
							 */
							public constructor();
							public static STATE_FLAG_IS_GROUP: number;
							public static STATE_FLAG_IS_EXPANDED: number;
							public static STATE_FLAG_HAS_EXPANDED_STATE_CHANGED: number;
							public static STATE_FLAG_IS_UPDATED: number;
							public static STATE_FLAG_IS_CHILD: number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export interface ExpandableItemViewHolder {
							 getExpandStateFlags(): number;
							 setExpandStateFlags(param0: number): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export class ExpandablePositionTranslator extends javalangObject {
							public static BUILD_OPTION_DEFAULT: number;
							public static BUILD_OPTION_EXPANDED_ALL: number;
							public static BUILD_OPTION_COLLAPSED_ALL: number;
							public removeChildItem(param0: number, param1: number): void;
							public insertChildItems(param0: number, param1: number, param2: number): void;
							public collapseGroup(param0: number): boolean;
							public isAllCollapsed(): boolean;
							public getExpandedGroupsCount(): number;
							public removeGroupItem(param0: number): number;
							public restoreExpandedGroupItems(param0: native.Array<number>, param1: com.h6ah4i.android.widget.advrecyclerview.expandable.ExpandableItemAdapter, param2: com.h6ah4i.android.widget.advrecyclerview.expandable.RecyclerViewExpandableItemManager.OnGroupExpandListener, param3: com.h6ah4i.android.widget.advrecyclerview.expandable.RecyclerViewExpandableItemManager.OnGroupCollapseListener): void;
							public getChildCount(param0: number): number;
							public build(param0: com.h6ah4i.android.widget.advrecyclerview.expandable.ExpandableItemAdapter, param1: number, param2: boolean): void;
							public moveChildItem(param0: number, param1: number, param2: number, param3: number): void;
							public getFlatPosition(param0: number): number;
							public moveGroupItem(param0: number, param1: number): void;
							public constructor();
							public expandGroup(param0: number): boolean;
							public removeGroupItems(param0: number, param1: number): number;
							public getCollapsedGroupsCount(): number;
							public isGroupExpanded(param0: number): boolean;
							public insertGroupItems(param0: number, param1: number, param2: boolean): number;
							public getSavedStateArray(): native.Array<number>;
							public getExpandablePosition(param0: number): number;
							public insertChildItem(param0: number, param1: number): void;
							public getItemCount(): number;
							public insertGroupItem(param0: number, param1: boolean): number;
							public isAllExpanded(): boolean;
							public isEmpty(): boolean;
							public removeChildItems(param0: number, param1: number, param2: number): void;
							public getVisibleChildCount(param0: number): number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export class ExpandableRecyclerViewWrapperAdapter extends com.h6ah4i.android.widget.advrecyclerview.adapter.SimpleWrapperAdapter implements com.h6ah4i.android.widget.advrecyclerview.draggable.DraggableItemAdapter, com.h6ah4i.android.widget.advrecyclerview.swipeable.SwipeableItemAdapter {
							public onBridgedAdapterItemRangeInserted(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public getItemId(param0: number): number;
							public constructor(param0: androidsupportv7widgetRecyclerViewAdapter<any>);
							public getItemViewType(param0: number): number;
							public onBridgedAdapterChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject): void;
							public onRelease(): void;
							public unwrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.UnwrapPositionResult, param1: number): void;
							public getWrappedAdapters(param0: javautilList<any>): void;
							public onGetItemDraggableRange(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange;
							public onSwipeItemStarted(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onHandleWrappedAdapterRangeMoved(param0: number, param1: number, param2: number): void;
							public onSetSwipeBackground(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onCheckCanDrop(param0: number, param1: number): boolean;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: javautilList<any>): void;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public constructor();
							public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.expandable.RecyclerViewExpandableItemManager, param1: androidsupportv7widgetRecyclerViewAdapter<any>, param2: native.Array<number>);
							public onSwipeItem(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction;
							public wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment, param1: number): number;
							public onBridgedAdapterItemRangeRemoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onHandleWrappedAdapterItemRangeInserted(param0: number, param1: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public onCheckCanStartDrag(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): boolean;
							public onGetSwipeReactionType(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): number;
							public release(): void;
							public onCreateViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							public onItemDragFinished(param0: number, param1: number, param2: boolean): void;
							public onBridgedAdapterRangeMoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: number): void;
							public onHandleWrappedAdapterItemRangeRemoved(param0: number, param1: number): void;
							public getItemCount(): number;
							public onMoveItem(param0: number, param1: number): void;
							public onItemDragStarted(param0: number): void;
							public onHandleWrappedAdapterItemRangeChanged(param0: number, param1: number, param2: javalangObject): void;
							public onHandleWrappedAdapterItemRangeChanged(param0: number, param1: number): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: javalangObject): void;
							public onHandleWrappedAdapterChanged(): void;
						}
						export module ExpandableRecyclerViewWrapperAdapter {
							export class Constants extends javalangObject implements com.h6ah4i.android.widget.advrecyclerview.expandable.ExpandableItemConstants {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.expandable.ExpandableRecyclerViewWrapperAdapter$Constants interface with the provided implementation.
								 */
								public constructor(implementation: {
								});
								public static STATE_FLAG_IS_GROUP: number;
								public static STATE_FLAG_IS_EXPANDED: number;
								public static STATE_FLAG_HAS_EXPANDED_STATE_CHANGED: number;
								public static STATE_FLAG_IS_UPDATED: number;
								public static STATE_FLAG_IS_CHILD: number;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export interface ExpandableSwipeableItemAdapter extends com.h6ah4i.android.widget.advrecyclerview.expandable.BaseExpandableSwipeableItemAdapter {
							 onGetChildItemSwipeReactionType(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: number): number;
							 onSwipeGroupItemStarted(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							 onSwipeChildItem(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction;
							 onGetGroupItemSwipeReactionType(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): number;
							 onSetChildItemSwipeBackground(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): void;
							 onSwipeGroupItem(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction;
							 onSwipeChildItemStarted(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): void;
							 onSetGroupItemSwipeBackground(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export class ExpandableSwipeableItemInternalUtils extends javalangObject {
							public static invokeOnSwipeItem(param0: com.h6ah4i.android.widget.advrecyclerview.expandable.BaseExpandableSwipeableItemAdapter, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number, param3: number, param4: number): com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export class GroupPositionItemDraggableRange extends com.h6ah4i.android.widget.advrecyclerview.draggable.ItemDraggableRange {
							public getClassName(): string;
							public constructor(param0: number, param1: number);
						}
					}
				}
			}
		}
	}
}

import androidosParcelable = android.os.Parcelable;
import androidosParcel = android.os.Parcel;
import androidosParcelableCreator = android.os.Parcelable.Creator;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export class RecyclerViewExpandableItemManager extends javalangObject implements com.h6ah4i.android.widget.advrecyclerview.expandable.ExpandableItemConstants {
							public static NO_EXPANDABLE_POSITION: number;
							public notifyGroupItemChanged(param0: number, param1: javalangObject): void;
							public collapseAll(): void;
							public notifyGroupItemChanged(param0: number): void;
							public notifyGroupItemInserted(param0: number): void;
							public static getCombinedChildId(param0: number, param1: number): number;
							public notifyChildItemRangeChanged(param0: number, param1: number, param2: number, param3: javalangObject): void;
							public expandAll(): void;
							public collapseGroup(param0: number): boolean;
							public notifyGroupItemMoved(param0: number, param1: number): void;
							public getSavedState(): androidosParcelable;
							public static getPackedPositionGroup(param0: number): number;
							public getExpandedGroupsCount(): number;
							public notifyGroupItemRangeInserted(param0: number, param1: number): void;
							public getChildCount(param0: number): number;
							public getFlatPosition(param0: number): number;
							public notifyGroupAndChildrenItemsChanged(param0: number, param1: javalangObject): void;
							public notifyChildItemRangeChanged(param0: number, param1: number, param2: number): void;
							public static isGroupItemId(param0: number): boolean;
							public notifyChildItemChanged(param0: number, param1: number, param2: javalangObject): void;
							public expandGroup(param0: number): boolean;
							public getCollapsedGroupsCount(): number;
							public isAllGroupsCollapsed(): boolean;
							public isReleased(): boolean;
							public notifyGroupItemRangeInserted(param0: number, param1: number, param2: boolean): void;
							public scrollToGroup(param0: number, param1: number, param2: number, param3: number, param4: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPath): void;
							public isAllGroupsExpanded(): boolean;
							public constructor(param0: androidosParcelable);
							public release(): void;
							public notifyChildItemMoved(param0: number, param1: number, param2: number, param3: number): void;
							public static getChildItemId(param0: number): number;
							public attachRecyclerView(param0: androidsupportv7widgetRecyclerView): void;
							public getExpandablePosition(param0: number): number;
							public restoreState(param0: androidosParcelable, param1: boolean, param2: boolean): void;
							public restoreState(param0: androidosParcelable): void;
							public scrollToGroupWithTotalChildrenHeight(param0: number, param1: number, param2: number, param3: number, param4: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPath): void;
							public notifyGroupItemRangeRemoved(param0: number, param1: number): void;
							public setDefaultGroupsExpandedState(param0: boolean): void;
							public notifyChildItemRangeRemoved(param0: number, param1: number, param2: number): void;
							public getGroupCount(): number;
							public static isGroupViewType(param0: number): boolean;
							public notifyChildItemRemoved(param0: number, param1: number): void;
							public static getPackedPositionChild(param0: number): number;
							public notifyGroupItemRemoved(param0: number): void;
							public notifyChildItemChanged(param0: number, param1: number): void;
							public scrollToGroup(param0: number, param1: number, param2: number, param3: number): void;
							public collapseGroup(param0: number, param1: javalangObject): boolean;
							public scrollToGroupWithTotalChildrenHeight(param0: number, param1: number, param2: number, param3: number): void;
							public static getPackedPositionForGroup(param0: number): number;
							public notifyChildrenOfGroupItemChanged(param0: number, param1: javalangObject): void;
							public notifyGroupAndChildrenItemsChanged(param0: number): void;
							public expandGroup(param0: number, param1: javalangObject): boolean;
							public scrollToGroup(param0: number, param1: number): void;
							public notifyChildrenOfGroupItemChanged(param0: number): void;
							public static getCombinedGroupId(param0: number): number;
							public isGroupExpanded(param0: number): boolean;
							public createWrappedAdapter(param0: androidsupportv7widgetRecyclerViewAdapter<any>): androidsupportv7widgetRecyclerViewAdapter<any>;
							public static getChildViewType(param0: number): number;
							public notifyChildItemMoved(param0: number, param1: number, param2: number): void;
							public static getGroupViewType(param0: number): number;
							public static getPackedPositionForChild(param0: number, param1: number): number;
							public notifyGroupItemInserted(param0: number, param1: boolean): void;
							public static getGroupItemId(param0: number): number;
							public setOnGroupExpandListener(param0: com.h6ah4i.android.widget.advrecyclerview.expandable.RecyclerViewExpandableItemManager.OnGroupExpandListener): void;
							public setOnGroupCollapseListener(param0: com.h6ah4i.android.widget.advrecyclerview.expandable.RecyclerViewExpandableItemManager.OnGroupCollapseListener): void;
							public notifyChildItemInserted(param0: number, param1: number): void;
							public getDefaultGroupsExpandedState(): boolean;
							public notifyChildItemRangeInserted(param0: number, param1: number, param2: number): void;
						}
						export module RecyclerViewExpandableItemManager {
							export class OnGroupCollapseListener extends javalangObject {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.expandable.RecyclerViewExpandableItemManager$OnGroupCollapseListener interface with the provided implementation.
								 */
								public constructor();
								public onGroupCollapse(param0: number, param1: boolean, param2: javalangObject): void;
							}
							export class OnGroupExpandListener extends javalangObject {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.expandable.RecyclerViewExpandableItemManager$OnGroupExpandListener interface with the provided implementation.
								 */
								public constructor();
								public onGroupExpand(param0: number, param1: boolean, param2: javalangObject): void;
							}
							export class SavedState extends javalangObject implements androidosParcelable {
								public static CREATOR: androidosParcelableCreator<any>;
								public describeContents(): number;
								public constructor(param0: native.Array<number>);
								public writeToParcel(param0: androidosParcel, param1: number): void;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module expandable {
						export module annotation {
							export class ExpandableItemStateFlags extends javalangObject implements javalangannotationAnnotation {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.expandable.annotation.ExpandableItemStateFlags interface with the provided implementation.
								 */
								public constructor();
								public equals(param0: javalangObject): boolean;
								public toString(): string;
								public annotationType(): javalangClass<any>;
								public hashCode(): number;
							}
						}
					}
				}
			}
		}
	}
}
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module headerfooter {
						export abstract class AbstractHeaderFooterWrapperAdapter<HVH, FVH> extends com.h6ah4i.android.widget.advrecyclerview.composedadapter.ComposedAdapter {
							public static SEGMENT_TYPE_HEADER: number;
							public static SEGMENT_TYPE_NORMAL: number;
							public static SEGMENT_TYPE_FOOTER: number;
							public getFooterItemId(param0: number): number;
							public getFooterItemViewType(param0: number): number;
							public onBridgedAdapterItemRangeInserted(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public getHeaderItemCount(): number;
							public onBridgedAdapterChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject): void;
							public onRelease(): void;
							public unwrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.UnwrapPositionResult, param1: number): void;
							public onBindHeaderItemViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: javautilList<any>): void;
							public getWrappedAdapters(param0: javautilList<any>): void;
							public getFooterSegment(): com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment;
							public setAdapter(param0: androidsupportv7widgetRecyclerViewAdapter<any>): com.h6ah4i.android.widget.advrecyclerview.headerfooter.AbstractHeaderFooterWrapperAdapter<HVH, FVH>;
							public onCreateFooterItemViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							public onCreateFooterAdapter(): androidsupportv7widgetRecyclerViewAdapter<any>;
							public onBindFooterItemViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: javautilList<any>): void;
							public onCreateHeaderAdapter(): androidsupportv7widgetRecyclerViewAdapter<any>;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public getHeaderItemId(param0: number): number;
							public onBindFooterItemViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public constructor();
							public wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment, param1: number): number;
							public onBridgedAdapterItemRangeRemoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public getHeaderItemViewType(param0: number): number;
							public getHeaderSegment(): com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment;
							public release(): void;
							public onBindHeaderItemViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onCreateHeaderItemViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							public onBridgedAdapterRangeMoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: number): void;
							public getHeaderAdapter(): androidsupportv7widgetRecyclerViewAdapter<any>;
							public getFooterItemCount(): number;
							public getWrappedAdapterSegment(): com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment;
							public getWrappedAdapter(): androidsupportv7widgetRecyclerViewAdapter<any>;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: javalangObject): void;
							public getFooterAdapter(): androidsupportv7widgetRecyclerViewAdapter<any>;
						}
						export module AbstractHeaderFooterWrapperAdapter {
							export class BaseFooterAdapter extends androidsupportv7widgetRecyclerViewAdapter<any> {
								public mHolder: com.h6ah4i.android.widget.advrecyclerview.headerfooter.AbstractHeaderFooterWrapperAdapter<any, any>;
								public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
								public onCreateViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
								public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: javautilList<any>): void;
								public getItemCount(): number;
								public constructor();
								public getItemViewType(param0: number): number;
								public getItemId(param0: number): number;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.headerfooter.AbstractHeaderFooterWrapperAdapter<any, any>);
							}
							export class BaseHeaderAdapter extends androidsupportv7widgetRecyclerViewAdapter<any> {
								public mHolder: com.h6ah4i.android.widget.advrecyclerview.headerfooter.AbstractHeaderFooterWrapperAdapter<any, any>;
								public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
								public onCreateViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
								public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: javautilList<any>): void;
								public getItemCount(): number;
								public constructor();
								public getItemViewType(param0: number): number;
								public getItemId(param0: number): number;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.headerfooter.AbstractHeaderFooterWrapperAdapter<any, any>);
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class InternalConstants extends javalangObject {
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class InternalHelperKK extends javalangObject {
							public static clearViewPropertyAnimatorUpdateListener(param0: androidviewView): void;
						}
					}
				}
			}
		}
	}
}

import androidsupportv4viewViewPropertyAnimatorUpdateListener = androidx.core.view.ViewPropertyAnimatorUpdateListener;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class ItemSlidingAnimator extends javalangObject {
							public static DIR_LEFT: number;
							public static DIR_UP: number;
							public static DIR_RIGHT: number;
							public static DIR_DOWN: number;
							public slideToOutsideOfWindow(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: boolean, param3: number): void;
							public getImmediatelySetTranslationThreshold(): number;
							public getSwipeContainerViewTranslationX(param0: androidsupportv7widgetRecyclerViewViewHolder): number;
							public getSwipeContainerViewTranslationY(param0: androidsupportv7widgetRecyclerViewViewHolder): number;
							public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.swipeable.SwipeableItemWrapperAdapter);
							public finishSwipeSlideToDefaultPosition(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: boolean, param2: boolean, param3: number, param4: number, param5: com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction): boolean;
							public endAnimation(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public isRunning(): boolean;
							public finishSwipeSlideToOutsideOfWindow(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: boolean, param3: number, param4: number, param5: com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction): boolean;
							public slideToDefaultPosition(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: boolean, param2: boolean, param3: number): void;
							public setImmediatelySetTranslationThreshold(param0: number): void;
							public isRunning(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
							public endAnimations(): void;
							public slideToSpecifiedPosition(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: boolean, param3: boolean, param4: boolean, param5: number): void;
						}
						export module ItemSlidingAnimator {
							export class DeferredSlideProcess extends com.h6ah4i.android.widget.advrecyclerview.swipeable.ItemSlidingAnimator.ViewHolderDeferredProcess {
								public onProcess(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public run(): void;
								public constructor(param0: androidsupportv7widgetRecyclerViewViewHolder);
								public constructor(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: boolean);
							}
							export class SlidingAnimatorListenerObject extends javalangObject implements androidsupportv4viewViewPropertyAnimatorListener, androidsupportv4viewViewPropertyAnimatorUpdateListener {
								public onAnimationStart(param0: androidviewView): void;
								public onAnimationEnd(param0: androidviewView): void;
								public onAnimationCancel(param0: androidviewView): void;
								public onAnimationUpdate(param0: androidviewView): void;
							}
							export class SwipeFinishInfo extends javalangObject {
								public clear(): void;
								public constructor(param0: number, param1: com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction);
							}
							export abstract class ViewHolderDeferredProcess extends javalangObject implements javalangRunnable {
								public onProcess(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
								public lostReference(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
								public run(): void;
								public constructor(param0: androidsupportv7widgetRecyclerViewViewHolder);
								public hasTargetViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class RecyclerViewSwipeManager extends javalangObject implements com.h6ah4i.android.widget.advrecyclerview.swipeable.SwipeableItemConstants {
							public constructor();
							public getReturnToDefaultPositionAnimationDuration(): number;
							public getMoveToOutsideWindowAnimationDuration(): number;
							public getMoveToSpecifiedPositionAnimationDuration(): number;
							public isReleased(): boolean;
							public setMoveToSpecifiedPositionAnimationDuration(param0: number): void;
							public createWrappedAdapter(param0: androidsupportv7widgetRecyclerViewAdapter<any>): androidsupportv7widgetRecyclerViewAdapter<any>;
							public release(): void;
							public isSwiping(): boolean;
							public attachRecyclerView(param0: androidsupportv7widgetRecyclerView): void;
							public getSwipeThresholdDistance(): number;
							public setMoveToOutsideWindowAnimationDuration(param0: number): void;
							public setLongPressTimeout(param0: number): void;
							public setReturnToDefaultPositionAnimationDuration(param0: number): void;
							public cancelSwipe(): void;
							public setOnItemSwipeEventListener(param0: com.h6ah4i.android.widget.advrecyclerview.swipeable.RecyclerViewSwipeManager.OnItemSwipeEventListener): void;
							public performFakeSwipe(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): boolean;
							public getOnItemSwipeEventListener(): com.h6ah4i.android.widget.advrecyclerview.swipeable.RecyclerViewSwipeManager.OnItemSwipeEventListener;
							public setSwipeThresholdDistance(param0: number): void;
						}
						export module RecyclerViewSwipeManager {
							export class InternalHandler extends androidosHandler {
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.swipeable.RecyclerViewSwipeManager);
								public requestDeferredCancelSwipe(): void;
								public constructor(param0: androidosLooper);
								public constructor(param0: androidosLooper, param1: androidosHandlerCallback);
								public constructor(param0: androidosHandlerCallback);
								public constructor();
								public isCancelSwipeRequested(): boolean;
								public startLongPressDetection(param0: androidviewMotionEvent, param1: number): void;
								public cancelLongPressDetection(): void;
								public release(): void;
								public handleMessage(param0: androidosMessage): void;
								public removeDeferredCancelSwipeRequest(): void;
							}
							export class OnItemSwipeEventListener extends javalangObject {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.swipeable.RecyclerViewSwipeManager$OnItemSwipeEventListener interface with the provided implementation.
								 */
								public constructor();
								public onItemSwipeStarted(param0: number): void;
								public onItemSwipeFinished(param0: number, param1: number, param2: number): void;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class RemovingItemDecorator extends androidsupportv7widgetRecyclerViewItemDecoration {
							public constructor();
							public constructor(param0: androidsupportv7widgetRecyclerView, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number, param3: number, param4: number);
							public start(): void;
							public onDraw(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView, param2: androidsupportv7widgetRecyclerViewState): void;
							public setMoveAnimationInterpolator(param0: androidviewanimationInterpolator): void;
							public static getElapsedTime(param0: number): number;
							public onDraw(param0: androidgraphicsCanvas, param1: androidsupportv7widgetRecyclerView): void;
						}
						export module RemovingItemDecorator {
							export class DelayedNotificationRunner extends javalangObject implements javalangRunnable {
								public run(): void;
								public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.swipeable.RemovingItemDecorator, param1: number);
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class RubberBandInterpolator extends javalangObject implements androidviewanimationInterpolator {
							public getInterpolation(param0: number): number;
							public constructor(param0: number);
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class SwipeReactionUtils extends javalangObject {
							public static canSwipeLeft(param0: number): boolean;
							public static extractRightReaction(param0: number): number;
							public static canSwipeUp(param0: number): boolean;
							public static extractDownReaction(param0: number): number;
							public static canSwipeDown(param0: number): boolean;
							public static extractLeftReaction(param0: number): number;
							public static extractUpReaction(param0: number): number;
							public static canSwipeRight(param0: number): boolean;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export interface SwipeableItemAdapter {
							 onSwipeItem(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction;
							 onSetSwipeBackground(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): void;
							 onGetSwipeReactionType(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): number;
							 onSwipeItemStarted(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class SwipeableItemConstants extends javalangObject {
							/**
							 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.swipeable.SwipeableItemConstants interface with the provided implementation.
							 */
							public constructor();
							public static AFTER_SWIPE_REACTION_DO_NOTHING: number;
							public static REACTION_CAN_SWIPE_LEFT: number;
							public static AFTER_SWIPE_REACTION_MOVE_TO_SWIPED_DIRECTION: number;
							public static RESULT_CANCELED: number;
							public static REACTION_CAN_NOT_SWIPE_UP_WITH_RUBBER_BAND_EFFECT: number;
							public static STATE_FLAG_IS_ACTIVE: number;
							public static RESULT_SWIPED_LEFT: number;
							public static REACTION_CAN_SWIPE_BOTH: number;
							public static REACTION_CAN_NOT_SWIPE_BOTH_WITH_RUBBER_BAND_EFFECT: number;
							public static REACTION_CAN_NOT_SWIPE_RIGHT: number;
							public static AFTER_SWIPE_REACTION_MOVE_TO_ORIGIN: number;
							public static REACTION_CAN_NOT_SWIPE_BOTH: number;
							public static OUTSIDE_OF_THE_WINDOW_RIGHT: number;
							public static REACTION_CAN_NOT_SWIPE_LEFT: number;
							public static REACTION_CAN_NOT_SWIPE_DOWN_WITH_RUBBER_BAND_EFFECT: number;
							public static REACTION_CAN_NOT_SWIPE_BOTH_H: number;
							public static REACTION_START_SWIPE_ON_LONG_PRESS: number;
							public static RESULT_SWIPED_DOWN: number;
							public static REACTION_CAN_NOT_SWIPE_BOTH_H_WITH_RUBBER_BAND_EFFECT: number;
							public static REACTION_CAN_SWIPE_DOWN: number;
							public static REACTION_CAN_NOT_SWIPE_BOTH_V: number;
							public static RESULT_SWIPED_RIGHT: number;
							public static DRAWABLE_SWIPE_DOWN_BACKGROUND: number;
							public static REACTION_CAN_NOT_SWIPE_RIGHT_WITH_RUBBER_BAND_EFFECT: number;
							public static REACTION_CAN_NOT_SWIPE_DOWN: number;
							public static RESULT_SWIPED_UP: number;
							public static REACTION_CAN_NOT_SWIPE_UP: number;
							public static STATE_FLAG_SWIPING: number;
							public static DRAWABLE_SWIPE_NEUTRAL_BACKGROUND: number;
							public static AFTER_SWIPE_REACTION_DEFAULT: number;
							public static REACTION_CAN_SWIPE_BOTH_H: number;
							public static RESULT_NONE: number;
							public static REACTION_MASK_START_SWIPE_UP: number;
							public static AFTER_SWIPE_REACTION_REMOVE_ITEM: number;
							public static REACTION_CAN_NOT_SWIPE_LEFT_WITH_RUBBER_BAND_EFFECT: number;
							public static OUTSIDE_OF_THE_WINDOW_TOP: number;
							public static REACTION_CAN_NOT_SWIPE_BOTH_V_WITH_RUBBER_BAND_EFFECT: number;
							public static REACTION_MASK_START_SWIPE_LEFT: number;
							public static REACTION_CAN_SWIPE_UP: number;
							public static STATE_FLAG_IS_UPDATED: number;
							public static REACTION_MASK_START_SWIPE_RIGHT: number;
							public static DRAWABLE_SWIPE_LEFT_BACKGROUND: number;
							public static DRAWABLE_SWIPE_UP_BACKGROUND: number;
							public static OUTSIDE_OF_THE_WINDOW_LEFT: number;
							public static REACTION_CAN_SWIPE_RIGHT: number;
							public static REACTION_MASK_START_SWIPE_DOWN: number;
							public static REACTION_CAN_SWIPE_BOTH_V: number;
							public static REACTION_CAN_NOT_SWIPE_ANY: number;
							public static DRAWABLE_SWIPE_RIGHT_BACKGROUND: number;
							public static OUTSIDE_OF_THE_WINDOW_BOTTOM: number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export interface SwipeableItemViewHolder {
							 setMaxDownSwipeAmount(param0: number): void;
							 setMaxUpSwipeAmount(param0: number): void;
							 getMaxLeftSwipeAmount(): number;
							 getSwipeStateFlags(): number;
							 getSwipeItemVerticalSlideAmount(): number;
							 getSwipeResult(): number;
							 onSlideAmountUpdated(param0: number, param1: number, param2: boolean): void;
							 setProportionalSwipeAmountModeEnabled(param0: boolean): void;
							 setMaxLeftSwipeAmount(param0: number): void;
							 setSwipeResult(param0: number): void;
							 getSwipeItemHorizontalSlideAmount(): number;
							 isProportionalSwipeAmountModeEnabled(): boolean;
							 setSwipeItemVerticalSlideAmount(param0: number): void;
							 getMaxRightSwipeAmount(): number;
							 getMaxDownSwipeAmount(): number;
							 setAfterSwipeReaction(param0: number): void;
							 getMaxUpSwipeAmount(): number;
							 setSwipeItemHorizontalSlideAmount(param0: number): void;
							 setSwipeStateFlags(param0: number): void;
							 getAfterSwipeReaction(): number;
							 getSwipeableContainerView(): androidviewView;
							 setMaxRightSwipeAmount(param0: number): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class SwipeableItemWrapperAdapter extends com.h6ah4i.android.widget.advrecyclerview.utils.BaseWrapperAdapter {
							public onBridgedAdapterItemRangeInserted(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public constructor(param0: androidsupportv7widgetRecyclerViewAdapter<any>);
							public onBridgedAdapterChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject): void;
							public onRelease(): void;
							public unwrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.UnwrapPositionResult, param1: number): void;
							public getWrappedAdapters(param0: javautilList<any>): void;
							public isSwiping(): boolean;
							public onHandleWrappedAdapterRangeMoved(param0: number, param1: number, param2: number): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: javautilList<any>): void;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public constructor();
							public wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment, param1: number): number;
							public onBridgedAdapterItemRangeRemoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public onHandleWrappedAdapterItemRangeInserted(param0: number, param1: number): void;
							public onViewRecycled(param0: androidsupportv7widgetRecyclerViewViewHolder): void;
							public release(): void;
							public onCreateViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.swipeable.RecyclerViewSwipeManager, param1: androidsupportv7widgetRecyclerViewAdapter<any>);
							public onBridgedAdapterRangeMoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: number): void;
							public onHandleWrappedAdapterItemRangeRemoved(param0: number, param1: number): void;
							public onHandleWrappedAdapterItemRangeChanged(param0: number, param1: number, param2: javalangObject): void;
							public onHandleWrappedAdapterItemRangeChanged(param0: number, param1: number): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: javalangObject): void;
							public onHandleWrappedAdapterChanged(): void;
						}
						export module SwipeableItemWrapperAdapter {
							export class Constants extends javalangObject implements com.h6ah4i.android.widget.advrecyclerview.swipeable.SwipeableItemConstants {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.swipeable.SwipeableItemWrapperAdapter$Constants interface with the provided implementation.
								 */
								public constructor();
								public static AFTER_SWIPE_REACTION_DO_NOTHING: number;
								public static REACTION_CAN_SWIPE_LEFT: number;
								public static AFTER_SWIPE_REACTION_MOVE_TO_SWIPED_DIRECTION: number;
								public static RESULT_CANCELED: number;
								public static REACTION_CAN_NOT_SWIPE_UP_WITH_RUBBER_BAND_EFFECT: number;
								public static STATE_FLAG_IS_ACTIVE: number;
								public static RESULT_SWIPED_LEFT: number;
								public static REACTION_CAN_SWIPE_BOTH: number;
								public static REACTION_CAN_NOT_SWIPE_BOTH_WITH_RUBBER_BAND_EFFECT: number;
								public static REACTION_CAN_NOT_SWIPE_RIGHT: number;
								public static AFTER_SWIPE_REACTION_MOVE_TO_ORIGIN: number;
								public static REACTION_CAN_NOT_SWIPE_BOTH: number;
								public static OUTSIDE_OF_THE_WINDOW_RIGHT: number;
								public static REACTION_CAN_NOT_SWIPE_LEFT: number;
								public static REACTION_CAN_NOT_SWIPE_DOWN_WITH_RUBBER_BAND_EFFECT: number;
								public static REACTION_CAN_NOT_SWIPE_BOTH_H: number;
								public static REACTION_START_SWIPE_ON_LONG_PRESS: number;
								public static RESULT_SWIPED_DOWN: number;
								public static REACTION_CAN_NOT_SWIPE_BOTH_H_WITH_RUBBER_BAND_EFFECT: number;
								public static REACTION_CAN_SWIPE_DOWN: number;
								public static REACTION_CAN_NOT_SWIPE_BOTH_V: number;
								public static RESULT_SWIPED_RIGHT: number;
								public static DRAWABLE_SWIPE_DOWN_BACKGROUND: number;
								public static REACTION_CAN_NOT_SWIPE_RIGHT_WITH_RUBBER_BAND_EFFECT: number;
								public static REACTION_CAN_NOT_SWIPE_DOWN: number;
								public static RESULT_SWIPED_UP: number;
								public static REACTION_CAN_NOT_SWIPE_UP: number;
								public static STATE_FLAG_SWIPING: number;
								public static DRAWABLE_SWIPE_NEUTRAL_BACKGROUND: number;
								public static AFTER_SWIPE_REACTION_DEFAULT: number;
								public static REACTION_CAN_SWIPE_BOTH_H: number;
								public static RESULT_NONE: number;
								public static REACTION_MASK_START_SWIPE_UP: number;
								public static AFTER_SWIPE_REACTION_REMOVE_ITEM: number;
								public static REACTION_CAN_NOT_SWIPE_LEFT_WITH_RUBBER_BAND_EFFECT: number;
								public static OUTSIDE_OF_THE_WINDOW_TOP: number;
								public static REACTION_CAN_NOT_SWIPE_BOTH_V_WITH_RUBBER_BAND_EFFECT: number;
								public static REACTION_MASK_START_SWIPE_LEFT: number;
								public static REACTION_CAN_SWIPE_UP: number;
								public static STATE_FLAG_IS_UPDATED: number;
								public static REACTION_MASK_START_SWIPE_RIGHT: number;
								public static DRAWABLE_SWIPE_LEFT_BACKGROUND: number;
								public static DRAWABLE_SWIPE_UP_BACKGROUND: number;
								public static OUTSIDE_OF_THE_WINDOW_LEFT: number;
								public static REACTION_CAN_SWIPE_RIGHT: number;
								public static REACTION_MASK_START_SWIPE_DOWN: number;
								public static REACTION_CAN_SWIPE_BOTH_V: number;
								public static REACTION_CAN_NOT_SWIPE_ANY: number;
								public static DRAWABLE_SWIPE_RIGHT_BACKGROUND: number;
								public static OUTSIDE_OF_THE_WINDOW_BOTTOM: number;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class SwipeableViewHolderUtils extends javalangObject {
							public static getSwipeableContainerView(param0: androidsupportv7widgetRecyclerViewViewHolder): androidviewView;
							public static getSwipeableContainerView(param0: com.h6ah4i.android.widget.advrecyclerview.swipeable.SwipeableItemViewHolder): androidviewView;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export class SwipingItemOperator extends javalangObject {
							public finish(): void;
							public update(param0: number, param1: number, param2: number): void;
							public start(): void;
							public constructor(param0: com.h6ah4i.android.widget.advrecyclerview.swipeable.RecyclerViewSwipeManager, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number, param3: boolean);
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module action {
							export abstract class SwipeResultAction extends javalangObject {
								public slideAnimationEnd(): void;
								public onSlideAnimationEnd(): void;
								public constructor(param0: number);
								public onPerformAction(): void;
								public getResultActionType(): number;
								public onCleanUp(): void;
								public performAction(): void;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module action {
							export class SwipeResultActionDefault extends com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction {
								public constructor(param0: number);
								public constructor();
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module action {
							export class SwipeResultActionDoNothing extends com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction {
								public constructor(param0: number);
								public constructor();
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module action {
							export class SwipeResultActionMoveToOrigin extends com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction {
								public constructor(param0: number);
								public constructor();
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module action {
							export abstract class SwipeResultActionMoveToSwipedDirection extends com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction {
								public constructor(param0: number);
								public constructor();
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module action {
							export abstract class SwipeResultActionRemoveItem extends com.h6ah4i.android.widget.advrecyclerview.swipeable.action.SwipeResultAction {
								public constructor(param0: number);
								public constructor();
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module annotation {
							export class SwipeableItemAfterReactions extends javalangObject implements javalangannotationAnnotation {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.swipeable.annotation.SwipeableItemAfterReactions interface with the provided implementation.
								 */
								public constructor();
								public equals(param0: javalangObject): boolean;
								public toString(): string;
								public annotationType(): javalangClass<any>;
								public hashCode(): number;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module annotation {
							export class SwipeableItemDrawableTypes extends javalangObject implements javalangannotationAnnotation {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.swipeable.annotation.SwipeableItemDrawableTypes interface with the provided implementation.
								 */
								public constructor();
								public equals(param0: javalangObject): boolean;
								public toString(): string;
								public annotationType(): javalangClass<any>;
								public hashCode(): number;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module annotation {
							export class SwipeableItemReactions extends javalangObject implements javalangannotationAnnotation {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.swipeable.annotation.SwipeableItemReactions interface with the provided implementation.
								 */
								public constructor();
								public equals(param0: javalangObject): boolean;
								public toString(): string;
								public annotationType(): javalangClass<any>;
								public hashCode(): number;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module annotation {
							export class SwipeableItemResults extends javalangObject implements javalangannotationAnnotation {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.swipeable.annotation.SwipeableItemResults interface with the provided implementation.
								 */
								public constructor();
								public equals(param0: javalangObject): boolean;
								public toString(): string;
								public annotationType(): javalangClass<any>;
								public hashCode(): number;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module swipeable {
						export module annotation {
							export class SwipeableItemStateFlags extends javalangObject implements javalangannotationAnnotation {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.swipeable.annotation.SwipeableItemStateFlags interface with the provided implementation.
								 */
								public constructor();
								public equals(param0: javalangObject): boolean;
								public toString(): string;
								public annotationType(): javalangClass<any>;
								public hashCode(): number;
							}
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module touchguard {
						export class RecyclerViewTouchActionGuardManager extends javalangObject {
							public constructor();
							public setInterceptVerticalScrollingWhileAnimationRunning(param0: boolean): void;
							public isReleased(): boolean;
							public isEnabled(): boolean;
							public release(): void;
							public setEnabled(param0: boolean): void;
							public isInterceptScrollingWhileAnimationRunning(): boolean;
							public attachRecyclerView(param0: androidsupportv7widgetRecyclerView): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export abstract class AbstractDraggableItemViewHolder extends androidsupportv7widgetRecyclerViewViewHolder implements com.h6ah4i.android.widget.advrecyclerview.draggable.DraggableItemViewHolder {
							public setDragStateFlags(param0: number): void;
							public constructor(param0: androidviewView);
							public getDragStateFlags(): number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export abstract class AbstractDraggableSwipeableItemViewHolder extends com.h6ah4i.android.widget.advrecyclerview.utils.AbstractSwipeableItemViewHolder implements com.h6ah4i.android.widget.advrecyclerview.draggable.DraggableItemViewHolder {
							public setMaxUpSwipeAmount(param0: number): void;
							public onSlideAmountUpdated(param0: number, param1: number, param2: boolean): void;
							public setSwipeResult(param0: number): void;
							public isProportionalSwipeAmountModeEnabled(): boolean;
							public setSwipeItemVerticalSlideAmount(param0: number): void;
							public getMaxRightSwipeAmount(): number;
							public setAfterSwipeReaction(param0: number): void;
							public getMaxUpSwipeAmount(): number;
							public getSwipeableContainerView(): androidviewView;
							public setMaxRightSwipeAmount(param0: number): void;
							public getDragStateFlags(): number;
							public setDragStateFlags(param0: number): void;
							public setMaxDownSwipeAmount(param0: number): void;
							public getMaxLeftSwipeAmount(): number;
							public getSwipeStateFlags(): number;
							public getSwipeItemVerticalSlideAmount(): number;
							public getSwipeResult(): number;
							public constructor(param0: androidviewView);
							public setProportionalSwipeAmountModeEnabled(param0: boolean): void;
							public setMaxLeftSwipeAmount(param0: number): void;
							public getSwipeItemHorizontalSlideAmount(): number;
							public getMaxDownSwipeAmount(): number;
							public setSwipeItemHorizontalSlideAmount(param0: number): void;
							public setSwipeStateFlags(param0: number): void;
							public getAfterSwipeReaction(): number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export abstract class AbstractExpandableItemAdapter extends androidsupportv7widgetRecyclerViewAdapter<any> implements com.h6ah4i.android.widget.advrecyclerview.expandable.ExpandableItemAdapter {
							public getItemId(param0: number): number;
							public getItemViewType(param0: number): number;
							public onBindGroupViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: javautilList<any>): void;
							public onHookGroupExpand(param0: number, param1: boolean, param2: javalangObject): boolean;
							public onBindGroupViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number): void;
							public getChildId(param0: number, param1: number): number;
							public getGroupItemViewType(param0: number): number;
							public getInitialGroupExpandedState(param0: number): boolean;
							public onHookGroupExpand(param0: number, param1: boolean): boolean;
							public getChildCount(param0: number): number;
							public onBindChildViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number): void;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: javautilList<any>): void;
							public onCreateChildViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							public onHookGroupCollapse(param0: number, param1: boolean): boolean;
							public onBindViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number): void;
							public getGroupId(param0: number): number;
							public constructor();
							public onCheckCanExpandOrCollapseGroup(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: boolean): boolean;
							public onHookGroupCollapse(param0: number, param1: boolean, param2: javalangObject): boolean;
							public onCreateViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							public getItemCount(): number;
							public getChildItemViewType(param0: number, param1: number): number;
							public onBindChildViewHolder(param0: androidsupportv7widgetRecyclerViewViewHolder, param1: number, param2: number, param3: number, param4: javautilList<any>): void;
							public onCreateGroupViewHolder(param0: androidviewViewGroup, param1: number): androidsupportv7widgetRecyclerViewViewHolder;
							public getGroupCount(): number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export abstract class AbstractExpandableItemViewHolder extends androidsupportv7widgetRecyclerViewViewHolder implements com.h6ah4i.android.widget.advrecyclerview.expandable.ExpandableItemViewHolder {
							public getExpandStateFlags(): number;
							public setExpandStateFlags(param0: number): void;
							public constructor(param0: androidviewView);
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export abstract class AbstractSwipeableItemViewHolder extends androidsupportv7widgetRecyclerViewViewHolder implements com.h6ah4i.android.widget.advrecyclerview.swipeable.SwipeableItemViewHolder {
							public setMaxDownSwipeAmount(param0: number): void;
							public setMaxUpSwipeAmount(param0: number): void;
							public getMaxLeftSwipeAmount(): number;
							public getSwipeStateFlags(): number;
							public getSwipeItemVerticalSlideAmount(): number;
							public getSwipeResult(): number;
							public onSlideAmountUpdated(param0: number, param1: number, param2: boolean): void;
							public constructor(param0: androidviewView);
							public setProportionalSwipeAmountModeEnabled(param0: boolean): void;
							public setMaxLeftSwipeAmount(param0: number): void;
							public setSwipeResult(param0: number): void;
							public getSwipeItemHorizontalSlideAmount(): number;
							public isProportionalSwipeAmountModeEnabled(): boolean;
							public setSwipeItemVerticalSlideAmount(param0: number): void;
							public getMaxRightSwipeAmount(): number;
							public getMaxDownSwipeAmount(): number;
							public setAfterSwipeReaction(param0: number): void;
							public getMaxUpSwipeAmount(): number;
							public setSwipeItemHorizontalSlideAmount(param0: number): void;
							public setSwipeStateFlags(param0: number): void;
							public getAfterSwipeReaction(): number;
							public getSwipeableContainerView(): androidviewView;
							public setMaxRightSwipeAmount(param0: number): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export class BaseWrapperAdapter extends com.h6ah4i.android.widget.advrecyclerview.adapter.SimpleWrapperAdapter {
							public constructor();
							public onBridgedAdapterItemRangeInserted(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment, param1: number): number;
							public onBridgedAdapterItemRangeRemoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onBridgedAdapterRangeMoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: number): void;
							public constructor(param0: androidsupportv7widgetRecyclerViewAdapter<any>);
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public onBridgedAdapterChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject): void;
							public unwrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.UnwrapPositionResult, param1: number): void;
							public getWrappedAdapters(param0: javautilList<any>): void;
							public release(): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: javalangObject): void;
						}
					}
				}
			}
		}
	}
}

import androidsupportv7widgetRecyclerViewLayoutManager = androidx.recyclerview.widget.RecyclerView.LayoutManager;
declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export class CustomRecyclerViewUtils extends javalangObject {
							public static ORIENTATION_UNKNOWN: number;
							public static ORIENTATION_HORIZONTAL: number;
							public static ORIENTATION_VERTICAL: number;
							public static LAYOUT_TYPE_UNKNOWN: number;
							public static LAYOUT_TYPE_LINEAR_HORIZONTAL: number;
							public static LAYOUT_TYPE_LINEAR_VERTICAL: number;
							public static LAYOUT_TYPE_GRID_HORIZONTAL: number;
							public static LAYOUT_TYPE_GRID_VERTICAL: number;
							public static LAYOUT_TYPE_STAGGERED_GRID_HORIZONTAL: number;
							public static LAYOUT_TYPE_STAGGERED_GRID_VERTICAL: number;
							public static INVALID_SPAN_ID: number;
							public static INVALID_SPAN_COUNT: number;
							public static getLayoutType(param0: androidsupportv7widgetRecyclerView): number;
							public static extractOrientation(param0: number): number;
							public static getLayoutMargins(param0: androidviewView, param1: androidgraphicsRect): androidgraphicsRect;
							public static isFullSpan(param0: androidsupportv7widgetRecyclerViewViewHolder): boolean;
							public static safeGetLayoutPosition(param0: androidsupportv7widgetRecyclerViewViewHolder): number;
							public static getDecorationOffsets(param0: androidsupportv7widgetRecyclerViewLayoutManager, param1: androidviewView, param2: androidgraphicsRect): androidgraphicsRect;
							public static getOrientation(param0: androidsupportv7widgetRecyclerView): number;
							public static findChildViewHolderUnderWithTranslation(param0: androidsupportv7widgetRecyclerView, param1: number, param2: number): androidsupportv7widgetRecyclerViewViewHolder;
							public static findViewByPosition(param0: androidsupportv7widgetRecyclerViewLayoutManager, param1: number): androidviewView;
							public static getViewBounds(param0: androidviewView, param1: androidgraphicsRect): androidgraphicsRect;
							public static safeGetAdapterPosition(param0: androidsupportv7widgetRecyclerViewViewHolder): number;
							public static findChildViewHolderUnderWithoutTranslation(param0: androidsupportv7widgetRecyclerView, param1: number, param2: number): androidsupportv7widgetRecyclerViewViewHolder;
							public static findLastVisibleItemPosition(param0: androidsupportv7widgetRecyclerView, param1: boolean): number;
							public static findLastCompletelyVisibleItemPosition(param0: androidsupportv7widgetRecyclerView): number;
							public constructor();
							public static getSynchronizedPosition(param0: androidsupportv7widgetRecyclerViewViewHolder): number;
							public static isStaggeredGridLayout(param0: number): boolean;
							public static getSpanIndex(param0: androidsupportv7widgetRecyclerViewViewHolder): number;
							public static getOrientation(param0: androidsupportv7widgetRecyclerViewLayoutManager): number;
							public static getLayoutType(param0: androidsupportv7widgetRecyclerViewLayoutManager): number;
							public static isLinearLayout(param0: number): boolean;
							public static isGridLayout(param0: number): boolean;
							public static getSpanSize(param0: androidsupportv7widgetRecyclerViewViewHolder): number;
							public static getSpanCount(param0: androidsupportv7widgetRecyclerView): number;
							public static findFirstVisibleItemPosition(param0: androidsupportv7widgetRecyclerView, param1: boolean): number;
							public static findFirstCompletelyVisibleItemPosition(param0: androidsupportv7widgetRecyclerView): number;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export class DebugWrapperAdapter extends com.h6ah4i.android.widget.advrecyclerview.adapter.SimpleWrapperAdapter {
							public static FLAG_VERIFY_WRAP_POSITION: number;
							public static FLAG_VERIFY_UNWRAP_POSITION: number;
							public static FLAGS_ALL_DEBUG_FEATURES: number;
							public constructor();
							public onBridgedAdapterItemRangeInserted(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment, param1: number): number;
							public onBridgedAdapterItemRangeRemoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public constructor(param0: androidsupportv7widgetRecyclerViewAdapter<any>);
							public onBridgedAdapterChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject): void;
							public unwrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.UnwrapPositionResult, param1: number): void;
							public getWrappedAdapters(param0: javautilList<any>): void;
							public release(): void;
							public getSettingFlags(): number;
							public onBridgedAdapterRangeMoved(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: number): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number): void;
							public setSettingFlags(param0: number): void;
							public onBridgedAdapterItemRangeChanged(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangObject, param2: number, param3: number, param4: javalangObject): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export class RecyclerViewAdapterUtils extends javalangObject {
							public static getParentViewHolderItemView(param0: androidviewView): androidviewView;
							public static getViewHolder(param0: androidviewView): androidsupportv7widgetRecyclerViewViewHolder;
							public static getParentRecyclerView(param0: androidviewView): androidsupportv7widgetRecyclerView;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export class WrappedAdapterUtils extends javalangObject {
							public static invokeOnViewRecycled(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number): void;
							public static invokeOnFailedToRecycleView(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number): boolean;
							public static invokeOnViewDetachedFromWindow(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number): void;
							public static invokeOnViewAttachedToWindow(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: androidsupportv7widgetRecyclerViewViewHolder, param2: number): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export class WrapperAdapterUtils extends javalangObject {
							public static unwrapPosition(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: androidsupportv7widgetRecyclerViewAdapter<any>, param2: javalangObject, param3: number): number;
							public static wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPath, param1: number, param2: number, param3: number): number;
							public static unwrapPosition(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: androidsupportv7widgetRecyclerViewAdapter<any>, param2: javalangObject, param3: number, param4: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPath): number;
							public static wrapPosition(param0: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPath, param1: androidsupportv7widgetRecyclerViewAdapter<any>, param2: androidsupportv7widgetRecyclerViewAdapter<any>, param3: number): number;
							public static unwrapPosition(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: number): number;
							public static findWrappedAdapter(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangClass<any>): javalangObject;
							public static findWrappedAdapter(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: javalangClass<any>, param2: number): javalangObject;
							public static unwrapPosition(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPathSegment, param2: number, param3: com.h6ah4i.android.widget.advrecyclerview.adapter.AdapterPath): number;
							public static unwrapPosition(param0: androidsupportv7widgetRecyclerViewAdapter<any>, param1: androidsupportv7widgetRecyclerViewAdapter<any>, param2: number): number;
							public static releaseAll(param0: androidsupportv7widgetRecyclerViewAdapter<any>): androidsupportv7widgetRecyclerViewAdapter<any>;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module h6ah4i {
		export module android {
			export module widget {
				export module advrecyclerview {
					export module utils {
						export module annotation {
							export class DebugWrapperAdapterSettingFlags extends javalangObject implements javalangannotationAnnotation {
								/**
								 * Constructs a new instance of the com.h6ah4i.android.widget.advrecyclerview.utils.annotation.DebugWrapperAdapterSettingFlags interface with the provided implementation.
								 */
								public constructor();
								public equals(param0: javalangObject): boolean;
								public toString(): string;
								public annotationType(): javalangClass<any>;
								public hashCode(): number;
							}
						}
					}
				}
			}
		}
	}
}