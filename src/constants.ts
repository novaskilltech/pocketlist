import { Milk, ShoppingBasket, Bath, Apple, Croissant } from 'lucide-react';

const ITEM_KEYS = {
  dairy: ['item.milk', 'item.butter', 'item.salted_butter', 'item.cheese', 'item.yogurt', 'item.greek_yogurt', 'item.cream', 'item.liquid_cream', 'item.mascarpone', 'item.cottage_cheese'],
  grocery: ['item.pasta', 'item.rice', 'item.flour', 'item.sugar', 'item.olive_oil', 'item.cooking_oil', 'item.vegetable_oil', 'item.salt', 'item.pepper', 'item.coffee', 'item.tea', 'item.turmeric', 'item.paprika'],
  hygiene: ['item.soap', 'item.shampoo', 'item.toothpaste', 'item.toilet_paper', 'item.deodorant', 'item.paper_towels', 'item.laundry'],
  produce: ['item.apples', 'item.bananas', 'item.oranges', 'item.lemons', 'item.strawberries', 'item.potatoes', 'item.onions', 'item.garlic', 'item.carrots', 'item.tomatoes', 'item.zucchini', 'item.avocados', 'item.lettuce', 'item.peppers', 'item.mushrooms', 'item.broccoli'],
  bakery: ['item.white_bread', 'item.whole_bread', 'item.grain_bread', 'item.semi_bread', 'item.pastries', 'item.brioche', 'item.crackers'],
};

const CATEGORY_META = [
  { id: 'dairy', nameKey: 'cat.dairy', icon: Milk },
  { id: 'grocery', nameKey: 'cat.grocery', icon: ShoppingBasket },
  { id: 'hygiene', nameKey: 'cat.hygiene', icon: Bath },
  { id: 'produce', nameKey: 'cat.produce', icon: Apple },
  { id: 'bakery', nameKey: 'cat.bakery', icon: Croissant },
];

export function getEssentialsCategories(t: (key: string) => string) {
  return CATEGORY_META.map(cat => ({
    id: cat.id,
    name: t(cat.nameKey),
    icon: cat.icon,
    items: (ITEM_KEYS as any)[cat.id].map((key: string) => t(key)),
  }));
}
