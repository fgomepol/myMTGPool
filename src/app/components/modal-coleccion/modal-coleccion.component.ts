import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtgService } from '../../service/mtg.service';
import { StorageService } from '../../service/storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-coleccion',
  templateUrl: './modal-coleccion.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/Keyrune/css/keyrune.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
],
  // add NgbModalConfig and NgbModal to the component providers
  providers: [NgbModalConfig, NgbModal]
})
export class ModalColeccionComponent {
  public user: number;
  public idiomasCartas: any[] = [];
  public ediciones: any[] = [];
  public carta: any = '';
  public forma: FormGroup;
  public idCarta = 0;
  public maximo = 0;
  public gente: any = [];

  @Input() id;
  @Input() cantidad;
  @Output() prestada = new EventEmitter();

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
      'cant': new FormControl('', Validators.required),
      'prestado': new FormControl('', Validators.required)
    });

    this.user = this.storageService.getCurrentUser();
    this.maximo = this.cantidad;
  }

  open(content) {
    this.modalService.open(content);

    this.servicio.cartasConcretaPrestar(this.id).subscribe( data => {

      this.carta = data.json()[0];
      this.maximo = this.cantidad;

      this.forma.setValue({
        idUsuario : this.user,
        idProducto : this.id,
        cant : 1,
        prestado: '',
      });

      this.listadoContactos();
    });
  }

  guardarPrestadas(event) {
    this.servicio.guardarPrestadas(this.forma.value, this.user).subscribe(data => {

      if (data['_body'] !== '') {
        this.prestada.emit(true);
        this.modalService.dismissAll('Cross close');
      } else {
        this.prestada.emit(false);
      }
    }, error => console.error(error));
  }

  cerrar() {
    this.modalService.dismissAll('Cross close');
  }

  redireccionExterna(url: string) {
    window.open(url, '_blank');
  }

  public listadoContactos() {
    this.servicio.listadoContactos( this.user ).subscribe( data => {
      this.gente = data.json();
    });
  }
}
