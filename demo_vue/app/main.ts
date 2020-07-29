import Vue from 'nativescript-vue';
import App from './components/App.vue';

// import { Label as HTMLLabel } from 'nativescript-htmllabel'; // require first to get Font res loading override
// Vue.registerElement('Label', () => HTMLLabel);

import { install as installGestures } from 'nativescript-gesturehandler';
installGestures(true);

import CollectionView from '@nativescript-community/ui-collectionview/vue';

Vue.use(CollectionView);
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = true;
// Vue.config.silent = (TNS_ENV === 'production')

new Vue({
    render: h => h(App)
}).$start();
