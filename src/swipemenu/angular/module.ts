import { Component, Directive, ElementRef, EmbeddedViewRef, Inject, NgModule, TemplateRef, ViewContainerRef } from '@angular/core';
import { SwipeMenu, install as installSwipeMenu } from '@nativescript-community/ui-collectionview-swipemenu';
import { NgView, ViewClassMeta, registerElement } from '@nativescript/angular';
installSwipeMenu();
const LEFTDRAWER: string = 'LeftSwipeMenu';
const RIGHTDRAWER: string = 'RightSwipeMenu';
const TOPDRAWER: string = 'TopSwipeMenu';
const BOTTOMDRAWER: string = 'BottomSwipeMenu';
const MAINCONTENT: string = 'MainContent';

export interface ItemEventArgs {
    object: any;
    view: EmbeddedViewRef<any>;
    returnValue?: boolean;
}

/**
 * This is the SideSwipeMenu component. It separates your mobile app's screen
 * into a main part and a menu part whereby the menu part is shown upon a swipe
 * gesture using a transition effect.
 */
@Component({
    selector: 'SwipeMenu',
    template: '<ng-content></ng-content>'
})
export class SwipeMenuComponent {
    public swipemenu: SwipeMenu;
    public mainTemplate: TemplateRef<ElementRef>;
    public swipemenuTemplate: TemplateRef<ElementRef>;

    private _gestureEnabled: boolean;

    constructor(@Inject(ElementRef) public elementRef: ElementRef, @Inject(ViewContainerRef) private viewContainer: ViewContainerRef) {
        this.swipemenu = this.elementRef.nativeElement;
    }

    public get nativeElement(): SwipeMenu {
        return this.swipemenu;
    }

    set gestureEnabled(value: boolean) {
        this._gestureEnabled = value;
        this.updateGestureEnabled();
    }

    private updateGestureEnabled() {
        this.swipemenu.gestureEnabled = this._gestureEnabled;
    }
}

/**
 * Directive identifying the left swipemenu
 */
@Directive({
    selector: '[leftSwipeMenu]'
})
export class LeftSwipeMenuDirective {
    constructor(@Inject(ElementRef) private _elementRef: ElementRef) {
        this._elementRef.nativeElement.id = LEFTDRAWER;
    }
}
/**
 * Directive identifying the right swipemenu
 */
@Directive({
    selector: '[rightSwipeMenu]'
})
export class RightSwipeMenuDirective {
    constructor(@Inject(ElementRef) private _elementRef: ElementRef) {
        this._elementRef.nativeElement.id = RIGHTDRAWER;
    }
}

/**
 * Directive identifying the right swipemenu
 */
@Directive({
    selector: '[topSwipeMenu]'
})
export class TopSwipeMenuDirective {
    constructor(@Inject(ElementRef) private _elementRef: ElementRef) {
        this._elementRef.nativeElement.id = TOPDRAWER;
    }
}

/**
 * Directive identifying the right swipemenu
 */
@Directive({
    selector: '[bottomSwipeMenu]'
})
export class BottomSwipeMenuDirective {
    constructor(@Inject(ElementRef) private _elementRef: ElementRef) {
        this._elementRef.nativeElement.id = BOTTOMDRAWER;
    }
}

/**
 * Directive identifying the main content.
 */
@Directive({
    selector: '[mainContent]'
})
export class MainContentDirective {
    constructor(@Inject(ElementRef) private _elementRef: ElementRef) {
        this._elementRef.nativeElement.id = MAINCONTENT;
    }
}

const sideSwipeMenuMeta: ViewClassMeta = {
    insertChild: (parent: NgView, child: NgView) => {
        const swipemenu = parent as any as SwipeMenu;
        const childView = child;

        if (childView.id === MAINCONTENT) {
            swipemenu.mainContent = childView;
        }

        if (childView.id === LEFTDRAWER) {
            swipemenu.leftDrawer = childView;
        }
        if (childView.id === RIGHTDRAWER) {
            swipemenu.rightDrawer = childView;
        }
        if (childView.id === TOPDRAWER) {
            swipemenu.topDrawer = childView;
        }
        if (childView.id === BOTTOMDRAWER) {
            swipemenu.bottomDrawer = childView;
        }
    },
    removeChild: (parent: NgView, child: NgView) => {
        const swipemenu = parent as any as SwipeMenu;
        const childView = child;

        if (childView.id === MAINCONTENT) {
            swipemenu.mainContent = null;
        }

        if (childView.id === LEFTDRAWER) {
            swipemenu.leftDrawer = null;
        }
        if (childView.id === RIGHTDRAWER) {
            swipemenu.rightDrawer = null;
        }
        if (childView.id === TOPDRAWER) {
            swipemenu.topDrawer = null;
        }
        if (childView.id === BOTTOMDRAWER) {
            swipemenu.bottomDrawer = null;
        }
    }
};

/**
 * Directives identifying the SwipeMenu.
 */
export const SIDEDRAWER_DIRECTIVES = [LeftSwipeMenuDirective, RightSwipeMenuDirective, TopSwipeMenuDirective, BottomSwipeMenuDirective, MainContentDirective];

registerElement('SwipeMenu', () => SwipeMenu, sideSwipeMenuMeta);

/**
 * NgModule containing all of the RadSideSwipeMenu directives.
 */
@NgModule({
    declarations: [SwipeMenuComponent, SIDEDRAWER_DIRECTIVES],
    exports: [SwipeMenuComponent, SIDEDRAWER_DIRECTIVES]
})
export class SwipeMenuModule {}
