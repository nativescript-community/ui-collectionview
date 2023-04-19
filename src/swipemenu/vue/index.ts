import SwipeMenuComp from './component';
import { install } from '..';

const SwipeMenuPlugin = {
    install(Vue) {
        install();
        Vue.registerElement('SwipeMenu', () => require('../index').SwipeMenu, {
            component: SwipeMenuComp
        });
    }
};

export default SwipeMenuPlugin;
