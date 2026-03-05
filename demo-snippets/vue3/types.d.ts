export interface Card {
    id: number;
    name: string;
    number: string;
    bg: string;
    imgType: string;
    backgroundColor: string;
    expanded?: boolean;
}

export interface Transaction {
    id: number;
    title: string;
    subTitle: string;
    date: Date;
    image: string;
    price: number;
}

export interface ListItem<T = any> {
    item: T;
    index: number;
    even: boolean;
    odd: boolean;
}

export interface AnimateOptions {
    translate?: { x?: number; y?: number };
    rotation?: number;
    alpha?: number;
}
