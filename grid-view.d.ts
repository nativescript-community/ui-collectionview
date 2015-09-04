declare module "grid-view"
{
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");
    import observable = require("data/observable");

    export class GridView extends view.View 
    {
        public static itemLoadingEvent: string;
        public static itemTapEvent: string;
        public static loadMoreItemsEvent: string;

        public static itemsProperty: dependencyObservable.Property;
        public static itemTemplateProperty: dependencyObservable.Property;
        public static colWidthProperty: dependencyObservable.Property;
        public static rowHeightProperty: dependencyObservable.Property;
        public static verticalSpacingProperty: dependencyObservable.Property;
        public static horizontalSpacingProperty: dependencyObservable.Property;

        items: any;
        itemTemplate: string;
        colWidth: number
        ios: UICollectionView;

        public refresh();
    }

    export function registerGridViewStylers();

    export interface GridItemEventData extends observable.EventData 
    {
        eventName: string;
        object: GridView;
        index: number;
        view: view.View;
    }
}