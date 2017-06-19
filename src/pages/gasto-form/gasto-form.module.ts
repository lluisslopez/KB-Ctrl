import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GastoForm } from './gasto-form';

@NgModule({
  declarations: [
    GastoForm,
  ],
  imports: [
    IonicPageModule.forChild(GastoForm),
  ],
  exports: [
    GastoForm
  ]
})
export class GastoFormModule {}
