import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestionar-coleccion',
  templateUrl: './gestionar-coleccion.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../../vendor/Keyrune/css/keyrune.css',
    'gestionar-coleccion.component.css'
]
})
export class GestionarColeccionComponent implements OnInit {

  public user: number;
  public formularioRelleno: boolean;
  public cargandoPagina = true;
  public cartasColeccion: any[];
  public importeColeccion: number;
  public totalamount = 0;
  public pantalla = 'coleccion';
  public page = 1;
  public ocultaFiltros = true;
  public noEncontrado = false;
  public forma: FormGroup;
  public tipos;
  public subtipos;
  public edicionesCartas: any[] = [];
  public texto = 'Cargando colección, por favor espere';

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

    this.servicio.datosColeccion(this.user).subscribe( data => {
      this.importeColeccion = data.json()[0].totalColeccion;
      if ( this.importeColeccion > 0) {
        this.formularioRelleno = true;
        this.servicio.datosColeccionGestion(this.user).subscribe( data2 => {
          this.cartasColeccion = data2.json();
          for (const carta of this.cartasColeccion) {
              this.totalamount += carta.precio;
          }
          this.cargandoPagina = false;
        });
      } else {
        this.formularioRelleno = false;
        this.cargandoPagina = false;
      }
    });

    this.forma.setValue({
      nombre : '',
      colors: '',
      edicion: '',
      rarity: '',
      subtipo: '',
      tipo: ''
    });
  }

  public redireccionExterna(url: string) {
    window.open(url, '_blank');
  }

  buscarCartas() {
    this.cargandoPagina = true;
    this.noEncontrado = false;
    this.servicio.buscadorColeccion(this.forma.value, this.user).subscribe( data => {
      if (data['_body'] !== '') {
        this.cartasColeccion = JSON.parse(data['_body']);
        this.cargandoPagina = false;
        if (this.cartasColeccion.length === 0) {
          this.noEncontrado = true;
        }
      }
    }, error => console.error(error));
  }

  muestraFiltros(valor: boolean) {
    this.ocultaFiltros = valor;
  }

  reseteaBusqueda() {
    this.forma.reset();
  }
}
