import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isInventoryOpened = false;

  // Кнопочка открытия/закрытия инвентаря
  toggleInventory() {
    this.isInventoryOpened = !this.isInventoryOpened;
  }
}
