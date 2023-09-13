import { Screen, SharedTransitionConfig, Utils, View, isAndroid } from '@nativescript/core';
import { isNumber } from '@nativescript/core/utils/types';
import { AnimateOptions } from './types';

export const configHomeSharedTransition: SharedTransitionConfig = {
    interactive: {
        dismiss: {
            finishThreshold: 0.5
        }
    },
    pageStart: {
        opacity: 1,
        x: 0,
        y: isAndroid ? Screen.mainScreen.heightPixels : undefined
    },
    pageEnd: {
        spring: { tension: 70, friction: 9, mass: 1 }
    },
    pageReturn: {
        opacity: 1,
        spring: { tension: 70, friction: 9, mass: 2 }
    }
};

export const animateView = (view: View, options: AnimateOptions) => {
    if (__ANDROID__) {
        animateAndroid(view, options);
    } else {
        animateIOS(view, options);
    }
};

function animateAndroid(view: View, animation: AnimateOptions) {
    // if ((global as any).isAppRunInPreview) {
    //     view.animate({
    //         translate: { x: animation.translate?.x ?? view.translateX, y: animation.translate?.y ?? view.translateY },
    //         rotate: animation.rotation ?? view.rotate,
    //         opacity: animation.alpha ?? view.opacity,
    //         curve: CoreTypes.AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1),
    //         duration: 250
    //     });
    // } else {
    if (isNumber(animation.translate?.x)) {
        const springAnim = new androidx.dynamicanimation.animation.SpringAnimation(
            view.android,
            androidx.dynamicanimation.animation.DynamicAnimation.TRANSLATION_X,
            Utils.layout.toDevicePixels(animation.translate?.x)
        );
        springAnim.getSpring().setStiffness(150);
        springAnim.getSpring().setDampingRatio(0.6);
        springAnim.start();
    }
    if (isNumber(animation.translate?.y)) {
        const springAnim = new androidx.dynamicanimation.animation.SpringAnimation(
            view.android,
            androidx.dynamicanimation.animation.DynamicAnimation.TRANSLATION_Y,
            Utils.layout.toDevicePixels(animation.translate?.y)
        );
        springAnim.getSpring().setStiffness(150);
        springAnim.getSpring().setDampingRatio(0.6);
        springAnim.start();
    }
    if (isNumber(animation.rotation)) {
        const springAnim = new androidx.dynamicanimation.animation.SpringAnimation(view.android, androidx.dynamicanimation.animation.DynamicAnimation.ROTATION, animation.rotation);
        springAnim.getSpring().setStiffness(150);
        springAnim.start();
    }
    if (isNumber(animation.alpha)) {
        const springAnim = new androidx.dynamicanimation.animation.SpringAnimation(view.android, androidx.dynamicanimation.animation.DynamicAnimation.ALPHA, animation.alpha);
        springAnim.getSpring().setStiffness(150);
        springAnim.start();
    }
    // }
}

function animateIOS(view: View, animation: AnimateOptions) {
    Utils.ios.animateWithSpring({
        animations: () => {
            const uiView = view.ios as UIView;
            if (isNumber(animation.translate?.x) || isNumber(animation.translate?.y)) {
                uiView.transform = CGAffineTransformMakeTranslation(getNumber(animation.translate?.x, view.translateX), getNumber(animation.translate?.y, view.translateY));
            }
            if (animation.rotation || animation.rotation === 0) {
                uiView.transform = CGAffineTransformMakeRotation((animation.rotation * 3.1416) / 180);
            }
            if (animation.alpha || animation.alpha === 0) {
                uiView.layer.opacity = animation.alpha;
            }
        }
    });
}

const getNumber = (number: number | undefined, defaultValue: number) => (number || number === 0 ? number : defaultValue);
