import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BoxCount } from './box-count';

@NgModule({
  declarations: [
    BoxCount,
  ],
  imports: [
    IonicPageModule.forChild(BoxCount),
  ],
  exports: [
    BoxCount
  ]
})
export class BoxCountModule {}
