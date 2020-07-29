import { CollectionView } from '../collectionview';

const CollectionViewPlugin = {
    install(Vue, options) {
        Vue.registerElement(
            'CollectionView',
            function () {
                return CollectionView;
            },
            {
                component: require('./component').default,
            }
        );
    },
};

export default CollectionViewPlugin;
