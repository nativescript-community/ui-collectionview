import { CollectionView } from '@nativescript-community/ui-collectionview';
export default function install() {
    CollectionView.registerLayoutStyle('waterfall', {
        createLayout: (collectionview) => new androidx.recyclerview.widget.StaggeredGridLayoutManager(1, 1),
    });
}
//# sourceMappingURL=waterfall.android.js.map