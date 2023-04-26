import { SwipeMenuComp } from './component';
import { install } from '..';

const SwipeMenuPlugin = {
    install(app: any) {
        install();
        app.registerElement('SwipeMenu', () => require('../index').SwipeMenu, {
            overwriteExisting: true,
            nodeOps: {
                insert(child, parent) {
                    if (child.nativeView["~mainContent"] === "") {
                        parent.nativeView.mainContent = child.nativeView;
                    } else if (child.nativeView["~leftDrawer"] === "") {
                        parent.nativeView.leftDrawer = child.nativeView;
                    } else if (child.nativeView["~rightDrawer"] === "") {
                        parent.nativeView.rightDrawer = child.nativeView;
                    } else if (child.nativeView["~topDrawer"] === "") {
                        parent.nativeView.topDrawer = child.nativeView;
                    } else if (child.nativeView["~bottomDrawer"] === "") {
                        parent.nativeView.bottomDrawer = child.nativeView;
                    }
                }
            }
        });
        // it seems that we don't need define vue component
        // app.component("SwipeMenu", SwipeMenuComp)
    }
};

export default SwipeMenuPlugin;
