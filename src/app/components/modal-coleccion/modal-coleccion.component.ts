import { Component, Input } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtgService } from '../../service/mtg.service';
import { StorageService } from '../../service/storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-coleccion',
  templateUrl: './modal-coleccion.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
],
  // add NgbModalConfig and NgbModal to the component providers
  providers: [NgbModalConfig, NgbModal]
})
export class ModalColeccionComponent {
    public user: number;
    public idiomasCartas: any[] = [];
    public carta: any = '';
    public forma: FormGroup;
    public guardadaCarta = false;
    public idCarta = 0;
    @Input() id;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private storageService: StorageService,
    private servicio: MtgService
    ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    this.forma = new FormGroup({
      'idUsuario': new FormControl(''),
      'idProducto': new FormControl(''),
      'estado': new FormControl('', Validators.required),
      'cantidad': new FormControl('', Validators.required),
      'foil': new FormControl(''),
      'signed': new FormControl(''),
      'idioma': new FormControl('')
    });

    this.user = this.storageService.getCurrentUser();
  }

  open(content) {
    this.modalService.open(content);
    this.guardadaCarta = false;

    this.servicio.cartaConcreta(this.id).subscribe( data => {
      this.carta = data.json()[0];
    });
    this.idiomaDeCarta(this.id);

    this.forma.setValue({
      idUsuario : this.user,
      idProducto : this.id,
      estado : 'NM',
      cantidad : '',
      foil : 'No',
      signed : 'No',
      idioma : 'English'
    });
  }

  guardarCartas() {
    this.servicio.guardarCartasColeccion(this.forma.value, this.user).subscribe(data => {
      if (data['_body'] !== '') {
        this.guardadaCarta = true;
      }
    }, error => console.error(error));
  }

  cerrar() {
    this.modalService.dismissAll('Cross close');
  }

  idiomaDeCarta(id: number) {
    this.servicio.idiomaDeCarta(id).subscribe(data => {
      this.idiomasCartas.push(data.json());
    });
  }

  redireccionExterna(url: string) {
    window.open(url, '_blank');
  }
}
