import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartaModule } from '../../models/carta.module';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-coleccion',
  templateUrl: './coleccion.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../../vendor/Keyrune/css/keyrune.css',
    '../../vendor/manaSet/css/mana.css?v=1.4.0'
],
providers: [NgbModalConfig, NgbModal]
})
export class ColeccionComponent implements OnInit {

  public user: number;
  public forma: FormGroup;
  public forma2: FormGroup;
  public forma3: FormGroup;
  public formularioRelleno = false;
  public tipos;
  public subtipos;
  public cartasColeccion: any[];
  public sitiosInteres: CartaModule[];
  public cartasFormulario: CartaModule[];
  public siteModel: CartaModule[];
  public guardadoCorrectamente = false;
  public loading: boolean;
  public idCarta = 0;
  public carta: any;
  public idiomasCartas: any[] = [];
  public edicionesCartas: any[] = [];
  public pantalla = 'coleccion';
  public page = 1;

  constructor(
    private storageService: StorageService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private servicio: MtgService
  ) {

    config.backdrop = 'static';
    config.keyboard = false;

    this.forma2 = new FormGroup({
      'nombre': new FormControl(''),
      'cmc': new FormControl(''),
      'colors': new FormControl(''),
      'edicion': new FormControl(''),
      'rarity': new FormControl(''),
      'subtipo': new FormControl(''),
      'tipo': new FormControl('')
    });

    this.forma3 = new FormGroup({
      'idUsuario': new FormControl(''),
      'idProducto': new FormControl(''),
      'estado': new FormControl('', Validators.required),
      'cantidad': new FormControl('', Validators.required),
      'foil': new FormControl(''),
      'signed': new FormControl(''),
      'idioma': new FormControl('')
    });

    this.servicio.listaTipos().subscribe(data => {
      this.tipos = data.json();
    });

    this.servicio.listaSubtipos().subscribe(data => {
      this.subtipos = data.json();
    });
   }

  ngOnInit() {

    this.user = this.storageService.getCurrentUser();
    this.servicio.datosUsuario(this.user).subscribe( data => {

      this.forma2.setValue({
        nombre : '',
        cmc : '',
        colors: '',
        edicion: '',
        rarity: '',
        subtipo: '',
        tipo: ''
      });
    });

    this.servicio.listadoEdiciones().subscribe(data => {
      this.edicionesCartas.push(data.json());
    });
  }

  guardarCambios() {
    this.loading = true;

    this.servicio.listaCartasBusqueda( this.forma2.value ).subscribe( data => {

      if (data['_body'] !== '') {
        this.cartasColeccion = JSON.parse(data['_body']);
        this.siteModel = this.cartasColeccion;

        this.formularioRelleno = true;
        this.loading = false;
      } else {
        this.formularioRelleno = false;
        this.loading = false;
      }
    }, error => console.error(error));
  }

  open(content, id) {

    this.idCarta = id;
    this.modalService.open(content);

    this.servicio.cartaConcreta( this.idCarta).subscribe( data => {
      this.carta = data.json()[0];
    });
    this.idiomaDeCarta(this.idCarta);

    this.forma3.setValue({
      idUsuario : this.user,
      idProducto : this.idCarta,
      estado : '',
      cantidad : '',
      foil : '',
      signed : '',
      idioma : ''
    });
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
