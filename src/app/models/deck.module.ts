import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class DeckModule {
  public UID: number;
  public name: string;
  public cantidad: number;
  public side: number;
  public tipo: string;
  public color: string;
  public rareza: string;
  public cmc: string;
  public importeEx: number;
  public importeNm: number;
 }
