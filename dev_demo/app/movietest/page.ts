import { CollectionViewItemEventData } from '../nativescript-collectionview/collectionview';
// import { CardView } from 'nativescript-cardview';
// import { Image } from 'nativescript-image';
// import { GridView } from 'nativescript-collectionview';
// import { ActionBar } from 'tns-core-modules/ui/action-bar';
import { topmost } from 'tns-core-modules/ui/frame';
// import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
// import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
// import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
// import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { NavigatedData, Page } from 'tns-core-modules/ui/page';
import { View } from 'tns-core-modules/ui/core/view';
import { Model } from './model';
// Provide the UIBuilder used by tsx output to querry createElement calls.
// import { UIBuilder } from 'nativescript-tsx';

let model: Model;
let page;
export function onNavigatingTo(args: NavigatedData) {
    if (args.isBackNavigation) {
        return;
    }

    page = args.object;
    model = page.bindingContext = new Model();
    model.refresh();
    model.refreshLatest();
}

exports.pageLoaded = function() {
    if (page._fragment) {
        console.log(`pageloaded ${page._fragment}`);
        page._fragment.setSharedElementReturnTransition(createDetailsTransition());
    }
    
    // application.on(application.orientationChangedEvent, setOrientation);
};

// exports.pageUnloaded = function() {
//     application.off(application.orientationChangedEvent, setOrientation);
// };
// function setOrientation(args) {
//     // Will console out the new Orientation
//     console.log(args.newValue);
//     // model.updateOrientation(args.newValue === 'landscape', page.getViewById("square"));
// }

function createDetailsTransition() {
    const transitionNS = android.transition as any;
    let transition = new transitionNS.TransitionSet();
    transition.setOrdering(transitionNS.TransitionSet.ORDERING_TOGETHER);
    transition.addTransition(new transitionNS.ChangeClipBounds());
    transition.addTransition(new transitionNS.ChangeBounds());
    transition.addTransition(new transitionNS.ChangeTransform());
    // transition.addTransition(new transitionNS.ChangeImageTransform());
    // transition.setDuration(1000);
    return transition;
}

function showMovieDetails(args: CollectionViewItemEventData, isTrailer = false) {
    const itemIndex = args.index;
    const dataItem = isTrailer?model.trailerItems.getItem(itemIndex):model.dataItems.getItem(itemIndex);
    const viewId = 'poster'
    let view = args.view.getViewById(viewId) as View;
    let nativeView = view.nativeView;
    console.log(`showMovieDetails ${args.view} ${view} ${viewId} ${itemIndex} ${dataItem && dataItem.title}`);
    topmost().navigate({
        moduleName: 'details/page',
        context: dataItem,
        animated: true,
        transition: {
            name: 'fade',
            duration: 300,
            curve: 'easeIn'
        },
        // prepareFragment: function(containerViewId, entry, fragment, newFragment, transaction: 	any, newFragmentTag) {
        //     // newFragment.setSharedElementEnterTransition(createDetailsTransition());
        //     // transaction.addSharedElement(nativeView, view.transitionName);
        //     console.log(`addSharedElement ${nativeView} ${view.transitionName}`);
        //     console.log(`newFragment ${newFragment}`);
        //     newFragment.postponeEnterTransition();
        //     transaction.setReorderingAllowed(true);
        //     nativeView = null;
        // }
    } as any);
}

export function trailerTap(args) {
    showMovieDetails(args, true);
}
export function movieTap(args) {
    showMovieDetails(args);
}


export function templateSelector(item: any, index: number, items: any) {
    return index === 0 ? "trailers" : "item";
}