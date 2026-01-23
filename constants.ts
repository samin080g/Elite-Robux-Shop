
import { GiftCard } from './types';

export const PAYMENT_NUMBERS = {
  Nagad: '01947249756',
  bKash: '01712474001'
};

export const GIFT_CARDS: GiftCard[] = [
  {
    id: 'gc-10',
    title: '$10 Roblox Gift Card',
    price: 1200,
    image: 'https://picsum.photos/400/250?random=10',
    description: 'Redeem for 800 Robux + Exclusive Virtual Item'
  },
  {
    id: 'gc-25',
    title: '$25 Roblox Gift Card',
    price: 2850,
    image: 'https://picsum.photos/400/250?random=25',
    description: 'Redeem for 2000 Robux + Exclusive Virtual Item'
  },
  {
    id: 'gc-50',
    title: '$50 Roblox Gift Card',
    price: 5600,
    image: 'https://picsum.photos/400/250?random=50',
    description: 'Redeem for 4500 Robux + Exclusive Virtual Item'
  }
];

export const ROBUX_RATE = 3.0; // Updated to 3 BDT per Robux
