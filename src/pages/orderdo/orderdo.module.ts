import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Orderdo } from './orderdo';

@NgModule({
  declarations: [
    Orderdo,
  ],
  imports: [
    IonicPageModule.forChild(Orderdo),
  ],
  exports: [
    Orderdo
  ]
})
export class OrderdoModule {}
