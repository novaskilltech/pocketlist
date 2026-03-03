import { Milk, ShoppingBasket, Bath, Apple, Croissant } from 'lucide-react';

export const ESSENTIALS_CATEGORIES = [
  {
    id: 'dairy',
    name: 'Produits Laitiers',
    icon: Milk,
    items: ['Lait', 'Beurre', 'Beurre salé', 'Fromage', 'Yaourts', 'Yaourt grec', 'Crème fraîche', 'Crème liquide', 'Mascarpone', 'Fromage blanc']
  },
  {
    id: 'grocery',
    name: 'Épicerie',
    icon: ShoppingBasket,
    items: ['Pâtes', 'Riz', 'Farine', 'Sucre', 'Huile d\'olive', 'Huile de cuisson', 'Huile végétale', 'Sel', 'Poivre', 'Café', 'Thé', 'Curcuma', 'Paprika']
  },
  {
    id: 'hygiene',
    name: 'Hygiène',
    icon: Bath,
    items: ['Savon', 'Shampoing', 'Dentifrice', 'Papier toilette', 'Déodorant', 'Essuie-tout', 'Lessive liquide']
  },
  {
    id: 'produce',
    name: 'Fruits & Légumes',
    icon: Apple,
    items: ['Pommes', 'Bananes', 'Oranges', 'Citrons', 'Fraises', 'Pommes de terre', 'Oignons', 'Ail', 'Carottes', 'Tomates', 'Courgettes', 'Avocats', 'Salade', 'Poivrons', 'Champignons', 'Brocoli']
  },
  {
    id: 'bakery',
    name: 'Boulangerie',
    icon: Croissant,
    items: ['Pain blanc', 'Pain complet', 'Pain aux céréales', 'Pain mi-blanc', 'Viennoiseries', 'Brioche', 'Biscottes']
  }
];
