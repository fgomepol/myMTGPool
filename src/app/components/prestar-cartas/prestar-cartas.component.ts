import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-prestar-cartas',
  templateUrl: './prestar-cartas.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../../vendor/Keyrune/css/keyrune.css'
]
})
export class PrestarCartasComponent implements OnInit {

  public user: number;
  public pantalla = 'prestamos';
  public texto = 'Cargando cartas para prestar, por favor espere';
  public cargandoPagina = true;
  public forma: FormGroup;
  public cartasColeccion: any[];
  public noEncontrado = false;
  public ocultaFiltros = true;
  public guardadaCarta = false;

  public tipos;
  public subtipos;
  public edicionesCartas: any[] = [];

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {
      this.forma = new FormGroup({
        'nombre': new FormControl(''),
        'colors': new FormControl(''),
        'edicion': new FormControl(''),
        'rarity': new FormControl(''),
        'subtipo': new FormControl(''),
        'tipo': new FormControl('')
      });

      this.servicio.listaTipos().subscribe(data => {
        this.tipos = data.json();
      });

      this.servicio.listaSubtipos().subscribe(data => {
        this.subtipos = data.json();
      });

      this.servicio.listadoEdiciones().subscribe(data => {
        this.edicionesCartas.push(data.json());
      });
   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.forma.setValue({
      nombre : '',
      colors: '',
      edicion: '',
      rarity: '',
      subtipo: '',
      tipo: ''
    });

    this.servicio.cartasParaPrestar(this.forma.value, this.user).subscribe( data => {
      if (data['_body'] !== '') {
        this.cartasColeccion = JSON.parse(data['_body']);
        this.cargandoPagina = false;
        if (this.cartasColeccion.length === 0) {
          this.noEncontrado = true;
        }
      }
    }, error => console.error(error));
  }

  public buscarCartas() {
    this.cargandoPagina = true;
    this.noEncontrado = false;
    this.servicio.cartasParaPrestar(this.forma.value, this.user).subscribe( data => {
      if (data['_body'] !== '') {
        this.cartasColeccion = JSON.parse(data['_body']);
        this.cargandoPagina = false;
        if (this.cartasColeccion.length === 0) {
          this.noEncontrado = true;
        }
      }
    }, error => console.error(error));
  }

  public reseteaBusqueda() {
    this.forma.reset();
    this.servicio.cartasParaPrestar(this.forma.value, this.user).subscribe( data => {
      if (data['_body'] !== '') {
        this.cartasColeccion = JSON.parse(data['_body']);
        this.cargandoPagina = false;
        if (this.cartasColeccion.length === 0) {
          this.noEncontrado = true;
        }
      }
    }, error => console.error(error));
  }

  public redireccionExterna(url: string) {
    window.open(url, '_blank');
  }

  public muestraFiltros(valor: boolean) {
    this.ocultaFiltros = valor;
  }

  public cartaPrestada($event) {
    if ($event === true) {
      this.cargandoPagina = true;
      this.servicio.cartasParaPrestar(this.forma.value, this.user).subscribe( data => {
        if (data['_body'] !== '') {
          this.cartasColeccion = JSON.parse(data['_body']);
          this.cargandoPagina = false;
          this.guardadaCarta = true;
          this.FadeOutLink();
          if (this.cartasColeccion.length === 0) {
            this.noEncontrado = true;
          }
        }
      }, error => console.error(error));
    }
  }

  public FadeOutLink() {
    setTimeout( () => {
      this.guardadaCarta = false;
    }, 2000);
   }
}
