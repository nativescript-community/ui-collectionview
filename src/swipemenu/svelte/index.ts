import { NativeViewElementNode, registerElement } from 'svelte-native/dom';
import { Side, SwipeMenu, install } from '../';

export default class DrawerElement extends NativeViewElementNode<SwipeMenu> {
    constructor() {
        super('swipemenu', SwipeMenu);
    }

    private get _drawer() {
        return this.nativeView;
    }

    close(side?: Side) {
        this._drawer.close(side);
    }

    isOpened(side?: Side): boolean {
        return this._drawer.isOpened(side);
    }

    open(side?: Side) {
        this._drawer.open(side);
    }

    toggle(side?: Side) {
        this._drawer.toggle(side);
    }

    static register() {
        install();
        registerElement('swipemenu', () => new DrawerElement());
    }
}
