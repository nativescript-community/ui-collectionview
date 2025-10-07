import { Card, Transaction } from './types';

export const HEIGH_CARD = 220;

export const dataCards: Card[] = [
    {
        id: 1,
        name: 'Justine',
        number: '***** **** 0978',
        backgroundColor: 'red',
        bg: 'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(245,144,2,1) 100%)',
        imgType: '~/assets/master-card.png'
    },
    {
        id: 2,
        name: 'Jenna',
        number: '***** **** 5782',
        backgroundColor: 'green',
        bg: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
        imgType: '~/assets/visa-card.png'
    },
    {
        id: 3,
        name: 'Jessica',
        number: '***** **** 1093',
        backgroundColor: 'blue',
        bg: 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
        imgType: '~/assets/master-card.png'
    },
    {
        id: 4,
        name: 'Justine',
        number: '***** **** 0978',
        backgroundColor: 'rgba(0,58,180,1)',
        bg: 'linear-gradient(90deg, rgba(0,58,180,1) 0%, rgba(0,29,29,1) 50%, rgba(0,144,2,1) 100%)',
        imgType: '~/assets/master-card.png'
    },
    {
        id: 5,
        name: 'Jenna',
        number: '***** **** 5782',
        backgroundColor: 'rgba(2,100,36,1)',
        bg: 'linear-gradient(90deg, rgba(2,100,36,1) 0%, rgba(9,109,121,1) 35%, rgba(0,212,255,1) 100%)',
        imgType: '~/assets/visa-card.png'
    },
    {
        id: 6,
        name: 'Jessica',
        number: '***** **** 1093',
        backgroundColor: 'rgba(134,193,195,1)',
        bg: 'linear-gradient(0deg, rgba(134,193,195,1) 0%, rgba(253,187,145,1) 100%)',
        imgType: '~/assets/master-card.png'
    }
];

export const transactions: Transaction[] = [
    {
        id: 1,
        title: 'Amazon',
        subTitle: 'Groceries',
        date: new Date(),
        image: '~/assets/list/amazon.png',
        price: 100
    },
    {
        id: 2,
        title: 'Apple',
        subTitle: 'Electronics',
        date: new Date(),
        image: '~/assets/list/apple.png',
        price: 200
    },
    {
        id: 3,
        title: 'Dribbble',
        subTitle: 'Design',
        date: new Date(),
        image: '~/assets/list/dribble.png',
        price: 50
    },
    {
        id: 4,
        title: 'GitHub',
        subTitle: 'Code',
        date: new Date(),
        image: '~/assets/list/github.png',
        price: 75
    },
    {
        id: 5,
        title: 'Instagram',
        subTitle: 'Social Media',
        date: new Date(),
        image: '~/assets/list/instagram.png',
        price: 150
    },
    {
        id: 6,
        title: 'Figma',
        subTitle: 'Design Tool',
        date: new Date(),
        image: '~/assets/list/figma.png',
        price: 120
    },
    {
        id: 7,
        title: 'Twitter',
        subTitle: 'Social Media',
        date: new Date(),
        image: '~/assets/list/twitter.png',
        price: 90
    },
    {
        id: 8,
        title: 'Spotify',
        subTitle: 'Music Streaming',
        date: new Date(),
        image: '~/assets/list/spotify.png',
        price: 60
    },
    {
        id: 9,
        title: 'Netflix',
        subTitle: 'Video Streaming',
        date: new Date(),
        image: '~/assets/list/netflix.png',
        price: 80
    },
    {
        id: 10,
        title: 'Dropbox',
        subTitle: 'Cloud Storage',
        date: new Date(),
        image: '~/assets/list/dropbox.png',
        price: 55
    }
];
