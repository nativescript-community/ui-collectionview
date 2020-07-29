import { EventData, View } from '@nativescript/core';
import { CollectionViewBase } from './collectionview-common';
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
    item: any;
    bindingContext?: any;
}

export interface CollectionViewItemDisplayEventData extends EventData {
    eventName: string;
    object: CollectionView;
    index: number;
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
