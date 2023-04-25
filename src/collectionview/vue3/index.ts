import { CollectionView as VueCollectionView } from './component';
import { CollectionView as NativeCollectionView } from '..';
import "@vue/runtime-core"

const CollectionViewPlugin = {
    install(app: any) {
        app.registerElement("NativeCollectionView", () => NativeCollectionView, {
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
