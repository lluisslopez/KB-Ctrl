import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoxCountForm } from './box-count-form';

@NgModule({
  declarations: [
    BoxCountForm,
  ],
  imports: [
    IonicPageModule.forChild(BoxCountForm),
  ],
  exports: [
    BoxCountForm
  ]
})
export class BoxCountFormModule {}
