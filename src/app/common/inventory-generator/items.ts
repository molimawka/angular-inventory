type Item = {
  itemId: number;
  name: string;
  description: string;
  image: string;
};

export enum ITEMS_IDENTIFICATORS {
  EMPTY = -1,
  APPLE,
  SNOWBALL,
  EGG,
  POTATO,
  FIREWORK,
}

export const Empty: Item = {
  itemId: ITEMS_IDENTIFICATORS.EMPTY,
  name: '',
  description: '',
  image: '',
};

export const Apple: Item = {
  itemId: ITEMS_IDENTIFICATORS.APPLE,
  name: 'Яблоко',
  description: 'Это просто яблоко)',
  image: '/assets/apple.png',
};

export const Snowball: Item = {
  itemId: ITEMS_IDENTIFICATORS.SNOWBALL,
  name: 'Снежок',
  description: 'Зима - время лепить снежки',
  image: '/assets/snowball.png',
};

export const Egg: Item = {
  itemId: ITEMS_IDENTIFICATORS.EGG,
  name: 'Яйцо',
  description: 'Внимательно присмотрись, вдруг твоё )',
  image: '/assets/egg.png',
};

export const Potato: Item = {
  itemId: ITEMS_IDENTIFICATORS.POTATO,
  name: 'Картофель',
  description: 'Что может быть вкуснее за бабушкину картошку?',
  image: '/assets/potato.png',
};

export const Firework: Item = {
  itemId: ITEMS_IDENTIFICATORS.FIREWORK,
  name: 'Фейерверк',
  description: 'Запускай и лети на луну',
  image: '/assets/firework.png',
};

export const AVAILABLE_ITEMS: Item[] = [
  Empty,
  Apple,
  Snowball,
  Egg,
  Potato,
  Firework,
];
