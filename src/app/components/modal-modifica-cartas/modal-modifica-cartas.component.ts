import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtgService } from '../../service/mtg.service';
import { StorageService } from '../../service/storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-modifica-cartas',
  templateUrl: './modal-modifica-cartas.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/Keyrune/css/keyrune.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
],
  // add NgbModalConfig and NgbModal to the component providers
  providers: [NgbModalConfig, NgbModal]
})
export class ModalModificaCartasComponent {

  public user: number;
  public idiomasCartas: any[] = [];
  public ediciones: any[] = [];
  public carta: any = '';
  public forma: FormGroup;
  public idCarta = 0;
  public maximo = 0;
  public modificacionesRealizadas = false;
  public eliminada = false;

  @Input() id;
  @Output() modificada = new EventEmitter();

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private storageService: StorageService,
    private servicio: MtgService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.forma = new FormGroup({
      'idUsuario': new FormControl(''),
      'idProducto': new FormControl(''),
      'estado': new FormControl('', Validators.required),
      'cantidad': new FormControl('', Validators.required),
      'foil': new FormControl(''),
      'signed': new FormControl(''),
      'idioma': new FormControl(''),
      'codColeccion': new FormControl('')
    });

    this.user = this.storageService.getCurrentUser();
  }

  open(content) {
    this.modalService.open(content);

    this.servicio.datosArticulo( this.id, this.user).subscribe( data => {
      this.forma.setValue({
        idUsuario : data.json()[0].idUsuario,
        idProducto: data.json()[0].productId,
        estado: data.json()[0].estado,
        cantidad: data.json()[0].cantidad,
        foil: data.json()[0].foil,
        signed: data.json()[0].signed,
        codColeccion: data.json()[0].codColeccion,
        idioma: data.json()[0].idioma
      });
      this.idiomaDeCarta(data.json()[0].productId);
      this.carta = data.json()[0];
    });
  }

  idiomaDeCarta(id: number) {
    this.servicio.idiomaDeCarta(id).subscribe(data => {
      this.idiomasCartas.push(data.json());
    });
  }

  guardarCambios(event) {
    this.servicio.modificaColeccion( this.forma.value, this.user ).subscribe( data => {
      if (data['_body'] === 'true') {
        this.modificacionesRealizadas = true;
        this.modificada.emit(true);
      } else {
        this.modificacionesRealizadas = false;
      }
    }, error => console.error(error));
  }

  cerrar() {
    this.modalService.dismissAll('Cross close');
  }

  redireccionExterna(url: string) {
    window.open(url, '_blank');
  }

  public eliminar(id: number) {
    this.servicio.eliminarElemento(id, this.user).subscribe(data => {
      if (data['_body'] === 'true') {
        this.eliminada = true;
        this.modificada.emit(true);
      }
    });
  }
}
