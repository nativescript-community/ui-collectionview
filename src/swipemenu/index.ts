import { applyMixins } from '@nativescript-community/class-mixins';
import { CollectionView, CollectionViewBase } from '@nativescript-community/ui-collectionview';
import { Drawer, install as installDrawer } from '@nativescript-community/ui-drawer';
import { CSSType, ContentView, ItemsSource, Property, View, booleanConverter } from '@nativescript/core';

export { Side } from '@nativescript-community/ui-drawer';

export const onlyOneMenuOpenedProperty = new Property<CollectionView, boolean>({
    defaultValue: true,
    valueConverter: booleanConverter,
    name: 'onlyOneMenuOpened'
});

declare module '@nativescript-community/ui-collectionview' {
    interface CollectionView {
        notifyForItemAtIndex(eventName: string, view: View, index: number, bindingContext?, native?: any);
    }
}

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
                // console.log('closeCurrentMenu', view, openedIndex, oldItem, new Error().stack);
                oldItem.startingSide = null;
                // this.notifyForItemAtIndex(CollectionViewBase.itemLoadingEvent, view, openedIndex, oldItem);
                setTimeout(() => {
                    this.setItemAtIndex(openedIndex, oldItem);
                }, 0);
            }
        } catch (error) {
            console.error('closeCurrentMenu', error, error.stack);
        } finally {
        }
    }
    async onItemMenuStart(event) {
        const view = event.object;
        const bindingContext = view.bindingContext;
        const index = (this.items as any).findIndex((i) => i === bindingContext);
        // console.error('onItemMenuStart', index, bindingContext, view, this.openedDrawerIndex);
        if (this.openedDrawerIndex !== index && this.openedDrawerIndex >= 0) {
            this.closeCurrentMenu();
        }
        this.openedDrawerIndex = index;
    }
    onItemMenuOpened(event) {
        const view = event.object;
        const bindingContext = view.bindingContext;
        const index = (this.items as any).findIndex((i) => i === bindingContext);
        // console.error('onItemMenuOpened', index, bindingContext, view, this.openedDrawerIndex);
        if (this.openedDrawerIndex >= 0 && this.openedDrawerIndex !== index) {
            this.closeCurrentMenu();
        }
        this.openedDrawerIndex = index;
        bindingContext.startingSide = view.startingSide = 'left';
        this.notifyForItemAtIndex(CollectionViewBase.itemLoadingEvent, view, index, bindingContext);
    }
    onItemMenuClosed(event) {
        const view = event.object;
        const bindingContext = view.bindingContext;
        const index = (this.items as any).findIndex((i) => i === bindingContext);
        // console.error('onItemMenuClosed', index, bindingContext, view, this.openedDrawerIndex);
        if (bindingContext.startingSide !== null) {
            if (index === this.openedDrawerIndex) {
                this.openedDrawerIndex = -1;
            }
            bindingContext.startingSide = view.startingSide = null;
            this.notifyForItemAtIndex(CollectionViewBase.itemLoadingEvent, view, index, bindingContext);
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
        installDrawer();
        overrideCollectionView();
    }
}
