import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Cierre } from './cierre';

@NgModule({
  declarations: [
    Cierre,
  ],
  imports: [
    IonicPageModule.forChild(Cierre),
  ],
  exports: [
    Cierre
  ]
})
export class CierreModule {}
