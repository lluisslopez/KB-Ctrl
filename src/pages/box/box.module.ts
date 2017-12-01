import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Box } from './box';

@NgModule({
  declarations: [
    Box,
  ],
  imports: [
    IonicPageModule.forChild(Box),
  ],
  exports: [
    Box
  ]
})
export class BoxModule {}
