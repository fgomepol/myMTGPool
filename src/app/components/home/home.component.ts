import { Component, OnInit, DoCheck } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';
import { BarajasService } from 'src/app/service/barajas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class HomeComponent implements OnInit, DoCheck {

  public user: number;
  public importeColeccion: number;
  public totalCartas: number;
  public pantalla = 'inicio';
  public cargarPagina = true;
  public formularioRelleno: boolean;

  public torneosVintage: any[] = [];
  public torneosLegacy: any[] = [];
  public torneosModern: any[] = [];
  public torneosStandard: any[] = [];

  public topVintage = '';
  public topLegacy = '';
  public topModern = '';
  public topStandard = '';

  constructor(
    private storageService: StorageService,
    private servicio: MtgService,
    private servicioBaraja: BarajasService
  ) {

   }

   ngOnInit() {
      this.user = this.storageService.getCurrentUser();

      this.datosColeccion();

      this.servicioBaraja.topArquetipos('Vintage', 3).subscribe(data => {
        this.topVintage = JSON.parse(data['_body']);
      });

      this.servicioBaraja.topArquetipos('Legacy', 3).subscribe(data => {
        this.topLegacy = JSON.parse(data['_body']);
      });

      this.servicioBaraja.topArquetipos('Modern', 3).subscribe(data => {
        this.topModern = JSON.parse(data['_body']);
      });

      this.servicioBaraja.topArquetipos('Standard', 3).subscribe(data => {
        this.topStandard = JSON.parse(data['_body']);
      });

      this.servicioBaraja.ultimosTorneos('Vintage', 3).subscribe( data2 => {
        if (data2['_body'] !== 'no hay datos') {
          this.torneosVintage = data2.json();
        }
      });

      this.servicioBaraja.ultimosTorneos('Legacy', 3).subscribe( data2 => {
        if (data2['_body'] !== 'no hay datos') {
          this.torneosLegacy = data2.json();
        }
      });

      this.servicioBaraja.ultimosTorneos('Modern', 3).subscribe( data2 => {
        if (data2['_body'] !== 'no hay datos') {
          this.torneosModern = data2.json();
        }
      });

      this.servicioBaraja.ultimosTorneos('Standard', 3).subscribe( data2 => {
        if (data2['_body'] !== 'no hay datos') {
          this.torneosStandard = data2.json();
        }
      });
    }

    public datosColeccion() {
      this.servicio.datosColeccion(this.user).subscribe( data => {
        this.importeColeccion = data.json()[0].totalColeccion;
        if ( this.importeColeccion > 0) {
          this.formularioRelleno = true;
        } else {
          this.formularioRelleno = false;
        }
      });

      this.servicio.datosColeccionColor(this.user).subscribe( data => {
        this.totalCartas = data.json()['total'];
      });
    }

    ngDoCheck() {

      if ( this.topModern !== '') {
        this.cargarPagina = false;
      } else {
        this.cargarPagina = true;
      }
    }
}
