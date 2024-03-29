import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  INVENTORY_ITEM,
  STORE_INVENTORY,
  STORE_INVENTORY_ITEM,
} from '../common/types';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit, OnDestroy {
  // Максимальное кол-во айтема в одном слоте
  maxItemInStack = 64;

  // Массив с айтемами
  items: INVENTORY_ITEM[] = [];

  // Айтем на котором было клацнуто пкмом)
  contextMenuSelectedSlotId: number | undefined;

  emptyItem = {
    itemId: -1,
    name: '',
    description: '',
    amount: -1,
    image: '',
  };

  // Если айтем перемещают по инвентарю то не надо показывать тултип
  isDragging = false;

  // Опции для контекстного меню
  contextmenu = {
    opened: false,
    x: '0px',
    y: '0px',
  };

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    // При создании компонента "загружаем" массив "пустыми" айтемами
    for (let i = 0; i < this.storeService.maxSlots; i++) {
      this.items[i] = {
        slotId: i,
        ...this.emptyItem,
      };
    }

    // Получаем информацию про инвентарь с сервера
    this.storeService.getInventoryItems().subscribe((store) => {
      for (const item of store) {
        this.items[item.slotId] = { ...item.item, slotId: item.slotId };
      }
    });
  }

  ngOnDestroy() {
    // При дестрое компонента сохраняем инвентарь и "шлем" инфу на сервер
    const inventoryDataForStore: STORE_INVENTORY = [];
    this.items.forEach((item) => {
      if (item.itemId !== -1) {
        const itemInStoreFormat: STORE_INVENTORY_ITEM = {
          itemId: item.itemId,
          name: item.name,
          description: item.description,
          image: item.image,
          amount: item.amount,
        };

        if (typeof item.additionalValue === 'number') {
          itemInStoreFormat.additionalValue = item.additionalValue;
        }
        inventoryDataForStore.push({
          slotId: item.slotId,
          item: itemInStoreFormat,
        });
      }
    });

    this.storeService.saveInventoryItems(inventoryDataForStore);

    // И на всякий чистим массив с айтемами
    this.items = [];
  }

  onDragDropped(event: CdkDragDrop<INVENTORY_ITEM>) {
    // Проверка что айтем не дропнут за инвентарем
    // Можно сделать чтобы если айтем дропнут за инвентарем то вывдить диалог с удалением айтема
    if (!event.isPointerOverContainer) return;

    const prevItem = event.previousContainer.data;
    const currentItem = event.container.data;

    // Если взяли айтем и положили его в то же место то зачем что-то дальше делать ?)
    if (prevItem.slotId === currentItem.slotId) return;

    // Если айтемы одинаковые и их опциональное значение одинаковое то стакаем их
    if (
      prevItem.itemId === currentItem.itemId &&
      prevItem?.additionalValue === currentItem?.additionalValue
    ) {
      // Вычисляем насколько переполненится стак
      const stackOverflow =
        currentItem.amount + prevItem.amount - this.maxItemInStack;

      /**
       * Если переполение больше 0 то в одну ячейку записываем максимальное кол-во в стаке
       * В другую ячейку Записываем переполение
       *
       * Иначе складываем два предмета в один
       */
      if (stackOverflow > 0) {
        currentItem.amount = this.maxItemInStack;
        prevItem.amount = stackOverflow;
      } else {
        currentItem.amount += prevItem.amount;
        this.items[prevItem.slotId] = {
          slotId: prevItem.slotId,
          ...this.emptyItem,
        };
      }
      return;
    }

    // В другом же случаи просто меняем айтемы местами

    const copyPrevItemSlotId = prevItem.slotId;
    prevItem.slotId = currentItem.slotId;
    currentItem.slotId = copyPrevItemSlotId;

    this.items[currentItem.slotId] = currentItem;
    this.items[prevItem.slotId] = prevItem;
  }

  // Для отключения тултипа
  onDragStarted() {
    this.isDragging = true;
    if (this.contextmenu.opened) {
      this.contextmenu.opened = false;
    }
  }

  // Для включения тултипа
  onDragEnded() {
    this.isDragging = false;
  }

  // Хендлер открытия контекстного меню
  onContextMenu(event: MouseEvent, slotId: number) {
    event.preventDefault();

    this.contextMenuSelectedSlotId = slotId;
    this.contextmenu.x = event.clientX + 'px';
    this.contextmenu.y = event.clientY + 'px';
    this.contextmenu.opened = true;
  }

  // Хендлеры для закрытия контекстного меню при сроклле или клике
  @HostListener('window:click')
  @HostListener('window:scroll')
  listenerForContextMenu() {
    if (!this.contextmenu.opened) return;
    this.contextmenu.opened = false;
  }

  // Разделка предметов
  unstackSelectedItem() {
    if (this.contextMenuSelectedSlotId === undefined) return;

    const item = this.items[this.contextMenuSelectedSlotId];
    if (item.itemId === -1 || item.amount <= 1) return;

    const unstackAmount = Math.floor(item.amount / 2);
    if (unstackAmount < 1 || item.amount - unstackAmount < 1) return;

    const freeSlot = this.items.find((item) => item.itemId === -1);
    if (!freeSlot) return;

    item.amount -= unstackAmount;
    this.items[freeSlot.slotId] = {
      ...item,
      slotId: freeSlot.slotId,
      amount: unstackAmount,
    };

    this.contextMenuSelectedSlotId = undefined;
  }

  // Удаление айтема
  destroySelectedItem() {
    if (this.contextMenuSelectedSlotId === undefined) return;

    const item = this.items[this.contextMenuSelectedSlotId];
    if (item.itemId === -1) return;

    this.items[item.slotId] = {
      slotId: item.slotId,
      ...this.emptyItem,
    };

    this.contextMenuSelectedSlotId = undefined;
  }
}
