import * as React from 'react';
import { ItemEventData, ItemsSource, KeyedTemplate, Length, PercentLength, View } from '@nativescript/core';
import { NSVElement, NSVRoot, NativeScriptProps, render as RNSRender, ViewAttributes, registerElement, unmountComponentAtNode } from 'react-nativescript';
import { CollectionView as NativeScriptCollectionView } from '../collectionview';

export type CellViewContainer = View;
type CellFactory = (item: any) => React.ReactElement;


export function registerCollectionView() {
    registerElement('collectionView', () => require('../collectionview').CollectionView);
}

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
};

declare global {
    namespace JSX {
        interface IntrinsicElements {
            collectionView: NativeScriptProps<CollectionViewAttributes, NativeScriptCollectionView>;
        }
    }
}

type OwnProps = {
    items: ItemsSource | any[];
    /** User may specify cellFactory for single-template or cellFactories for multi-template. */
    cellFactory?: CellFactory;
    cellFactories?: Map<string, { placeholderItem: any; cellFactory: CellFactory }>;
    /** For now, we don't support custom onItemLoading event handlers. */
    // onItemLoading?: (args: ItemEventData) => void,
    // onItemTap?: (args: ItemEventData) => void;
    /**
     * The event will be raised when the CollectionView is scrolled so that the last item is visible.
     * This event is intended to be used to add additional data in the CollectionView.
     */
    // onLoadMoreItems?: (args: ItemEventData) => void;
    _debug?: {
        logLevel: 'debug' | 'info';
        onCellFirstLoad?: (container: CellViewContainer) => void;
        onCellRecycle?: (container: CellViewContainer) => void;
    };
} & Omit<CollectionViewAttributes, 'onItemLoading'>;
type Props = OwnProps & { forwardedRef?: React.RefObject<NSVElement<NativeScriptCollectionView>> };

type NumberKey = number | string;
interface RootKeyAndTNSView { rootKey: string; nativeView: View }

interface State {
    nativeCells: Record<NumberKey, CellViewContainer>;
    /* Native cells may be rotated e.g. what once displayed items[0] may now need to display items[38] */
    nativeCellToItemIndex: Map<CellViewContainer, NumberKey>;
    itemIndexToNativeCell?: Map<NumberKey, CellViewContainer>;
}

/**
 * A React wrapper around the NativeScript CollectionView component.
 * @see https://docs.nativescript.org/ui/ns-ui-widgets/list-view
 * @module ui/list-view/list-view
 */
