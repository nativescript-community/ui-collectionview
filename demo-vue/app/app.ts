import Vue from 'nativescript-vue';
import App from './components/App.vue';

import CollectionView from '@nativescript-community/ui-collectionview/vue';
Vue.use(CollectionView);

Vue.config.silent = true;
// Vue.config.silent = (TNS_ENV === 'production')

new Vue({
    render: h => h(App),
}).$start();
