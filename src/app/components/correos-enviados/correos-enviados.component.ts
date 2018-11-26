import { Component } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { ActivatedRoute } from '@angular/router';
import { MtgService } from '../../service/mtg.service';
import { MensajeModule } from '../../models/mensaje.module';

@Component({
  selector: 'app-correos-enviados',
  templateUrl: './correos-enviados.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class CorreosEnviadosComponent {

  public mensajeObtenido: MensajeModule;
  public remitente: string;
  public loading = false;
  public pantalla = 'mensajes';

  constructor(
    private storageService: StorageService,
    private routerActivated: ActivatedRoute,
    private servicio: MtgService
  ) {

    this.routerActivated.params.subscribe( params => {
      this.getMensaje( params['id']);
      this.loading = true;
    });
   }

  public getMensaje( id: number) {

    const remitente = this.storageService.getUsuario();
    this.servicio.obtenerMensajeEnviado(id, remitente).subscribe( data => {
        this.mensajeObtenido = JSON.parse(data['_body']);
        this.mensajeObtenido = this.mensajeObtenido[0];
    });
  }
}
