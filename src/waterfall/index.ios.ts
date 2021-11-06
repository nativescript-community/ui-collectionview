import { CollectionView } from '@nativescript-community/ui-collectionview';

type WaterfallCollectionView = CollectionView & UICollectionViewDelegate & CollectionViewWaterfallLayoutDelegate;
declare class IUICollectionViewWaterfallDelegateImpl extends NSObject {
    static new(): IUICollectionViewWaterfallDelegateImpl;
    _owner: WeakRef<WaterfallCollectionView>;
}

@NativeClass
class UICollectionViewWaterfallDelegateImpl extends NSObject implements UICollectionViewDelegate, CollectionViewWaterfallLayoutDelegate {
    _owner: WeakRef<CollectionView & UICollectionViewDelegate & CollectionViewWaterfallLayoutDelegate>;

    collectionViewWillDisplayCellForItemAtIndexPath(collectionView: UICollectionView, cell: UICollectionViewCell, indexPath: NSIndexPath) {
        const owner = this._owner.get();
        if (owner) {
            owner.collectionViewWillDisplayCellForItemAtIndexPath(collectionView, cell, indexPath);
        }
    }
    collectionViewDidSelectItemAtIndexPath(collectionView: UICollectionView, indexPath: NSIndexPath) {
        const owner = this._owner.get();
        if (owner) {
            return owner.collectionViewDidSelectItemAtIndexPath(collectionView, indexPath);
        }
        return indexPath;
    }
    collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, collectionViewLayout: UICollectionViewLayout, indexPath: NSIndexPath) {
        const owner = this._owner.get();
        if (owner) {
            return owner.collectionViewLayoutSizeForItemAtIndexPath(collectionView, collectionViewLayout, indexPath);
        }
        return CGSizeZero;
    }
    scrollViewDidScroll(scrollView: UIScrollView): void {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidScroll(scrollView);
        }
    }
    scrollViewDidEndDecelerating(scrollView: UIScrollView) {
        const owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidEndDecelerating(scrollView);
        }
    }
    public static ObjCProtocols = [UICollectionViewDelegate, CollectionViewWaterfallLayoutDelegate];
}

export default function install() {
    CollectionView.registerLayoutStyle('waterfall', {
        createLayout: (collectionview: CollectionView) => {
            const layout = CollectionViewWaterfallLayout.new();
            layout['columnCount'] = collectionview.computeSpanCount();
            // layout['minimumColumnSpacing'] = 12;
            // layout['minimumInteritemSpacing'] = 12;
            return layout;
        },
        createDelegate: () => UICollectionViewWaterfallDelegateImpl.new(),
    });
    CollectionView.registerPlugin('waterfall', {
        onLayout: (collectionview: CollectionView) => {
            const layout = collectionview.nativeViewProtected.collectionViewLayout;
            layout['columnCount'] = collectionview.computeSpanCount();
        },
    });
}
