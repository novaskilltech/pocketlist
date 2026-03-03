import { Milk, ShoppingBasket, Bath, Apple, Croissant } from 'lucide-react';

const ITEM_KEYS = {
  dairy: [
    'item.milk', 'item.butter', 'item.salted_butter', 'item.cheese',
    'item.yogurt', 'item.greek_yogurt', 'item.cream', 'item.liquid_cream',
    'item.mascarpone', 'item.cottage_cheese',
    'item.mozzarella', 'item.parmesan', 'item.gouda', 'item.feta',
    'item.cheddar', 'item.goat_cheese', 'item.cream_cheese',
    'item.whipped_cream', 'item.condensed_milk', 'item.ricotta',
  ],
  grocery: [
    'item.pasta', 'item.rice', 'item.flour', 'item.sugar',
    'item.olive_oil', 'item.cooking_oil', 'item.vegetable_oil',
    'item.salt', 'item.pepper', 'item.coffee', 'item.tea',
    'item.turmeric', 'item.paprika',
    'item.vinegar', 'item.soy_sauce', 'item.mustard', 'item.ketchup',
    'item.honey', 'item.jam', 'item.canned_tomatoes', 'item.chickpeas',
    'item.lentils', 'item.cornstarch',
  ],
  hygiene: [
    'item.soap', 'item.shampoo', 'item.toothpaste', 'item.toilet_paper',
    'item.deodorant', 'item.paper_towels', 'item.laundry',
    'item.conditioner', 'item.body_wash', 'item.razor',
    'item.cotton_pads', 'item.tissues', 'item.sunscreen',
    'item.moisturizer', 'item.dental_floss', 'item.mouthwash',
    'item.hand_soap',
  ],
  produce: [
    'item.apples', 'item.bananas', 'item.oranges', 'item.lemons',
    'item.strawberries', 'item.potatoes', 'item.onions', 'item.garlic',
    'item.carrots', 'item.tomatoes', 'item.zucchini', 'item.avocados',
    'item.lettuce', 'item.peppers', 'item.mushrooms', 'item.broccoli',
    'item.cucumber', 'item.spinach', 'item.eggplant', 'item.pears',
    'item.grapes', 'item.mango', 'item.pineapple', 'item.celery',
    'item.ginger', 'item.mint',
  ],
  bakery: [
    'item.white_bread', 'item.whole_bread', 'item.grain_bread',
    'item.semi_bread', 'item.pastries', 'item.brioche', 'item.crackers',
    'item.baguette', 'item.rye_bread', 'item.croissant',
    'item.pain_au_chocolat', 'item.muffin', 'item.cookies',
    'item.pita_bread', 'item.flatbread', 'item.cake', 'item.donut',
  ],
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
