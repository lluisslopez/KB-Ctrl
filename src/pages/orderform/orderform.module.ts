import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Orderform } from './orderform';

@NgModule({
  declarations: [
    Orderform,
  ],
  imports: [
    IonicPageModule.forChild(Orderform),
  ],
  exports: [
    Orderform
  ]
})
export class OrderformModule {}
