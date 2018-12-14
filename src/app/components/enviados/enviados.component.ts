import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';
import { MensajeModule } from '../../models/mensaje.module';

@Component({
  selector: 'app-enviados',
  templateUrl: './enviados.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../mensajes/mensajes.component.css'
]
})
export class EnviadosComponent implements OnInit {

  public user: number;
  public datosUsuario: any;
  public mensajes: MensajeModule[];
  public pantalla = 'mensajes';
  public loading = true;
  public texto = 'Cargando mensajes, por favor espere';

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
        this.servicio.listadoMensajesEnviados(item.userName).subscribe( data2 => {
          this.mensajes = data2.json();
          this.loading = false;
        });
      }
    });
  }
}
