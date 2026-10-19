import * as React from 'react';
import { CollectionView } from '@nativescript-community/ui-collectionview/react';
import { GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureState, GestureStateEventData, GestureTouchEventData, HandlerType, Manager } from '@nativescript-community/gesturehandler';
import { GridLayout } from '@nativescript/core';
import { NSVElement, StyleSheet } from 'react-nativescript';
import { FontWeight } from '@nativescript/core/ui/styling/font';

const items = [
    { name: 'TURQUOISE', color: '#1abc9c' },
    { name: 'EMERALD', color: '#2ecc71' },
    { name: 'PETER RIVER', color: '#3498db' },
    { name: 'AMETHYST', color: '#9b59b6' },
    { name: 'WET ASPHALT', color: '#34495e' },
    { name: 'GREEN SEA', color: '#16a085' },
    { name: 'NEPHRITIS', color: '#27ae60' },
    { name: 'BELIZE HOLE', color: '#2980b9' },
    { name: 'WISTERIA', color: '#8e44ad' },
    { name: 'MIDNIGHT BLUE', color: '#2c3e50' },
    { name: 'SUN FLOWER', color: '#f1c40f' },
    { name: 'CARROT', color: '#e67e22' },
    { name: 'ALIZARIN', color: '#e74c3c' },
    { name: 'CLOUDS', color: '#ecf0f1' },
    { name: 'CONCRETE', color: '#95a5a6' },
    { name: 'ORANGE', color: '#f39c12' },
    { name: 'PUMPKIN', color: '#d35400' },
    { name: 'POMEGRANATE', color: '#c0392b' },
    { name: 'SILVER', color: '#bdc3c7' },
    { name: 'ASBESTOS', color: '#7f8c8d' }
];

interface Item {
    name: string;
    color: string;
}

// unique handler tag per cell view; cell views (and their gesture handlers) are only
// created/attached once and reused across item recycling, so collisions are not a concern
let handlerTag = 90000;

function GestureCell({ item }: { item: Item }) {
    const ref = React.useRef<NSVElement<GridLayout>>(null);
    const [state, setState] = React.useState('UNDETERMINED');
    const [touchCount, setTouchCount] = React.useState(0);

    React.useEffect(() => {
        const view = ref.current?.nativeView;
        if (!view) {
            return;
        }

        const gestureHandler = Manager.getInstance().createGestureHandler(HandlerType.TAP, handlerTag++, {
            shouldCancelWhenOutside: false
        });

        function onGestureTouch(args: GestureTouchEventData) {
            console.log('onGestureTouch', view.id, args.data.state);
            setTouchCount((c) => c + 1);
        }
        function onGestureState(args: GestureStateEventData) {
            const { state: newState, prevState, extraData } = args.data;
            console.log('onGestureState', view.id, newState, prevState, extraData);
            setState(GestureState[newState]);
        }

        gestureHandler.on(GestureHandlerTouchEvent, onGestureTouch);
        gestureHandler.on(GestureHandlerStateEvent, onGestureState);
        gestureHandler.attachToView(view);

        return () => {
            gestureHandler.off(GestureHandlerTouchEvent, onGestureTouch);
            gestureHandler.off(GestureHandlerStateEvent, onGestureState);
            gestureHandler.detachFromView(view);
        };
    }, []);

    return (
        <gridLayout ref={ref} id={item.name} rows="*, auto, auto" backgroundColor={item.color} style={styles.item}>
            <stackLayout row={1}>
                <label text={item.name} style={styles.title} />
                <label text={`state: ${state}`} style={styles.subtitle} />
                <label text={`touches: ${touchCount}`} style={styles.subtitle} />
            </stackLayout>
        </gridLayout>
    );
}

const cellFactory = (item: Item) => <GestureCell item={item} />;

export function GestureHandlerTest() {
    return <CollectionView items={items} colWidth="50%" rowHeight="150" cellFactory={cellFactory} width="100%" height="100%" />;
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
        fontSize: 13
    }
});
