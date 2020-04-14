import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { VirtualTableComponent } from './virtual-table/virtual-table.component';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    CdkTableModule,
    MatTableModule,
    ScrollingModule,
  ],
  declarations: [ AppComponent, HelloComponent, VirtualTableComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
