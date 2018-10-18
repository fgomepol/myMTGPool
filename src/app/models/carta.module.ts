import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class CartaModule {

  public idUsuario: string;
  public estado: string;
  public cantidad: string;
  public foil: string;
  public signed: string;
  public idioma: string;
}
