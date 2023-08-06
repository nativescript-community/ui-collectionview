import { Trace, View } from '@nativescript/core';
import { CLog, CLogTypes, CollectionViewBase } from './index-common';

const poolMap = new Map<string, SharedCollectionViewPoolBase>();
export function getSharedCollectionViewPool(name: string): SharedCollectionViewPoolBase | undefined {
    return poolMap.get(name);
}

export class SharedCollectionViewPoolBase extends CollectionViewBase {
    protected collectionViews = new Set<CollectionViewBase>();
    protected _name: string;

    set name(value: string) {
        if (this._name !== value) {
            poolMap.delete(this._name);
        }
        this._name = value;
        poolMap.set(this._name, this);
    }

    get name(): string {
        return this._name;
    }

    public onLoaded(): void {
        super.onLoaded();
        poolMap.set(this.name, this);
    }

    public onUnloaded(): void {
        super.onUnloaded();
        poolMap.delete(this.name);
    }

    public attachToCollectionView(collectionView: CollectionViewBase): void {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'attachToCollectionView', collectionView);
        }

        this.collectionViews.add(collectionView);
    }

    public detachFromCollectionView(collectionView: CollectionViewBase): void {
        if (Trace.isEnabled()) {
            CLog(CLogTypes.log, 'detachFromCollectionView', collectionView);
        }

        this.collectionViews.delete(collectionView);
    }

    public refresh() {
        throw new Error('Method not implemented.');
    }
    public refreshVisibleItems() {
        throw new Error('Method not implemented.');
    }
    public isItemAtIndexVisible(index: number) {
        throw new Error('Method not implemented.');
    }
    public scrollToIndex(index: number, animated: boolean) {
        throw new Error('Method not implemented.');
    }
    public scrollToOffset(value: number, animated?: boolean) {
        throw new Error('Method not implemented.');
    }
    getViewForItemAtIndex(index: number): View {
        throw new Error('Method not implemented.');
    }
    startDragging(index: number) {
        throw new Error('Method not implemented.');
    }
}
