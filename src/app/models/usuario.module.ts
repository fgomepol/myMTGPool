import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class UsuarioModule {
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public userName: string;
    public password: string;
    public provincia: string;
    public pais: string;
    public localidad: string;
    public cp: string;
 }
