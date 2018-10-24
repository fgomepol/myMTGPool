import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class MailComponent implements OnInit {

  public forma2: FormGroup;
  public formularioRelleno = false;
  public searching = false;
  public users: any = [];
  public remitente: string;
  public pantalla = 'mensajes';

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {

    this.forma2 = new FormGroup({
      'destinatario': new FormControl('', Validators.required),
      'asunto': new FormControl('', Validators.required),
      'mensaje': new FormControl('', Validators.required),
      'remitente': new FormControl('', Validators.required)
    });

    this.listadoContactos();
   }

  ngOnInit() {

    this.remitente = this.storageService.getUsuario();

    this.forma2.setValue({
      remitente : this.remitente,
      destinatario: '',
      asunto: '',
      mensaje: ''
    });
  }

  public guardarMensaje() {

    this.servicio.envioEmail( this.forma2.value ).subscribe( data => {
      this.forma2.setValue({
        remitente: this.remitente,
        destinatario : '',
        asunto : '',
        mensaje : '',
      });
      this.formularioRelleno = true;
    }, error => console.error(error));
  }

  public listadoContactos() {
    this.servicio.listadoContactos( this.storageService.getCurrentUser() ).subscribe( data => {
      this.users = JSON.parse(data['_body']);
    });
  }
}
