import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class ColeccionModule {

  public cmc: string;
  public abbreviation: string[];
  public colors: string[];
  public colorIdentity: string[];
  public rarity: string[];
  public tipo: string;
  public subtipo: string;

  constructor( object: any) {
    this.cmc = (object.cmc) ? object.cmc : null;
    this.abbreviation = (object.ediciones) ? object.ediciones : null;
    this.colors = (object.colors) ? object.colors : null;
    this.colorIdentity = (object.colorIdentity) ? object.colorIdentity : null;
    this.rarity = (object.rarity) ? object.rarity : null;
    this.tipo = (object.tipo) ? object.tipo : null;
    this.subtipo = (object.subtipo) ? object.subtipo : null;
  }
 }
