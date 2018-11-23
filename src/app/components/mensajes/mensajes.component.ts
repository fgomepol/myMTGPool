import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';
import { MensajeModule } from '../../models/mensaje.module';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    './mensajes.component.css'
]
})
export class MensajesComponent implements OnInit {

  public user: number;
  public datosUsuario: any;
  public mensajes: MensajeModule[];
  public remitente: string;
  public pantalla = 'mensajes';

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {
   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.servicio.datosUsuario(this.user).subscribe( data => {

      this.datosUsuario = data.json();

      for (const item of this.datosUsuario) {
        this.servicio.listadoMensajes(item.userName).subscribe( data2 => {
          this.mensajes = data2.json();
        });
      }
    });
  }
}
