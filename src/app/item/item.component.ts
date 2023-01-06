import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent {
  @Input('id') itemId!: number;
  @Input('name') name!: string;
  @Input('description') description!: string;
  @Input('amount') amount!: number;
  @Input('image') image!: string;
  @Input('additionalValue') additionalValue: number | undefined;
  @Input('disableTooltip') disableTooltip: boolean = false;
  @Input('enchanted') enchanted: boolean = false;
}
