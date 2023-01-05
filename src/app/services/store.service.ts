import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INVENTORY_ITEM } from '../common/types';

// Псевдо сервис для эмуляции загрузки и сохранения инвентаря

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  #inventoryItems: INVENTORY_ITEM[] = [
    {
      slotId: 1,
      itemId: 1,
      name: 'Яблоко',
      description: 'Это просто яблоко)',
      amount: 1,
      image: '/assets/apple.png',
      additionalValue: 0,
    },
    {
      slotId: 2,
      itemId: 1,
      name: 'Яблоко',
      description: 'Это просто яблоко)',
      amount: 5,
      image: '/assets/apple.png',
      additionalValue: 1,
    },
    {
      slotId: 6,
      itemId: 2,
      name: 'Снежок',
      description: 'Зима - время лепить снежки',
      amount: 7,
      image: '/assets/snowball.png',
      additionalValue: 0,
    },
    {
      slotId: 13,
      itemId: 3,
      name: 'Яйцо',
      description: 'Внимательно присмотрись, вдруг твоё )',
      amount: 3,
      image: '/assets/egg.png',
      additionalValue: 0,
    },
    {
      slotId: 23,
      itemId: 3,
      name: 'Яйцо',
      description: 'Внимательно присмотрись, вдруг твоё )',
      amount: 17,
      image: '/assets/egg.png',
      additionalValue: 3,
    },
    {
      slotId: 30,
      itemId: 4,
      name: 'Картофель',
      description: 'Что может быть вкуснее за бабушкину картошку?',
      amount: 3,
      image: '/assets/potato.png',
      additionalValue: 10,
    },
    {
      slotId: 9,
      itemId: 2,
      name: 'Снежок',
      description: 'Зима - время лепить снежки',
      amount: 22,
      image: '/assets/snowball.png',
      additionalValue: 0,
    },
    {
      slotId: 25,
      itemId: 4,
      name: 'Картофель',
      description: 'Что может быть вкуснее за бабушкину картошку?',
      amount: 22,
      image: '/assets/potato.png',
      additionalValue: 0,
    },
    {
      slotId: 17,
      itemId: 5,
      name: 'Фейерверк',
      description: 'Запускай и лети на луну',
      amount: 6,
      image: '/assets/firework.png',
      additionalValue: 0,
    },
    {
      slotId: 11,
      itemId: 5,
      name: 'Фейерверк',
      description: 'Запускай и лети на луну',
      amount: 63,
      image: '/assets/firework.png',
      additionalValue: 0,
    },
  ];

  constructor() {}

  getInventoryItems() {
    const observer = new Observable<INVENTORY_ITEM[]>((subscriber) => {
      subscriber.next(this.#inventoryItems);
      subscriber.complete();
    });

    return observer;
  }

  saveInventoryItems(items: INVENTORY_ITEM[]) {
    this.#inventoryItems = items;
  }
}
