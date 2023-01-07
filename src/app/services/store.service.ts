import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { STORE_INVENTORY } from '../common/types';
import { generateInventory } from '../common/inventory-generator/inventory-generator';

// Псевдо сервис для эмуляции загрузки и сохранения инвентаря

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  // Максимальное кол-во слотов инвентаря. Лучше конечно это кол-во получать с сервера.
  maxSlots = 32;

  #inventoryItems: STORE_INVENTORY = generateInventory(this.maxSlots);

  getInventoryItems() {
    const observer = new Observable<STORE_INVENTORY>((subscriber) => {
      subscriber.next(this.#inventoryItems);
      subscriber.complete();
    });

    return observer;
  }

  saveInventoryItems(items: STORE_INVENTORY) {
    this.#inventoryItems = items;
  }
}
