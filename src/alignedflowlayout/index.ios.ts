import { Length, Utils } from '@nativescript/core';
import { CollectionView } from '@nativescript-community/ui-collectionview';

interface IOSCollectionView extends CollectionView {
    clearCachedSize(...indexes: number[]);
    layoutAttributesForElementsInRect(attributesArray: NSArray<UICollectionViewLayoutAttributes>, rect: CGRect);
}

@NativeClass
class AlignedCollectionViewFlowLayoutImpl extends AlignedCollectionViewFlowLayout {
    _owner: WeakRef<IOSCollectionView>;

    static initWithOwner(owner: IOSCollectionView) {
        const layout = AlignedCollectionViewFlowLayoutImpl.new() as AlignedCollectionViewFlowLayoutImpl;
        layout._owner = new WeakRef(owner);
        return layout;
    }
    invalidationContextForInteractivelyMovingItemsWithTargetPositionPreviousIndexPathsPreviousPosition(
        targetIndexPaths: NSArray<NSIndexPath>,
        targetPosition: CGPoint,
        previousIndexPaths: NSArray<NSIndexPath>,
        previousPosition: CGPoint
    ): UICollectionViewLayoutInvalidationContext {
        const owner = this._owner?.get();
        if (owner && targetIndexPaths.count) {
            owner.clearCachedSize(targetIndexPaths.objectAtIndex(0).row, previousIndexPaths.objectAtIndex(0).row);
        }
        return super.invalidationContextForInteractivelyMovingItemsWithTargetPositionPreviousIndexPathsPreviousPosition(targetIndexPaths, targetPosition, previousIndexPaths, previousPosition);
    }
    layoutAttributesForElementsInRect(rect: CGRect) {
        const attributesArray = super.layoutAttributesForElementsInRect(rect);
        const owner = this._owner?.get();
        owner?.layoutAttributesForElementsInRect(attributesArray, rect);
        return attributesArray;
    }
    shouldInvalidateLayoutForBoundsChange(newBounds: CGRect) {
        const owner = this._owner?.get();
        if (owner?.itemOverlap) {
            return true;
        }
        return super.shouldInvalidateLayoutForBoundsChange(newBounds);
    }
}

export default function install() {
    CollectionView.registerLayoutStyle('align', {
        createLayout: (collectionview: IOSCollectionView) => {
            const layout = AlignedCollectionViewFlowLayoutImpl.initWithOwner(collectionview);
            switch (collectionview['layoutHorizontalAlignment']) {
                case 'left':
                    layout.horizontalAlignment = HorizontalAlignment.Left;
                    break;
                case 'right':
                    layout.horizontalAlignment = HorizontalAlignment.Right;
                    break;
                case 'justified':
                    layout.horizontalAlignment = HorizontalAlignment.Justified;
                    break;
                case 'leading':
                    layout.horizontalAlignment = HorizontalAlignment.Leading;
                    break;
                case 'trailing':
                    layout.horizontalAlignment = HorizontalAlignment.Trailing;
                    break;
            }
            switch (collectionview['layoutVerticalAlignment']) {
                case 'top':
                    layout.verticalAlignment = VerticalAlignment.Top;
                    break;
                case 'bottom':
                    layout.verticalAlignment = VerticalAlignment.Bottom;
                    break;
                case 'center':
                    layout.verticalAlignment = VerticalAlignment.Center;
                    break;
            }
            return layout;
        }
    });
}
