import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoxForm } from './box-form';

@NgModule({
  declarations: [
    BoxForm,
  ],
  imports: [
    IonicPageModule.forChild(BoxForm),
  ],
  exports: [
    BoxForm
  ]
})
export class BoxFormModule {}
