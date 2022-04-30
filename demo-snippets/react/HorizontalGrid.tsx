import * as React from 'react';
import { CollectionView } from '@nativescript-community/ui-collectionview/react';
import { StyleSheet } from 'react-nativescript';
import { FontWeight } from '@nativescript/core/ui/styling/font';

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
    <gridLayout rows="*, auto" backgroundColor={item.color} style={styles.item}>
        <stackLayout row={1}>
            <label text={item.name} style={styles.title} />
            <label text={item.color} style={styles.subtitle} />
        </stackLayout>
    </gridLayout>
);

export function HorizontalGrid() {
    return (
        <CollectionView items={items} colWidth="50%" rowHeight="50%" orientation="horizontal" cellFactory={cellFactory} width="100%" height="100%" />
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        color: 'white'
    },
    title: {
        fontSize: 17,
        fontWeight: FontWeight.BOLD
    },
    subtitle: {
        fontSize: 14
    }
});