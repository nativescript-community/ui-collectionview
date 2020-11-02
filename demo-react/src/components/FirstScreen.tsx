import * as React from 'react';
import { RouteProp } from '@react-navigation/core';
import { Dialogs } from '@nativescript/core';
import { FrameNavigationProp } from 'react-nativescript-navigation';
import { MainStackParamList } from './NavigationParamList';
import { CollectionView } from '@nativescript-community/ui-collectionview/react';

interface FirstScreenProps {
    route: RouteProp<MainStackParamList, 'first'>;
    navigation: FrameNavigationProp<MainStackParamList, 'first'>;
}

const items = [
    { index: 0, name: 'TURQUOISE', color: '#1abc9c' },
    { index: 1, name: 'EMERALD', color: '#2ecc71' },
    { index: 2, name: 'PETER RIVER', color: '#3498db' },
    { index: 3, name: 'AMETHYST', color: '#9b59b6' },
    { index: 4, name: 'WET ASPHALT', color: '#34495e' },
    { index: 5, name: 'GREEN SEA', color: '#16a085' },
    { index: 6, name: 'NEPHRITIS', color: '#27ae60' },
    { index: 7, name: 'BELIZE HOLE', color: '#2980b9' },
    { index: 8, name: 'WISTERIA', color: '#8e44ad' },
    { index: 9, name: 'MIDNIGHT BLUE', color: '#2c3e50' },
    { index: 10, name: 'SUN FLOWER', color: '#f1c40f' },
    { index: 11, name: 'CARROT', color: '#e67e22' },
    { index: 12, name: 'ALIZARIN', color: '#e74c3c' },
    { index: 13, name: 'CLOUDS', color: '#ecf0f1' },
    { index: 14, name: 'CONCRETE', color: '#95a5a6' },
    { index: 15, name: 'ORANGE', color: '#f39c12' },
    { index: 16, name: 'PUMPKIN', color: '#d35400' },
    { index: 17, name: 'POMEGRANATE', color: '#c0392b' },
    { index: 18, name: 'SILVER', color: '#bdc3c7' },
    { index: 19, name: 'ASBESTOS', color: '#7f8c8d' },
];

interface Item {
    index: number;
    name: string;
    color: string;
}

const cellFactory = (item: Item) => (
    <gridLayout rows="*, auto" backgroundColor={item.color} className="item">
        <stackLayout row={1}>
            <label text={item.name} className="title" />
            <label text={item.color} className="subtitle" />
        </stackLayout>
    </gridLayout>
);

export function First() {
    return (
        <CollectionView items={items} colWidth="50%" rowHeight="200" cellFactory={cellFactory} width="100%" height="100%" />
    );
}
