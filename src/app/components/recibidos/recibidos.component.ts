import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { AuthenticationService } from '../../service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MtgService } from '../../service/mtg.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MensajeModule } from '../../models/mensaje.module';

@Component({
  selector: 'app-recibidos',
  templateUrl: './recibidos.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class RecibidosComponent implements OnInit {

  public datosUsuario: any;
  public mensajeObtenido: MensajeModule;
  public nMensajes: any;
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

  ngOnInit() {
  }

  public getMensaje( id: number) {

    const remitente = this.storageService.getUsuario();
    this.servicio.obtenerMensaje(id, remitente).subscribe( data => {
        this.mensajeObtenido = JSON.parse(data['_body']);
        this.mensajeObtenido = this.mensajeObtenido[0];
    });
  }

  public marcarLeido(id: number, visto: string) {
    this.servicio.marcarLeido(id, visto).subscribe( data => {
      this.getMensaje(id);

      this.servicio.correosNoLeidos(this.remitente).subscribe( data2 => {
        this.datosUsuario = data2.json();
        this.nMensajes =  this.datosUsuario[0].nMails;
      });
    });
  }
}
