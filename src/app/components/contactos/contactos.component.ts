import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class ContactosComponent implements OnInit {

  public forma2: FormGroup;
  public formularioRelleno = false;
  public searching = false;
  public eliminado = false;
  public users: any = [];
  public remitente: number;
  public pantalla = 'mensajes';
  public errorBusqueda = false;
  public errorInsercion = false;
  public contactos: any = [];

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {

    this.forma2 = new FormGroup({
      'contacto': new FormControl('', Validators.required),
      'remitente': new FormControl('', Validators.required)
    });

    this.users = this.storageService.loadDestinatario();
   }

  ngOnInit() {

    this.remitente = this.storageService.getCurrentUser();

    this.forma2.setValue({
      remitente : this.remitente,
      contacto: ''
    });

    this.listadoContactos();
  }

  public guardarMensaje() {

    this.servicio.guardarContacto( this.forma2.value ).subscribe( data => {

      if (JSON.parse(data['_body'])['error'] === 1) {
        this.errorInsercion = false;
        this.errorBusqueda = true;
        this.formularioRelleno = false;
        this.eliminado = false;
      } else if (JSON.parse(data['_body'])['error'] === 2) {
        this.errorInsercion = true;
        this.errorBusqueda = false;
        this.formularioRelleno = false;
        this.eliminado = false;
      } else {
        this.errorBusqueda = false;
        this.errorInsercion = false;
        this.eliminado = false;
        this.forma2.setValue({
          remitente: this.remitente,
          contacto : '',
        });
        this.formularioRelleno = true;

        this.listadoContactos();
      }
    }, error => console.error(error));
  }

  public listadoContactos() {
    this.servicio.listadoContactos( this.remitente ).subscribe( data => {
      this.contactos = JSON.parse(data['_body']);
    });
  }

  public eliminarContacto(id: number) {
    this.servicio.eliminarContacto( this.remitente, id ).subscribe( data => {

      this.listadoContactos();
      this.eliminado = true;
      this.errorInsercion = false;
      this.errorBusqueda = false;
      this.formularioRelleno = false;
    });
  }
}