export class _CollectionView extends React.Component<Props, State> {
    static readonly defaultProps = {
        _debug: {
            logLevel: 'info' as 'info',
            onCellFirstLoad: undefined,
            onCellRecycle: undefined,
        },
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            nativeCells: {},
            nativeCellToItemIndex: new Map(),
            itemIndexToNativeCell: props._debug.logLevel === 'debug' ? new Map() : undefined,
        };
    }

    private readonly myRef = React.createRef<NSVElement<NativeScriptCollectionView>>();
    private readonly argsViewToRootKeyAndRef: Map<View, RootKeyAndTNSView> = new Map();
    private roots: Set<string> = new Set();

    /**
     * CollectionView code-behind:
     * @see https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/list-view/code-behind/code-behind-ts-page.ts
     * CollectionView item templates:
     * @see https://medium.com/@alexander.vakrilov/faster-nativescript-CollectionView-with-multiple-item-templates-8f903a32e48f
     * Cell state in CollectionView:
     * @see https://medium.com/@alexander.vakrilov/managing-component-state-in-nativescript-CollectionView-b139e45d899b
     * @see https://github.com/NativeScript/nativescript-angular/issues/1245#issuecomment-393465035
     * loadMoreItems:
     * @see https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/list-view/events/events-ts-page.ts
     */
    private readonly defaultOnItemLoading: (args: ItemEventData) => void = (args: ItemEventData) => {
        const { logLevel, onCellRecycle, onCellFirstLoad } = this.props._debug;
        const { items, itemTemplateSelector } = this.props;
        const item: any = _CollectionView.isItemsSource(items) ? items.getItem(args.index) : items[args.index];
        const template: string | null = itemTemplateSelector
            ? typeof itemTemplateSelector === 'string'
                ? itemTemplateSelector
                : (itemTemplateSelector as (item: any, index: number, items: any) => string)(item, args.index, items)
            : null;
        const cellFactory: CellFactory | undefined =
            template === null ? this.props.cellFactory : this.props.cellFactories ? this.props.cellFactories.get(template).cellFactory : this.props.cellFactory;

        if (typeof cellFactory === 'undefined') {
            console.warn(`CollectionView: No cell factory found, given template ${template}!`);
            return;
        }

        const view: View | undefined = args.view;
        if (!view) {
            const rootKeyAndRef: RootKeyAndTNSView = this.renderNewRoot(item, cellFactory);

            args.view = rootKeyAndRef.nativeView;

            /* Here we're re-using the ref - I assume this is best practice. If not, we can make a new one on each update instead. */
            this.argsViewToRootKeyAndRef.set(args.view, rootKeyAndRef);

            if (onCellFirstLoad) onCellFirstLoad(rootKeyAndRef.nativeView);
        } else {
            console.log('[CollectionView] existing view: ', view);
            if (onCellRecycle) onCellRecycle(view);

            const { rootKey, nativeView } = this.argsViewToRootKeyAndRef.get(view);
            if (typeof rootKey === 'undefined') {
                console.error('Unable to find root key that args.view corresponds to!', view);
                return;
            }
            if (!nativeView) {
                console.error('Unable to find ref that args.view corresponds to!', view);
                return;
            }

            // args.view = null;
            RNSRender(
                cellFactory(item),
                null,
                () => {
                    // console.log(`Rendered into cell! detachedRootRef:`);
                },
                rootKey
            );
        }
    };

    protected getNativeView(): NativeScriptCollectionView | null {
        const ref = this.props.forwardedRef || this.myRef;
        return ref.current ? ref.current.nativeView : null;
    }

    private readonly renderNewRoot = (item: any, cellFactory: CellFactory): RootKeyAndTNSView => {
        const node: NativeScriptCollectionView | null = this.getNativeView();
        if (!node) {
            throw new Error('Unable to get ref to CollectionView');
        }

        console.log('[CollectionView] no existing view.');
        const rootKey: string = `CollectionView-${node._domId}-${this.roots.size.toString()}`;

        const root = new NSVRoot<View>();
        RNSRender(
            cellFactory(item),
            root,
            () => {
                // console.log(`Rendered into cell! ref:`);
            },
            rootKey
        );

        this.roots.add(rootKey);

        return {
            rootKey,
            nativeView: root.baseRef.nativeView,
        };
    };

    componentDidMount() {
        const node: NativeScriptCollectionView | null = this.getNativeView();
        if (!node) {
            console.warn('React ref to NativeScript View lost, so unable to set item templates.');
            return;
        }

        /* NOTE: does not support updating of this.props.cellFactories upon Props update. */
        if (this.props.cellFactories) {
            const itemTemplates: KeyedTemplate[] = [];
            this.props.cellFactories.forEach((info, key: string) => {
                const { placeholderItem, cellFactory } = info;
                itemTemplates.push({
                    key,
                    createView: () => {
                        console.log(`[CollectionView] item template "${key}"`);
                        const rootKeyAndRef: RootKeyAndTNSView = this.renderNewRoot(placeholderItem, cellFactory);
                        this.argsViewToRootKeyAndRef.set(rootKeyAndRef.nativeView, rootKeyAndRef);

                        return rootKeyAndRef.nativeView;
                    },
                });
            });
            node.itemTemplates = itemTemplates;
        }
    }

    componentWillUnmount() {
        this.roots.forEach((root) => unmountComponentAtNode(root));
    }

    public static isItemsSource(arr: any[] | ItemsSource): arr is ItemsSource {
        /**
         * Same implementation as used in official ListPicker component:
         * @see https://github.com/NativeScript/NativeScript/blob/b436ecde3605b695a0ffa1757e38cc094e2fe311/tns-core-modules/ui/list-picker/list-picker-common.ts#L74
         */
        return typeof (arr as ItemsSource).getItem === 'function';
    }

    render() {
        console.log('CollectionView\'s render()');
        const {
            // Only used by the class component; not the JSX element.
            forwardedRef,
            children,
            _debug,
            cellFactories,
            cellFactory,

            ...rest
        } = this.props;

        if (children) {
            console.warn("Ignoring 'children' prop on CollectionView; not supported.");
        }

        return <collectionView {...rest} onItemLoading={this.defaultOnItemLoading} ref={forwardedRef || this.myRef} />;
    }
}

export const CollectionView = React.forwardRef<NSVElement<NativeScriptCollectionView>, OwnProps>((props: OwnProps, ref: React.RefObject<NSVElement<NativeScriptCollectionView>>) => <_CollectionView {...props} forwardedRef={ref} />);
