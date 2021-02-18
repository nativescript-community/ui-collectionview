import { CollectionView } from '@nativescript-community/ui-collectionview';
var UICollectionViewWaterfallDelegateImpl = /** @class */ (function (_super) {
    __extends(UICollectionViewWaterfallDelegateImpl, _super);
    function UICollectionViewWaterfallDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UICollectionViewWaterfallDelegateImpl.prototype.collectionViewWillDisplayCellForItemAtIndexPath = function (collectionView, cell, indexPath) {
        var owner = this._owner.get();
        if (owner) {
            owner.collectionViewWillDisplayCellForItemAtIndexPath(collectionView, cell, indexPath);
        }
    };
    UICollectionViewWaterfallDelegateImpl.prototype.collectionViewDidSelectItemAtIndexPath = function (collectionView, indexPath) {
        var owner = this._owner.get();
        if (owner) {
            return owner.collectionViewDidSelectItemAtIndexPath(collectionView, indexPath);
        }
        return indexPath;
    };
    UICollectionViewWaterfallDelegateImpl.prototype.collectionViewLayoutSizeForItemAtIndexPath = function (collectionView, collectionViewLayout, indexPath) {
        var owner = this._owner.get();
        if (owner) {
            return owner.collectionViewLayoutSizeForItemAtIndexPath(collectionView, collectionViewLayout, indexPath);
        }
        return CGSizeZero;
    };
    UICollectionViewWaterfallDelegateImpl.prototype.scrollViewDidScroll = function (scrollView) {
        var owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidScroll(scrollView);
        }
    };
    UICollectionViewWaterfallDelegateImpl.prototype.scrollViewDidEndDecelerating = function (scrollView) {
        var owner = this._owner.get();
        if (owner) {
            owner.scrollViewDidEndDecelerating(scrollView);
        }
    };
    UICollectionViewWaterfallDelegateImpl.ObjCProtocols = [UICollectionViewDelegate, CollectionViewWaterfallLayoutDelegate];
    return UICollectionViewWaterfallDelegateImpl;
}(NSObject));
export default function install() {
    CollectionView.registerLayoutStyle('waterfall', {
        createLayout: (collectionview) => {
            const layout = CollectionViewWaterfallLayout.new();
            layout['columnCount'] = collectionview.computeSpanCount();
            return layout;
        },
        createDelegate: () => UICollectionViewWaterfallDelegateImpl.new(),
    });
    CollectionView.registerPlugin('waterfall', {
        onLayout: (collectionview) => {
            const layout = collectionview.nativeViewProtected.collectionViewLayout;
            layout['columnCount'] = collectionview.computeSpanCount();
        },
    });
}
//# sourceMappingURL=waterfall.ios.js.map