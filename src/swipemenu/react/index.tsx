import * as React from 'react';
import { GridLayoutAttributes, NSVElement, NativeScriptProps, registerElement } from 'react-nativescript';
import { Color, View } from '@nativescript/core';
import { SwipeMenu as NativeScriptSwipeMenu, Side } from '..';

export function registerSwipeMenu() {
    registerElement('swipemenu', () => require('../').SwipeMenu);
}

interface SwipeMenuAttributes extends GridLayoutAttributes {
    backdropColor?: Color;
    gestureEnabled?: boolean;
    leftSwipeMenu?: View;
    mainContent?: View;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            swipemenu: NativeScriptProps<SwipeMenuAttributes, NativeScriptSwipeMenu>;
        }
    }
}

export const SwipeMenu = React.forwardRef<NSVElement<NativeScriptSwipeMenu>, NativeScriptProps<SwipeMenuAttributes, NativeScriptSwipeMenu>>((props, ref) => <swipemenu {...props} ref={ref} />);
