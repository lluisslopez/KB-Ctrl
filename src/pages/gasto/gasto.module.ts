import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Gasto } from './gasto';

@NgModule({
  declarations: [
    Gasto,
  ],
  imports: [
    IonicPageModule.forChild(Gasto),
  ],
  exports: [
    Gasto
  ]
})
export class GastoModule {}
