import { KeyedTemplate, PercentLength, Template, View } from '@nativescript/core/ui/core/view';
import { ItemsSource } from '@nativescript/core/ui/list-view';
import { EventData } from '@nativescript/core/data/observable';
import { CollectionViewBase, Plugin } from './collectionview-common';
export * from './collectionview-common';

export type Orientation = 'horizontal' | 'vertical';

export class CollectionView extends CollectionViewBase {
    public refresh();
    public scrollToIndex(index: number, animated: boolean);
}

export interface CollectionViewItemEventData extends EventData {
    eventName: string;
    object: CollectionView;
    index: number;
    view: View;
    item:any,
    bindingContext?: any;
}

/**
 * Defines the different view types that {@link RadListView} can display in various scenarios.
 */
export enum ListViewViewTypes {
    /**
     * Identifies a view created using the {@link itemTemplate} value.
     */
    ItemView,
}
