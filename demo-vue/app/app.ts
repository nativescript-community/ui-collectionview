import Vue from 'nativescript-vue';
import App from './components/App.vue';

import CollectionView from '@nativescript-community/ui-collectionview/vue';
Vue.use(CollectionView);

Vue.config.silent = true;

new Vue({
    render: h => h('frame', [h(App)]),
}).$start();
