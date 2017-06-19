import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CierreForm } from './cierre-form';

@NgModule({
  declarations: [
    CierreForm,
  ],
  imports: [
    IonicPageModule.forChild(CierreForm),
  ],
  exports: [
    CierreForm
  ]
})
export class CierreFormModule {}
