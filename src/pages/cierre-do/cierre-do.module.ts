import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CierreDo } from './cierre-do';

@NgModule({
  declarations: [
    CierreDo,
  ],
  imports: [
    IonicPageModule.forChild(CierreDo),
  ],
  exports: [
    CierreDo
  ]
})
export class CierreDoModule {}
