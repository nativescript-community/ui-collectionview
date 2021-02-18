import * as React from 'react';
import { NSVRoot, render as RNSRender, registerElement, unmountComponentAtNode } from 'react-nativescript';
export function registerCollectionView() {
    registerElement('collectionView', () => require('../collectionview').CollectionView);
}
;
export class _CollectionView extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.argsViewToRootKeyAndRef = new Map();
        this.roots = new Set();
        this.defaultOnItemLoading = (args) => {
            const { logLevel, onCellRecycle, onCellFirstLoad } = this.props._debug;
            const { items, itemTemplateSelector } = this.props;
            const item = _CollectionView.isItemsSource(items) ? items.getItem(args.index) : items[args.index];
            const template = itemTemplateSelector
                ? typeof itemTemplateSelector === 'string'
                    ? itemTemplateSelector
                    : itemTemplateSelector(item, args.index, items)
                : null;
            const cellFactory = template === null ? this.props.cellFactory : this.props.cellFactories ? this.props.cellFactories.get(template).cellFactory : this.props.cellFactory;
            if (typeof cellFactory === 'undefined') {
                console.warn(`CollectionView: No cell factory found, given template ${template}!`);
                return;
            }
            const view = args.view;
            if (!view) {
                const rootKeyAndRef = this.renderNewRoot(item, cellFactory);
                args.view = rootKeyAndRef.nativeView;
                this.argsViewToRootKeyAndRef.set(args.view, rootKeyAndRef);
                if (onCellFirstLoad)
                    onCellFirstLoad(rootKeyAndRef.nativeView);
            }
            else {
                if (onCellRecycle)
                    onCellRecycle(view);
                const { rootKey, nativeView } = this.argsViewToRootKeyAndRef.get(view);
                if (typeof rootKey === 'undefined') {
                    console.error('Unable to find root key that args.view corresponds to!', view);
                    return;
                }
                if (!nativeView) {
                    console.error('Unable to find ref that args.view corresponds to!', view);
                    return;
                }
                RNSRender(cellFactory(item), null, () => {
                }, rootKey);
            }
        };
        this.renderNewRoot = (item, cellFactory) => {
            const node = this.getNativeView();
            if (!node) {
                throw new Error('Unable to get ref to CollectionView');
            }
            const rootKey = `CollectionView-${node._domId}-${this.roots.size.toString()}`;
            const root = new NSVRoot();
            RNSRender(cellFactory(item), root, () => {
            }, rootKey);
            this.roots.add(rootKey);
            return {
                rootKey,
                nativeView: root.baseRef.nativeView,
            };
        };
        this.state = {
            nativeCells: {},
            nativeCellToItemIndex: new Map(),
            itemIndexToNativeCell: props._debug.logLevel === 'debug' ? new Map() : undefined,
        };
    }
    getNativeView() {
        const ref = this.props.forwardedRef || this.myRef;
        return ref.current ? ref.current.nativeView : null;
    }
    componentDidMount() {
        const node = this.getNativeView();
        if (!node) {
            console.warn('React ref to NativeScript View lost, so unable to set item templates.');
            return;
        }
        if (this.props.cellFactories) {
            const itemTemplates = [];
            this.props.cellFactories.forEach((info, key) => {
                const { placeholderItem, cellFactory } = info;
                itemTemplates.push({
                    key,
                    createView: () => {
                        const rootKeyAndRef = this.renderNewRoot(placeholderItem, cellFactory);
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
    static isItemsSource(arr) {
        return typeof arr.getItem === 'function';
    }
    render() {
        const _a = this.props, { forwardedRef, children, _debug, cellFactories, cellFactory } = _a, rest = __rest(_a, ["forwardedRef", "children", "_debug", "cellFactories", "cellFactory"]);
        if (children) {
            console.warn("Ignoring 'children' prop on CollectionView; not supported.");
        }
        return React.createElement("collectionView", Object.assign({}, rest, { onItemLoading: this.defaultOnItemLoading, ref: forwardedRef || this.myRef }));
    }
}
_CollectionView.defaultProps = {
    _debug: {
        logLevel: 'info',
        onCellFirstLoad: undefined,
        onCellRecycle: undefined,
    },
};
export const CollectionView = React.forwardRef((props, ref) => React.createElement(_CollectionView, Object.assign({}, props, { forwardedRef: ref })));
//# sourceMappingURL=index.js.map