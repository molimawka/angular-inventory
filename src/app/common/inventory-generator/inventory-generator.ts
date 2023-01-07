import { AVAILABLE_ITEMS, Empty } from './items';
import { STORE_INVENTORY_ITEM, STORE_INVENTORY } from '../types';

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateInventory(maxSlots: number): STORE_INVENTORY {
  const inventory: STORE_INVENTORY = [];

  const emptySlots = Math.ceil(maxSlots * 0.6);
  const freeSlots = maxSlots - emptySlots;

  const availableSlots: number[] = [];
  for (let i = 0; i < maxSlots; i++) {
    availableSlots.push(i);
  }

  for (let i = 0; i < emptySlots; i++) {
    const availableSlotIndex = generateRandomNumber(
      0,
      availableSlots.length - 1
    );
    availableSlots.splice(availableSlotIndex, 1);
  }

  const items = AVAILABLE_ITEMS.filter((item) => item.itemId !== Empty.itemId);

  for (let i = 0; i < freeSlots; i++) {
    const availableSlotIndex = generateRandomNumber(
      0,
      availableSlots.length - 1
    );

    const slotId = availableSlots[availableSlotIndex];
    availableSlots.splice(availableSlotIndex, 1);

    const item = items[generateRandomNumber(0, items.length - 1)];

    const amount = generateRandomNumber(1, 64);

    const itemObject: STORE_INVENTORY_ITEM = {
      ...item,
      amount,
    };

    const enchantedItem = generateRandomNumber(1, 100);
    if (enchantedItem >= 70) {
      const additionalValue = generateRandomNumber(1, 255);
      itemObject.additionalValue = additionalValue;
    }

    inventory.push({ slotId, item: itemObject });
  }

  return inventory;
}
