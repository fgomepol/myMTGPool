import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../../../service/storage.service';
import { MtgService } from '../../../service/mtg.service';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: [
    '../../../vendor/bootstrap/css/bootstrap.min.css',
    '../../../vendor/font-awesome/css/font-awesome.min.css',
    '../../../vendor/Keyrune/css/keyrune.css'
]
})
export class OptionComponent implements OnInit {

  public nMensajes: any;
  public remitente: string;
  public datosUsuario: any;
  @Input() pantalla;

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) { }

  ngOnInit() {
    this.remitente = this.storageService.getUsuario();

    this.servicio.correosNoLeidos(this.remitente).subscribe( data => {
      this.datosUsuario = data.json();
      this.nMensajes =  this.datosUsuario[0].nMails;
    });
  }

}
