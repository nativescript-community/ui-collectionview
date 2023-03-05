import { CollectionView as VueCollectionView } from './component';
import { CollectionView as NSCollectionView } from '..';
import "@vue/runtime-core"

const CollectionViewPlugin = {
    install(app: any) {
        app.registerElement("NSCollectionView", () => NSCollectionView, {
            viewFlags: 8,
            overwriteExisting: true
        });
        app.component("CollectionView", VueCollectionView)
    }
};

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        CollectionView: typeof VueCollectionView,
    }
}

export default CollectionViewPlugin;
