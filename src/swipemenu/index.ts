import { applyMixins } from '@nativescript-community/class-mixins';
import { CollectionView } from '@nativescript-community/ui-collectionview';
import { Drawer } from '@nativescript-community/ui-drawer';
import { CSSType, ContentView, ItemsSource, Property, booleanConverter } from '@nativescript/core';

export { Side } from '@nativescript-community/ui-drawer';

export const onlyOneMenuOpenedProperty = new Property<CollectionView, boolean>({
    defaultValue: true,
    valueConverter: booleanConverter,
    name: 'onlyOneMenuOpened'
});

let mixinInstalled = false;
class CollectionViewWithSwipeMenu extends CollectionView {
    onlyOneMenuOpened;
    openedDrawerIndex: number;
    public setItemAtIndex(index: number, item): any {
        // will be overriden in onItemsChangedInternal
        const thisItems = this.items as ItemsSource;
        if (thisItems['setItem']) {
            thisItems['setItem'](index, item);
        } else {
            thisItems[index] = item;
        }
    }
    async closeCurrentMenu() {
        try {
            const openedIndex = this.openedDrawerIndex;
            this.openedDrawerIndex = -1;
            let view = this.getViewForItemAtIndex(openedIndex);
            // console.log('closeCurrentMenu', openedIndex, view, view.bindingContext);
            if (view instanceof ContentView) {
                view = view.content;
            }
            if (view instanceof Drawer) {
                view.close();
            } else {
                const oldItem = this.getItemAtIndex(openedIndex);
                oldItem.startingSide = null;
                // this.setItemAtIndex(openedIndex, oldItem);
            }
        } catch (error) {
            console.error(error);
        } finally {
        }
    }
    async onItemMenuStart(event) {
        const item = event.object.bindingContext;
        const index = (this.items as any).findIndex((i) => i === item);
        // console.log('onItemMenuStart', index, item, event.object, this.openedDrawerIndex);
        if (this.openedDrawerIndex >= 0) {
            this.closeCurrentMenu();
        }
        this.openedDrawerIndex = index;
    }
    onItemMenuOpened(event) {
        const item = event.object.bindingContext;
        const index = (this.items as any).findIndex((i) => i === item);
        // console.log('onItemMenuOpened', index, item, event.object, this.openedDrawerIndex);
        if (this.openedDrawerIndex >= 0 && this.openedDrawerIndex !== index) {
            // console.log('onItemMenuOpened', 'closing current', index, this.openedDrawerIndex);
            this.closeCurrentMenu();
        }
        this.openedDrawerIndex = index;
        // setTimeout(() => {
            item.startingSide = event.object.startingSide = 'left';
            // this.setItemAtIndex(index, item);
        // }, 1000);
        // console.log('onItemMenuOpened done', index, item, event.object, this.openedDrawerIndex);
    }
    onItemMenuClosed(event) {
        const item = event.object.bindingContext;
        const index = (this.items as any).findIndex((i) => i === item);
        // console.log('onItemMenuClosed', index, event.object, this.openedDrawerIndex, new Error().stack);
        if (item.startingSide !== null) {
            if (index === this.openedDrawerIndex) {
                this.openedDrawerIndex = -1;
            }
            item.startingSide = event.object.startingSide = null;
            // this.setItemAtIndex(index, item);
        }
    }
}
export function overrideCollectionView() {
    applyMixins(CollectionView, [CollectionViewWithSwipeMenu]);
}

@CSSType('SwipeMenu')
export class SwipeMenu extends Drawer {
    constructor() {
        super();
        this.gestureHandlerOptions = { activeOffsetXStart: -10, activeOffsetXEnd: 10, failOffsetYStart: -10, failOffsetYEnd: 10, minDist: 15 };
        this.leftOpenedDrawerAllowDraging = true;
        this.rightOpenedDrawerAllowDraging = true;
        this.topOpenedDrawerAllowDraging = true;
        this.bottomOpenedDrawerAllowDraging = true;
        this.iosIgnoreSafeArea = true;
        this.backDropEnabled = false;
        this.leftDrawerMode = 'under';
        this.rightDrawerMode = 'under';
        this.topDrawerMode = 'under';
        this.bottomDrawerMode = 'under';
    }
    getParentCollectionView() {
        let collectionview = this.parent;
        while (collectionview && !(collectionview instanceof CollectionView)) {
            collectionview = collectionview.parent;
        }
        return collectionview instanceof CollectionView ? (collectionview as CollectionViewWithSwipeMenu) : null;
    }
    initNativeView(): void {
        super.initNativeView();
        const collectionview = this.getParentCollectionView();
        if (collectionview) {
            this.on('start', collectionview.onItemMenuStart, collectionview);
            this.on('open', collectionview.onItemMenuOpened, collectionview);
            this.on('close', collectionview.onItemMenuClosed, collectionview);
        }
    }
    disposeNativeView(): void {
        super.disposeNativeView();
        const collectionview = this.getParentCollectionView();
        if (collectionview) {
            this.on('start', collectionview.onItemMenuStart, collectionview);
            this.on('open', collectionview.onItemMenuOpened, collectionview);
            this.on('close', collectionview.onItemMenuClosed, collectionview);
        }
    }
}

export function install() {
    if (!mixinInstalled) {
        mixinInstalled = true;
        overrideCollectionView();
    }
}
