import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { INVENTORY_ITEM } from '../common/types';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit, OnDestroy {
  // Максимальное кол-во слотов инвентаря. Лучше конечно это кол-во получать с сервера.
  maxSlotsInInventory = 32;

  // Максимальное кол-во айтема в одном слоте
  maxItemInStack = 64;

  // Массив с айтемами
  items: INVENTORY_ITEM[] = [];

  // Айтем на котором было клацнуто пкмом)
  contextMenuSelectedItem: INVENTORY_ITEM | undefined;

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
    for (let i = 0; i < this.maxSlotsInInventory; i++) {
      this.items[i] = {
        slotId: i,
        ...this.emptyItem,
      };
    }

    // Получаем информацию про инвентарь с сервера
    this.storeService.getInventoryItems().subscribe((items) => {
      for (const item of items) {
        this.items[item.slotId] = { ...item };
      }
    });
  }

  ngOnDestroy() {
    // При дестрое компонента сохраняем инвентарь и "шлем" инфу на сервер
    this.storeService.saveInventoryItems(this.items);

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
      prevItem?.additionalValue === currentItem?.additionalValue &&
      prevItem.amount + currentItem.amount <= this.maxItemInStack
    ) {
      currentItem.amount += prevItem.amount;
      this.items[prevItem.slotId] = {
        slotId: prevItem.slotId,
        ...this.emptyItem,
      };
      return;
    }

    // В другом же случаи просто меняем айтемы местами
    const copyPrevItem = { ...prevItem, slotId: currentItem.slotId };
    this.items[prevItem.slotId] = { ...currentItem, slotId: prevItem.slotId };
    this.items[currentItem.slotId] = copyPrevItem;
  }

  // Для отключения тултипа
  onDragStarted() {
    this.isDragging = true;
  }

  // Для включения тултипа
  onDragEnded() {
    this.isDragging = false;
  }

  // Хендлер открытия контекстного меню
  onContextMenu(event: MouseEvent, item: INVENTORY_ITEM) {
    event.preventDefault();

    this.contextMenuSelectedItem = item;
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
    if (!this.contextMenuSelectedItem) return;
    if (this.contextMenuSelectedItem.itemId === -1) return;

    const item = this.contextMenuSelectedItem;
    if (item.amount <= 1) return;

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

    this.contextMenuSelectedItem = undefined;
  }

  // Удаление айтема
  destroySelectedItem() {
    if (!this.contextMenuSelectedItem) return;
    if (this.contextMenuSelectedItem.itemId === -1) return;

    const item = this.contextMenuSelectedItem;
    this.items[item.slotId] = {
      slotId: item.slotId,
      ...this.emptyItem,
    };

    this.contextMenuSelectedItem = undefined;
  }
}
