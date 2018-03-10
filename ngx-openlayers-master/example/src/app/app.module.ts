import {BrowserModule} from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AngularOpenlayersModule} from 'ngx-openlayers';

import { MapComponent } from "./map/map.component";

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularOpenlayersModule
  ],
  providers: [],
  bootstrap: [MapComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
