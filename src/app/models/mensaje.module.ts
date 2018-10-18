import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class MensajeModule {
    public cod: number;
    public remitente: string;
    public destinatario: string;
    public asunto: string;
    public mensaje: string;
    public fecha: number;
    public visto: string;
 }
