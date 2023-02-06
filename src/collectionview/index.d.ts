import { EventData, View } from '@nativescript/core';
import { Pointer } from '@nativescript/core/ui/gestures';
import { CollectionViewBase } from './index-common';
export * from './index-common';

export type Orientation = 'horizontal' | 'vertical';

export class CollectionView extends CollectionViewBase {
    public scrollOffset: number;
    public refresh();
    public refreshVisibleItems();
    public isItemAtIndexVisible(index: number): boolean;
    public scrollToIndex(index: number, animated: boolean);
    public getViewForItemAtIndex(index: number): View;
    // on iOS a view is dragged from its center by default
    // if you use a drag "handle" just pass the touch event main pointer
    // to delta the dragging to be good
    startDragging(index: number, pointer?: Pointer);
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
    cell: any; /* UICollectionViewCell on iOS, CollectionViewCellHolder on Android */
}

/**
 * Defines the different view types that {@link RadListView} can display in various scenarios.
 */
export enum ListViewViewTypes {
    /**
     * Identifies a view created using the {@link itemTemplate} value.
     */
    ItemView
}
