import { Component, Input } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtgService } from '../../service/mtg.service';
import { StorageService } from '../../service/storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-carta',
  templateUrl: './modal-carta.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class ModalCartaComponent  {

  public user: number;
  public idiomasCartas: any[] = [];
  public ediciones: any[] = [];
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
      'edicion': new FormControl('', Validators.required),
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

      this.edicionesCarta(this.carta['UID']);

      this.forma.setValue({
        idUsuario : this.user,
        idProducto : this.id,
        edicion : this.carta['expansionId'],
        estado : 'NM',
        cantidad : '',
        foil : 'No',
        signed : 'No',
        idioma : 'English'
      });

    });

    this.idiomaDeCarta(this.id);
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
      this.idiomasCartas.splice(0);
      this.idiomasCartas.push(data.json());
    });
  }

  edicionesCarta(UID: number) {

    this.servicio.edicionCarta(UID).subscribe(data => {
      this.ediciones.push(data.json());
    });
  }

  redireccionExterna(url: string) {
    window.open(url, '_blank');
  }

  seleccionaIdioma(UID: number, edicion: number) {
    this.servicio.codigoCarta(UID, edicion).subscribe(data => {
      this.idiomaDeCarta(data.json()['0'].productId);
      this.forma.patchValue({ idProducto : data.json()['0'].productId });
    });
  }

}
