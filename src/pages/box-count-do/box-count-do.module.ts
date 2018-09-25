import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoxCountDo } from './box-count-do';

@NgModule({
  declarations: [
    BoxCountDo,
  ],
  imports: [
    IonicPageModule.forChild(BoxCountDo),
  ],
  exports: [
    BoxCountDo
  ]
})
export class BoxCountDoModule {}
