declare class CollectionViewWaterfallLayout extends UICollectionViewLayout {
    static alloc(): CollectionViewWaterfallLayout; // inherited from NSObject

    static new(): CollectionViewWaterfallLayout; // inherited from NSObject
}

interface CollectionViewWaterfallLayoutDelegate extends UICollectionViewDelegate {
    collectionViewLayoutHeightForFooterInSection?(collectionView: UICollectionView, layout: UICollectionViewLayout, section: number): number;

    collectionViewLayoutHeightForHeaderInSection?(collectionView: UICollectionView, layout: UICollectionViewLayout, section: number): number;

    collectionViewLayoutInsetForFooterInSection?(collectionView: UICollectionView, layout: UICollectionViewLayout, section: number): UIEdgeInsets;

    collectionViewLayoutInsetForHeaderInSection?(collectionView: UICollectionView, layout: UICollectionViewLayout, section: number): UIEdgeInsets;

    collectionViewLayoutInsetForSection?(collectionView: UICollectionView, layout: UICollectionViewLayout, section: number): UIEdgeInsets;

    collectionViewLayoutMinimumInteritemSpacingForSection?(collectionView: UICollectionView, layout: UICollectionViewLayout, section: number): number;

    collectionViewLayoutSizeForItemAtIndexPath(collectionView: UICollectionView, layout: UICollectionViewLayout, indexPath: NSIndexPath): CGSize;
}
declare let CollectionViewWaterfallLayoutDelegate: {
    prototype: CollectionViewWaterfallLayoutDelegate;
};

declare let CollectionViewWaterfallLayoutVersionNumber: number;

declare let CollectionViewWaterfallLayoutVersionString: interop.Reference<number>;
