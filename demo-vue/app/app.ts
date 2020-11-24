import Vue from 'nativescript-vue';
import App from './components/App.vue';
import { Trace } from '@nativescript/core';
import {CollectionViewTraceCategory } from '@nativescript-community/ui-collectionview';

import CollectionView from '@nativescript-community/ui-collectionview/vue';
Vue.use(CollectionView);
Trace.addCategories(CollectionViewTraceCategory);
Trace.enable();

Vue.config.silent = true;

new Vue({
    render: h => h('frame', [h(App)]),
}).$start();
