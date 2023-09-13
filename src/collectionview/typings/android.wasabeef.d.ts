/// <reference path="android-declarations.d.ts"/>

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export class BuildConfig extends java.lang.Object {
                public static class: java.lang.Class<recyclerview.BuildConfig>;
                public static DEBUG: boolean;
                public static LIBRARY_PACKAGE_NAME: string;
                public static BUILD_TYPE: string;
                public constructor();
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export class R extends java.lang.Object {
                public static class: java.lang.Class<recyclerview.R>;
            }
            export namespace R {
                export class attr extends java.lang.Object {
                    public static class: java.lang.Class<recyclerview.R.attr>;
                    public static alpha: number;
                    public static fastScrollEnabled: number;
                    public static fastScrollHorizontalThumbDrawable: number;
                    public static fastScrollHorizontalTrackDrawable: number;
                    public static fastScrollVerticalThumbDrawable: number;
                    public static fastScrollVerticalTrackDrawable: number;
                    public static font: number;
                    public static fontProviderAuthority: number;
                    public static fontProviderCerts: number;
                    public static fontProviderFetchStrategy: number;
                    public static fontProviderFetchTimeout: number;
                    public static fontProviderPackage: number;
                    public static fontProviderQuery: number;
                    public static fontStyle: number;
                    public static fontVariationSettings: number;
                    public static fontWeight: number;
                    public static layoutManager: number;
                    public static recyclerViewStyle: number;
                    public static reverseLayout: number;
                    public static spanCount: number;
                    public static stackFromEnd: number;
                    public static ttcIndex: number;
                }
                export class color extends java.lang.Object {
                    public static class: java.lang.Class<recyclerview.R.color>;
                    public static notification_action_color_filter: number;
                    public static notification_icon_bg_color: number;
                    public static ripple_material_light: number;
                    public static secondary_text_default_material_light: number;
                }
                export class dimen extends java.lang.Object {
                    public static class: java.lang.Class<recyclerview.R.dimen>;
                    public static compat_button_inset_horizontal_material: number;
                    public static compat_button_inset_vertical_material: number;
                    public static compat_button_padding_horizontal_material: number;
                    public static compat_button_padding_vertical_material: number;
                    public static compat_control_corner_material: number;
                    public static compat_notification_large_icon_max_height: number;
                    public static compat_notification_large_icon_max_width: number;
                    public static fastscroll_default_thickness: number;
                    public static fastscroll_margin: number;
                    public static fastscroll_minimum_range: number;
                    public static item_touch_helper_max_drag_scroll_per_frame: number;
                    public static item_touch_helper_swipe_escape_max_velocity: number;
                    public static item_touch_helper_swipe_escape_velocity: number;
                    public static notification_action_icon_size: number;
                    public static notification_action_text_size: number;
                    public static notification_big_circle_margin: number;
                    public static notification_content_margin_start: number;
                    public static notification_large_icon_height: number;
                    public static notification_large_icon_width: number;
                    public static notification_main_column_padding_top: number;
                    public static notification_media_narrow_margin: number;
                    public static notification_right_icon_size: number;
                    public static notification_right_side_padding_top: number;
                    public static notification_small_icon_background_padding: number;
                    public static notification_small_icon_size_as_large: number;
                    public static notification_subtext_size: number;
                    public static notification_top_pad: number;
                    public static notification_top_pad_large_text: number;
                }
                export class drawable extends java.lang.Object {
                    public static class: java.lang.Class<recyclerview.R.drawable>;
                    public static notification_action_background: number;
                    public static notification_bg: number;
                    public static notification_bg_low: number;
                    public static notification_bg_low_normal: number;
                    public static notification_bg_low_pressed: number;
                    public static notification_bg_normal: number;
                    public static notification_bg_normal_pressed: number;
                    public static notification_icon_background: number;
                    public static notification_template_icon_bg: number;
                    public static notification_template_icon_low_bg: number;
                    public static notification_tile_bg: number;
                    public static notify_panel_notification_icon_bg: number;
                }
                export class integer extends java.lang.Object {
                    public static class: java.lang.Class<recyclerview.R.integer>;
                    public static status_bar_notification_info_maxnum: number;
                }
                export class layout extends java.lang.Object {
                    public static class: java.lang.Class<recyclerview.R.layout>;
                    public static custom_dialog: number;
                    public static notification_action: number;
                    public static notification_action_tombstone: number;
                    public static notification_template_custom_big: number;
                    public static notification_template_icon_group: number;
                    public static notification_template_part_chronometer: number;
                    public static notification_template_part_time: number;
                }
                export class style extends java.lang.Object {
                    public static class: java.lang.Class<recyclerview.R.style>;
                    public static TextAppearance_Compat_Notification: number;
                    public static TextAppearance_Compat_Notification_Info: number;
                    public static TextAppearance_Compat_Notification_Line2: number;
                    public static TextAppearance_Compat_Notification_Time: number;
                    public static TextAppearance_Compat_Notification_Title: number;
                    public static Widget_Compat_NotificationActionContainer: number;
                    public static Widget_Compat_NotificationActionText: number;
                }
                export class styleable extends java.lang.Object {
                    public static class: java.lang.Class<recyclerview.R.styleable>;
                    public static ColorStateListItem: androidNative.Array<number>;
                    public static ColorStateListItem_alpha: number;
                    public static ColorStateListItem_android_alpha: number;
                    public static ColorStateListItem_android_color: number;
                    public static FontFamily: androidNative.Array<number>;
                    public static FontFamily_fontProviderAuthority: number;
                    public static FontFamily_fontProviderCerts: number;
                    public static FontFamily_fontProviderFetchStrategy: number;
                    public static FontFamily_fontProviderFetchTimeout: number;
                    public static FontFamily_fontProviderPackage: number;
                    public static FontFamily_fontProviderQuery: number;
                    public static FontFamilyFont: androidNative.Array<number>;
                    public static FontFamilyFont_android_font: number;
                    public static FontFamilyFont_android_fontStyle: number;
                    public static FontFamilyFont_android_fontVariationSettings: number;
                    public static FontFamilyFont_android_fontWeight: number;
                    public static FontFamilyFont_android_ttcIndex: number;
                    public static FontFamilyFont_font: number;
                    public static FontFamilyFont_fontStyle: number;
                    public static FontFamilyFont_fontVariationSettings: number;
                    public static FontFamilyFont_fontWeight: number;
                    public static FontFamilyFont_ttcIndex: number;
                    public static GradientColor: androidNative.Array<number>;
                    public static GradientColor_android_centerColor: number;
                    public static GradientColor_android_centerX: number;
                    public static GradientColor_android_centerY: number;
                    public static GradientColor_android_endColor: number;
                    public static GradientColor_android_endX: number;
                    public static GradientColor_android_endY: number;
                    public static GradientColor_android_gradientRadius: number;
                    public static GradientColor_android_startColor: number;
                    public static GradientColor_android_startX: number;
                    public static GradientColor_android_startY: number;
                    public static GradientColor_android_tileMode: number;
                    public static GradientColor_android_type: number;
                    public static GradientColorItem: androidNative.Array<number>;
                    public static GradientColorItem_android_color: number;
                    public static GradientColorItem_android_offset: number;
                    public static RecyclerView: androidNative.Array<number>;
                    public static RecyclerView_android_clipToPadding: number;
                    public static RecyclerView_android_descendantFocusability: number;
                    public static RecyclerView_android_orientation: number;
                    public static RecyclerView_fastScrollEnabled: number;
                    public static RecyclerView_fastScrollHorizontalThumbDrawable: number;
                    public static RecyclerView_fastScrollHorizontalTrackDrawable: number;
                    public static RecyclerView_fastScrollVerticalThumbDrawable: number;
                    public static RecyclerView_fastScrollVerticalTrackDrawable: number;
                    public static RecyclerView_layoutManager: number;
                    public static RecyclerView_reverseLayout: number;
                    public static RecyclerView_spanCount: number;
                    public static RecyclerView_stackFromEnd: number;
                    public static<clinit>(): void;
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace adapters {
                export class AlphaInAnimationAdapter extends AnimationAdapter {
                    public static class: java.lang.Class<adapters.AlphaInAnimationAdapter>;
                    public getAnimators(param0: globalAndroid.view.View): androidNative.Array<globalAndroid.animation.Animator>;
                    public constructor(param0: androidx.recyclerview.widget.RecyclerView.Adapter<any>);
                    public constructor(param0: androidx.recyclerview.widget.RecyclerView.Adapter<any>, param1: number);
                    public constructor();
                }
                export namespace AlphaInAnimationAdapter {
                    export class Companion extends java.lang.Object {
                        public static class: java.lang.Class<adapters.AlphaInAnimationAdapter.Companion>;
                    }
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace adapters {
                export abstract class AnimationAdapter extends androidx.recyclerview.widget.RecyclerView.Adapter<androidx.recyclerview.widget.RecyclerView.ViewHolder> {
                    public static class: java.lang.Class<adapters.AnimationAdapter>;
                    public getWrappedAdapter(): androidx.recyclerview.widget.RecyclerView.Adapter<androidx.recyclerview.widget.RecyclerView.ViewHolder>;
                    public constructor(param0: androidx.recyclerview.widget.RecyclerView.Adapter<any>);
                    public setHasStableIds(param0: boolean): void;
                    public setAdapter(param0: androidx.recyclerview.widget.RecyclerView.Adapter<androidx.recyclerview.widget.RecyclerView.ViewHolder>): void;
                    public registerAdapterDataObserver(param0: androidx.recyclerview.widget.RecyclerView.AdapterDataObserver): void;
                    public setStartPosition(param0: number): void;
                    public onCreateViewHolder(param0: globalAndroid.view.ViewGroup, param1: number): any;
                    public onViewDetachedFromWindow(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor();
                    public onViewDetachedFromWindow(param0: any): void;
                    public getItemViewType(param0: number): number;
                    public onViewRecycled(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public getAnimators(param0: globalAndroid.view.View): androidNative.Array<globalAndroid.animation.Animator>;
                    public unregisterAdapterDataObserver(param0: androidx.recyclerview.widget.RecyclerView.AdapterDataObserver): void;
                    public onViewAttachedToWindow(param0: any): void;
                    public onViewAttachedToWindow(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public onDetachedFromRecyclerView(param0: androidx.recyclerview.widget.RecyclerView): void;
                    public setDuration(param0: number): void;
                    public onBindViewHolder(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder, param1: number): void;
                    public onViewRecycled(param0: any): void;
                    public onBindViewHolder(param0: any, param1: number): void;
                    public setInterpolator(param0: globalAndroid.view.animation.Interpolator): void;
                    public getAdapter(): androidx.recyclerview.widget.RecyclerView.Adapter<androidx.recyclerview.widget.RecyclerView.ViewHolder>;
                    public onCreateViewHolder(param0: globalAndroid.view.ViewGroup, param1: number): androidx.recyclerview.widget.RecyclerView.ViewHolder;
                    public getItemCount(): number;
                    public onBindViewHolder(param0: any, param1: number, param2: java.util.List<any>): void;
                    public onAttachedToRecyclerView(param0: androidx.recyclerview.widget.RecyclerView): void;
                    public setFirstOnly(param0: boolean): void;
                    public getItemId(param0: number): number;
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace adapters {
                export class ScaleInAnimationAdapter extends AnimationAdapter {
                    public static class: java.lang.Class<adapters.ScaleInAnimationAdapter>;
                    public getAnimators(param0: globalAndroid.view.View): androidNative.Array<globalAndroid.animation.Animator>;
                    public constructor(param0: androidx.recyclerview.widget.RecyclerView.Adapter<any>);
                    public constructor(param0: androidx.recyclerview.widget.RecyclerView.Adapter<any>, param1: number);
                    public constructor();
                }
                export namespace ScaleInAnimationAdapter {
                    export class Companion extends java.lang.Object {
                        public static class: java.lang.Class<adapters.ScaleInAnimationAdapter.Companion>;
                    }
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace adapters {
                export class SlideInBottomAnimationAdapter extends AnimationAdapter {
                    public static class: java.lang.Class<adapters.SlideInBottomAnimationAdapter>;
                    public getAnimators(param0: globalAndroid.view.View): androidNative.Array<globalAndroid.animation.Animator>;
                    public constructor(param0: androidx.recyclerview.widget.RecyclerView.Adapter<any>);
                    public constructor();
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace adapters {
                export class SlideInLeftAnimationAdapter extends AnimationAdapter {
                    public static class: java.lang.Class<adapters.SlideInLeftAnimationAdapter>;
                    public getAnimators(param0: globalAndroid.view.View): androidNative.Array<globalAndroid.animation.Animator>;
                    public constructor(param0: androidx.recyclerview.widget.RecyclerView.Adapter<any>);
                    public constructor();
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace adapters {
                export class SlideInRightAnimationAdapter extends AnimationAdapter {
                    public static class: java.lang.Class<adapters.SlideInRightAnimationAdapter>;
                    public getAnimators(param0: globalAndroid.view.View): androidNative.Array<globalAndroid.animation.Animator>;
                    public constructor(param0: androidx.recyclerview.widget.RecyclerView.Adapter<any>);
                    public constructor();
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export abstract class BaseItemAnimator extends androidx.recyclerview.widget.SimpleItemAnimator {
                    public static class: java.lang.Class<animators.BaseItemAnimator>;
                    public getInterpolator(): globalAndroid.view.animation.Interpolator;
                    public setAddAnimations(param0: java.util.ArrayList<androidx.recyclerview.widget.RecyclerView.ViewHolder>): void;
                    public endAnimation(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public endAnimations(): void;
                    public animateRemove(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): boolean;
                    public isRunning(param0: androidx.recyclerview.widget.RecyclerView.ItemAnimator.ItemAnimatorFinishedListener): boolean;
                    public runPendingAnimations(): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public getAddAnimations(): java.util.ArrayList<androidx.recyclerview.widget.RecyclerView.ViewHolder>;
                    public getRemoveDelay(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): number;
                    public animateAdd(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): boolean;
                    public setInterpolator(param0: globalAndroid.view.animation.Interpolator): void;
                    public preAnimateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor();
                    public animateMove(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder, param1: number, param2: number, param3: number, param4: number): boolean;
                    public isRunning(): boolean;
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public getAddDelay(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): number;
                    public animateChange(
                        param0: androidx.recyclerview.widget.RecyclerView.ViewHolder,
                        param1: androidx.recyclerview.widget.RecyclerView.ViewHolder,
                        param2: number,
                        param3: number,
                        param4: number,
                        param5: number
                    ): boolean;
                    public getRemoveAnimations(): java.util.ArrayList<androidx.recyclerview.widget.RecyclerView.ViewHolder>;
                    public setRemoveAnimations(param0: java.util.ArrayList<androidx.recyclerview.widget.RecyclerView.ViewHolder>): void;
                    public animateChange(
                        param0: androidx.recyclerview.widget.RecyclerView.ViewHolder,
                        param1: androidx.recyclerview.widget.RecyclerView.ViewHolder,
                        param2: androidx.recyclerview.widget.RecyclerView.ItemAnimator.ItemHolderInfo,
                        param3: androidx.recyclerview.widget.RecyclerView.ItemAnimator.ItemHolderInfo
                    ): boolean;
                }
                export namespace BaseItemAnimator {
                    export class AnimatorListenerAdapter extends java.lang.Object implements globalAndroid.animation.Animator.AnimatorListener {
                        public static class: java.lang.Class<animators.BaseItemAnimator.AnimatorListenerAdapter>;
                        public onAnimationEnd(param0: globalAndroid.animation.Animator): void;
                        public constructor();
                        public onAnimationRepeat(param0: globalAndroid.animation.Animator): void;
                        public onAnimationStart(param0: globalAndroid.animation.Animator): void;
                        public onAnimationCancel(param0: globalAndroid.animation.Animator): void;
                        public onAnimationStart(param0: globalAndroid.animation.Animator, param1: boolean): void;
                        public onAnimationEnd(param0: globalAndroid.animation.Animator, param1: boolean): void;
                    }
                    export class ChangeInfo extends java.lang.Object {
                        public static class: java.lang.Class<animators.BaseItemAnimator.ChangeInfo>;
                        public getToY(): number;
                        public setNewHolder(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                        public getNewHolder(): androidx.recyclerview.widget.RecyclerView.ViewHolder;
                        public constructor(
                            param0: androidx.recyclerview.widget.RecyclerView.ViewHolder,
                            param1: androidx.recyclerview.widget.RecyclerView.ViewHolder,
                            param2: number,
                            param3: number,
                            param4: number,
                            param5: number
                        );
                        public getFromX(): number;
                        public toString(): string;
                        public getFromY(): number;
                        public getToX(): number;
                        public setFromY(param0: number): void;
                        public setFromX(param0: number): void;
                        public getOldHolder(): androidx.recyclerview.widget.RecyclerView.ViewHolder;
                        public setToY(param0: number): void;
                        public setOldHolder(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                        public setToX(param0: number): void;
                    }
                    export class Companion extends java.lang.Object {
                        public static class: java.lang.Class<animators.BaseItemAnimator.Companion>;
                    }
                    export class DefaultAddAnimatorListener extends animators.BaseItemAnimator.AnimatorListenerAdapter {
                        public static class: java.lang.Class<animators.BaseItemAnimator.DefaultAddAnimatorListener>;
                        public onAnimationEnd(param0: globalAndroid.animation.Animator): void;
                        public constructor();
                        public onAnimationRepeat(param0: globalAndroid.animation.Animator): void;
                        public constructor(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder);
                        public setViewHolder(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                        public getViewHolder(): androidx.recyclerview.widget.RecyclerView.ViewHolder;
                        public onAnimationStart(param0: globalAndroid.animation.Animator): void;
                        public onAnimationCancel(param0: globalAndroid.animation.Animator): void;
                        public onAnimationStart(param0: globalAndroid.animation.Animator, param1: boolean): void;
                        public onAnimationEnd(param0: globalAndroid.animation.Animator, param1: boolean): void;
                    }
                    export class DefaultRemoveAnimatorListener extends animators.BaseItemAnimator.AnimatorListenerAdapter {
                        public static class: java.lang.Class<animators.BaseItemAnimator.DefaultRemoveAnimatorListener>;
                        public onAnimationEnd(param0: globalAndroid.animation.Animator): void;
                        public constructor();
                        public onAnimationRepeat(param0: globalAndroid.animation.Animator): void;
                        public constructor(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder);
                        public setViewHolder(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                        public getViewHolder(): androidx.recyclerview.widget.RecyclerView.ViewHolder;
                        public onAnimationStart(param0: globalAndroid.animation.Animator): void;
                        public onAnimationCancel(param0: globalAndroid.animation.Animator): void;
                        public onAnimationStart(param0: globalAndroid.animation.Animator, param1: boolean): void;
                        public onAnimationEnd(param0: globalAndroid.animation.Animator, param1: boolean): void;
                    }
                    export class MoveInfo extends java.lang.Object {
                        public static class: java.lang.Class<animators.BaseItemAnimator.MoveInfo>;
                        public getHolder(): androidx.recyclerview.widget.RecyclerView.ViewHolder;
                        public getFromY(): number;
                        public getToX(): number;
                        public getToY(): number;
                        public setHolder(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                        public setFromY(param0: number): void;
                        public setFromX(param0: number): void;
                        public getFromX(): number;
                        public constructor(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder, param1: number, param2: number, param3: number, param4: number);
                        public setToY(param0: number): void;
                        public setToX(param0: number): void;
                    }
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class FadeInAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.FadeInAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class FadeInDownAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.FadeInDownAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class FadeInLeftAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.FadeInLeftAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class FadeInRightAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.FadeInRightAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class FadeInUpAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.FadeInUpAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class FlipInBottomXAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.FlipInBottomXAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class FlipInLeftYAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.FlipInLeftYAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class FlipInRightYAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.FlipInRightYAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class FlipInTopXAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.FlipInTopXAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class LandingAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.LandingAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class OvershootInLeftAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.OvershootInLeftAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: number);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class OvershootInRightAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.OvershootInRightAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: number);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class ScaleInAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.ScaleInAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class ScaleInBottomAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.ScaleInBottomAnimator>;
                    public preAnimateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class ScaleInLeftAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.ScaleInLeftAnimator>;
                    public preAnimateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class ScaleInRightAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.ScaleInRightAnimator>;
                    public preAnimateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class ScaleInTopAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.ScaleInTopAnimator>;
                    public preAnimateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class SlideInDownAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.SlideInDownAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class SlideInLeftAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.SlideInLeftAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class SlideInRightAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.SlideInRightAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export class SlideInUpAnimator extends BaseItemAnimator {
                    public static class: java.lang.Class<animators.SlideInUpAnimator>;
                    public constructor();
                    public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    public constructor(param0: globalAndroid.view.animation.Interpolator);
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace animators {
                export namespace holder {
                    export class AnimateViewHolder extends java.lang.Object {
                        public static class: java.lang.Class<holder.AnimateViewHolder>;
                        /**
                         * Constructs a new instance of the jp.wasabeef.recyclerview.animators.holder.AnimateViewHolder interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
                         */
                        public constructor(implementation: {
                            preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                            preAnimateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                            animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder, param1: globalAndroid.animation.Animator.AnimatorListener): void;
                            animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder, param1: globalAndroid.animation.Animator.AnimatorListener): void;
                        });
                        public constructor();
                        public animateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder, param1: globalAndroid.animation.Animator.AnimatorListener): void;
                        public animateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder, param1: globalAndroid.animation.Animator.AnimatorListener): void;
                        public preAnimateRemoveImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                        public preAnimateAddImpl(param0: androidx.recyclerview.widget.RecyclerView.ViewHolder): void;
                    }
                }
            }
        }
    }
}

declare namespace jp {
    export namespace wasabeef {
        export namespace recyclerview {
            export namespace internal {
                export class ViewHelper extends java.lang.Object {
                    public static class: java.lang.Class<internal.ViewHelper>;
                    public static INSTANCE: internal.ViewHelper;
                    public static clear(param0: globalAndroid.view.View): void;
                }
            }
        }
    }
}

//Generics information:
