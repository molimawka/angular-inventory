import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InventoryComponent } from './inventory/inventory.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ItemComponent } from './item/item.component';

@NgModule({
  declarations: [AppComponent, InventoryComponent, ItemComponent],
  imports: [BrowserModule, BrowserAnimationsModule, DragDropModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
