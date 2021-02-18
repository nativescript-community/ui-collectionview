import * as React from 'react';
import { ItemEventData, ItemsSource, Length, PercentLength, View } from '@nativescript/core';
import { NSVElement, NativeScriptProps, ViewAttributes } from 'react-nativescript';
import { CollectionView as NativeScriptCollectionView } from '../collectionview';
export declare type CellViewContainer = View;
declare type CellFactory = (item: any) => React.ReactElement;
export declare function registerCollectionView(): void;
interface CollectionViewAttributes extends ViewAttributes {
    colWidth?: PercentLength | string;
    horizontalSpacing?: Length | string;
    isBounceEnabled?: boolean;
    isItemsSourceIn?: boolean;
    isScrollEnabled?: boolean;
    itemViewLoader?: any;
    items?: any[] | ItemsSource;
    itemTemplateSelector?: string | ((item: any, index: number, items: any) => string);
    layoutStyle?: string;
    loadMoreThreshold?: number;
    onItemsChangedInternal?: (oldValue: any, newValue: any) => void;
    onItemLoading?: (args: ItemEventData) => void;
    onSpanSizeChangedInternal?: (oldValue: any, newValue: any) => void;
    orientation?: 'horizontal' | 'vertical';
    plugins?: string[];
    reverseLayout?: boolean;
    rowHeight?: PercentLength | string;
    spanSize?: (position: number) => number;
    verticalSpacing?: Length | string;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            collectionView: NativeScriptProps<CollectionViewAttributes, NativeScriptCollectionView>;
        }
    }
}
declare type OwnProps = {
    items: ItemsSource | any[];
    cellFactory?: CellFactory;
    cellFactories?: Map<string, {
        placeholderItem: any;
        cellFactory: CellFactory;
    }>;
    _debug?: {
        logLevel: 'debug' | 'info';
        onCellFirstLoad?: (container: CellViewContainer) => void;
        onCellRecycle?: (container: CellViewContainer) => void;
    };
} & Omit<CollectionViewAttributes, 'onItemLoading'>;
declare type Props = OwnProps & {
    forwardedRef?: React.RefObject<NSVElement<NativeScriptCollectionView>>;
};
declare type NumberKey = number | string;
interface State {
    nativeCells: Record<NumberKey, CellViewContainer>;
    nativeCellToItemIndex: Map<CellViewContainer, NumberKey>;
    itemIndexToNativeCell?: Map<NumberKey, CellViewContainer>;
}
export declare class _CollectionView extends React.Component<Props, State> {
    static readonly defaultProps: {
        _debug: {
            logLevel: "info";
            onCellFirstLoad: any;
            onCellRecycle: any;
        };
    };
    constructor(props: Props);
    private readonly myRef;
    private readonly argsViewToRootKeyAndRef;
    private roots;
    private readonly defaultOnItemLoading;
    protected getNativeView(): NativeScriptCollectionView | null;
    private readonly renderNewRoot;
    componentDidMount(): void;
    componentWillUnmount(): void;
    static isItemsSource(arr: any[] | ItemsSource): arr is ItemsSource;
    render(): JSX.Element;
}
export declare const CollectionView: React.ForwardRefExoticComponent<{
    items: ItemsSource | any[];
    cellFactory?: CellFactory;
    cellFactories?: Map<string, {
        placeholderItem: any;
        cellFactory: CellFactory;
    }>;
    _debug?: {
        logLevel: 'debug' | 'info';
        onCellFirstLoad?: (container: CellViewContainer) => void;
        onCellRecycle?: (container: CellViewContainer) => void;
    };
} & Pick<CollectionViewAttributes, "itemTemplateSelector" | "left" | "top" | "rowHeight" | "colWidth" | "orientation" | "items" | "spanSize" | "isScrollEnabled" | "isBounceEnabled" | "reverseLayout" | "loadMoreThreshold" | "isLayoutRequired" | "horizontalSpacing" | "isItemsSourceIn" | "itemViewLoader" | "layoutStyle" | "onItemsChangedInternal" | "onSpanSizeChangedInternal" | "plugins" | "verticalSpacing" | "onPropertyChange" | "alignSelf" | "android" | "automationText" | "bindingContext" | "className" | "col" | "colSpan" | "column" | "columnSpan" | "cssClasses" | "cssPseudoClasses" | "dock" | "domNode" | "effectiveBorderBottomWidth" | "effectiveBorderLeftWidth" | "effectiveBorderRightWidth" | "effectiveBorderTopWidth" | "effectiveHeight" | "effectiveLeft" | "effectiveMarginBottom" | "effectiveMarginLeft" | "effectiveMarginRight" | "effectiveMarginTop" | "effectiveMinHeight" | "effectiveMinWidth" | "effectivePaddingBottom" | "effectivePaddingLeft" | "effectivePaddingRight" | "effectivePaddingTop" | "effectiveTop" | "effectiveWidth" | "flexGrow" | "flexShrink" | "flexWrapBefore" | "id" | "ios" | "iosOverflowSafeArea" | "iosOverflowSafeAreaEnabled" | "isCollapsed" | "isEnabled" | "isLoaded" | "isUserInteractionEnabled" | "nativeView" | "onAutomationTextChange" | "onBindingContextChange" | "onClassNameChange" | "onIdChange" | "onIosOverflowSafeAreaChange" | "onIosOverflowSafeAreaEnabledChange" | "onIsEnabledChange" | "onIsUserInteractionEnabledChange" | "onOriginXChange" | "onOriginYChange" | "order" | "originX" | "originY" | "page" | "parent" | "parentNode" | "recycleNativeView" | "row" | "rowSpan" | "typeName" | "viewController" | "androidDynamicElevationOffset" | "androidElevation" | "background" | "backgroundColor" | "backgroundImage" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "borderBottomColor" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomWidth" | "borderColor" | "borderLeftColor" | "borderLeftWidth" | "borderRadius" | "borderRightColor" | "borderRightWidth" | "borderTopColor" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopWidth" | "borderWidth" | "color" | "css" | "cssType" | "height" | "horizontalAlignment" | "isLayoutValid" | "margin" | "marginBottom" | "marginLeft" | "marginRight" | "marginTop" | "minHeight" | "minWidth" | "modal" | "onAndroidBackPressed" | "onColumnChange" | "onColumnSpanChange" | "onDockChange" | "onDoubleTap" | "onLeftChange" | "onLoaded" | "onLongPress" | "onPan" | "onPinch" | "onRotation" | "onRowChange" | "onRowSpanChange" | "onShowingModally" | "onShownModally" | "onLayoutChanged" | "onSwipe" | "onTap" | "onTopChange" | "onTouch" | "onUnloaded" | "opacity" | "perspective" | "rotate" | "rotateX" | "rotateY" | "scaleX" | "scaleY" | "textTransform" | "translateX" | "translateY" | "verticalAlignment" | "visibility" | "width"> & React.RefAttributes<NSVElement<NativeScriptCollectionView>>>;
export {};
