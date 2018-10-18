import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';

@Component({
  selector: 'app-datos-coleccion',
  templateUrl: './datos-coleccion.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class DatosColeccionComponent implements OnInit {

  public user: number;
  public formularioRelleno = false;
  public importeColeccion: number;
  public totalCartas: number;
  public pantalla = 'coleccion';

  public doughnutChartLabels: string[] = ['Rojas', 'Azules', 'Verdes', 'Negras', 'Blancas', 'Incoloras', 'Tierras'];
  public donutColors = [
  {
    backgroundColor: [
      'rgba(209, 0, 3, 1)',
      'rgba(91, 154, 255, 1)',
      'rgba(22, 196, 45, 1)',
      'rgba(0, 0, 0, 1)',
      'rgba(212, 198, 0, 0.637)',
      'rgba(182, 182, 182, 1)',
      'rgba(113, 81, 69, 1)'
    ]
  }
  ];
  public doughnutChartType = 'doughnut';
  public doughnutChartData: number[] = [];
  public doughnutPercentage: number[] = [];
  public rarityPercentage: number[] = [];

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {
   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();
    this.datosColeccion();
  }

  public datosColeccion() {

    this.servicio.datosColeccion(this.user).subscribe( data => {
      this.importeColeccion = data.json()[0].totalColeccion;
      if ( this.importeColeccion > 0) {
        this.formularioRelleno = true;
      }
    });

    this.servicio.datosColeccionColor(this.user).subscribe( data => {
      this.totalCartas = data.json()['total'];
      this.doughnutChartData = [data.json()['R'], data.json()['U'], data.json()['G'], data.json()['B'], data.json()['W'], data.json()['I'], data.json()['L']];
      this.doughnutPercentage = [ Math.round((data.json()['R'] / data.json()['total']) * 100), Math.round((data.json()['U'] / data.json()['total']) * 100), Math.round((data.json()['G'] / data.json()['total']) * 100), Math.round((data.json()['B'] / data.json()['total']) * 100), Math.round((data.json()['W'] / data.json()['total']) * 100), Math.round((data.json()['I'] / data.json()['total']) * 100), Math.round((data.json()['L'] / data.json()['total']) * 100)];
      this.rarityPercentage = [ Math.round((data.json()['mythic'] / data.json()['total']) * 100), Math.round((data.json()['rare'] / data.json()['total']) * 100), Math.round((data.json()['uncommon'] / data.json()['total']) * 100), Math.round((data.json()['common'] / data.json()['total']) * 100) ];
    });
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
