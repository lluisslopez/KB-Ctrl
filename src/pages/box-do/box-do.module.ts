import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoxDo } from './box-do';

@NgModule({
  declarations: [
    BoxDo,
  ],
  imports: [
    IonicPageModule.forChild(BoxDo),
  ],
  exports: [
    BoxDo
  ]
})
export class BoxDoModule {}
