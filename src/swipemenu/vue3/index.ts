import { SwipeMenuComp } from './component';
import { install } from '..';

const SwipeMenuPlugin = {
    install(app: any) {
        //FIXME
        install();
        app.registerElement('NativeSwipeMenu', () => require('../index').SwipeMenu, {
            overwriteExisting: true
        });
        app.component("SwipeMenu", SwipeMenuComp)
    }
};

export default SwipeMenuPlugin;
