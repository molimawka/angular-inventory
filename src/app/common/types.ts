export type STORE_INVENTORY_ITEM = {
  itemId: number;
  name: string;
  description: string;
  amount: number;
  image: string;
  additionalValue?: number;
};

export type STORE_INVENTORY = {
  slotId: number;
  item: STORE_INVENTORY_ITEM;
}[];

export type INVENTORY_ITEM = { slotId: number } & STORE_INVENTORY_ITEM;
