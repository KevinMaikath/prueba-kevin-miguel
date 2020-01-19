import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {HomePageRoutingModule} from './home-routing.module';

import {HomePage} from './home.page';

import {Camera} from '@ionic-native/camera/ngx';
import {DetailsModalComponent} from './details-modal/details-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, DetailsModalComponent],
  providers: [Camera],
  entryComponents: [DetailsModalComponent]
})
export class HomePageModule {
}
