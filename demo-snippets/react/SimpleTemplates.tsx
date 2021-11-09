import * as React from 'react';
import { CollectionView } from '@nativescript-community/ui-collectionview/react';
import { StyleSheet } from 'react-nativescript';
import { FontWeight } from '@nativescript/core/ui/styling/font';
import { ObservableArray } from '@nativescript/core';

const items = [
    { type: 'heading', name: 'Heading #1', color: '#bdc3c7'},
    { type: 'item', name: 'TURQUOISE', color: '#1abc9c' },
    { type: 'item', name: 'EMERALD', color: '#2ecc71' },
    { type: 'item', name: 'PETER RIVER', color: '#3498db' },
    { type: 'item', name: 'AMETHYST', color: '#9b59b6' },
    { type: 'heading', name: 'Heading #2', color: '#34495e'},
    { type: 'item', name: 'GREEN SEA', color: '#16a085' },
    { type: 'item', name: 'NEPHRITIS', color: '#27ae60' },
    { type: 'item', name: 'BELIZE HOLE', color: '#2980b9' },
    { type: 'item', name: 'ASBESTOS', color: '#7f8c8d' },
    { type: 'heading', name: 'Heading #3', color: '#8e44ad' },
    { type: 'item', name: 'MIDNIGHT BLUE', color: '#2c3e50' },
    { type: 'item', name: 'SUN FLOWER', color: '#f1c40f' },
    { type: 'item', name: 'CARROT', color: '#e67e22' },
    { type: 'item', name: 'POMEGRANATE', color: '#c0392b' },
    { type: 'heading', name: 'Heading #4', color: '#e74c3c' },
    { type: 'item', name: 'CLOUDS', color: '#ecf0f1' },
    { type: 'item', name: 'CONCRETE', color: '#95a5a6' },
    { type: 'item', name: 'ORANGE', color: '#f39c12' },
    { type: 'item', name: 'PUMPKIN', color: '#d35400' },
];

function itemTemplateSelector(item: any, index: number, items: any[]): string {
    return item.type;
}

const itemCellFactory = (item: any) => (
    <gridLayout rows="*, auto" backgroundColor={item.color} style={styles.item}>
        <stackLayout row={1}>
            <label text={item.name} style={styles.title} />
            <label text={item.color} style={styles.subtitle} />
        </stackLayout>
    </gridLayout>
);

const headingCellFactory = (item: any) => (
    <gridLayout rows="*, auto" backgroundColor={item.color} style={styles.item}>
        <label text={item.name} style={styles.title} />
    </gridLayout>
);


const cellFactories = new Map([
    [
        "item",
        {
            placeholderItem: {
                type: 'item', name: 'name', color: 'color'
            },
            cellFactory: itemCellFactory
        }
    ],

    [
        "heading",
        {
            placeholderItem: {
                type: 'heading', name: 'name', color: 'color'
            },
            cellFactory: headingCellFactory
        }
    ],
]);

export function SimpleTemplates() {
    return (
        <CollectionView 
            iosOverflowSafeArea={true} 
            items={items} 
            colWidth="50%" 
            rowHeight="200" 
            itemTemplateSelector={itemTemplateSelector}
            cellFactories={cellFactories}
            width="100%" 
            height="100%" 
        />
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