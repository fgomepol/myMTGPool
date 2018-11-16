import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BarajasService } from '../../service/barajas.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cartas-baraja',
  templateUrl: './cartas-baraja.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../../vendor/Keyrune/css/keyrune.css'
]
})
export class CartasBarajaComponent implements OnInit {

  public user: number;
  public pantalla = 'torneos';
  public html: any;
  public cargado = false;
  public formato = '';
  public pagina = '';
  public torneo = '';
  public codigoBaraja: number;
  public baraja: any;
  public loading = true;
  public cartasBaraja: any;
  public totalCartas: number;
  public importeBarajaEx: number;
  public importeBarajaNm: number;
  public cartasFaltan: any[];
  public importeFaltaBarajaEx = 0;
  public importeFaltaBarajaMn = 0;
  public texto = 'Cargando baraja, por favor espere';

  // grafico para colores de la baraja
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

  // grafico para curva de mana

  public lineChartType = 'line';
  public lineChartLegend = true;

  // ['Coste 0', 'Coste 1', 'Coste 2', 'Coste 3', 'Coste 4', 'Coste 5', 'Coste 6', 'Coste 7', 'Coste 8', 'Coste 9', 'Coste 10', 'Coste 11', 'Coste 12', 'Coste 13', 'Coste 14', 'Coste 15', 'Coste 16']
  public lineChartLabels: string[] = [];
  public lineChartData: any[] = [];

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0)',
      borderColor: 'rgba(148,159,177,1)'
    }
  ];

  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 5
        }
      }]
    }
  };

  constructor(
    private storageService: StorageService,
    private servicio: BarajasService,
    private routerActivated: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
   }

   ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.routerActivated.params.subscribe( params => {
      this.servicio.cartasBaraja(params['id2'], params['id3']).subscribe(data => {

        this.baraja = JSON.parse(data['_body']);

        this.formato = params['id'];
        this.torneo = params['id2'];
        this.codigoBaraja = params['id3'];

        this.html = this.sanitizer.bypassSecurityTrustHtml(this.baraja[0].pagina);

        this.cartasBaraja = this.baraja[0].cartasBaraja;
      });

      this.servicio.datosEstadisticosBaraja(params['id3']).subscribe(data => {

        this.doughnutChartData = [data.json()['R'], data.json()['U'], data.json()['G'], data.json()['B'], data.json()['W'], data.json()['I'], data.json()['L']];
        this.doughnutPercentage = [ Math.round((data.json()['R'] / data.json()['total']) * 100), Math.round((data.json()['U'] / data.json()['total']) * 100), Math.round((data.json()['G'] / data.json()['total']) * 100), Math.round((data.json()['B'] / data.json()['total']) * 100), Math.round((data.json()['W'] / data.json()['total']) * 100), Math.round((data.json()['I'] / data.json()['total']) * 100), Math.round((data.json()['L'] / data.json()['total']) * 100)];
        this.rarityPercentage = [ Math.round((data.json()['mythic'] / data.json()['total']) * 100), Math.round((data.json()['rare'] / data.json()['total']) * 100), Math.round((data.json()['uncommon'] / data.json()['total']) * 100), Math.round((data.json()['common'] / data.json()['total']) * 100) ];
        this.importeBarajaEx = data.json()['importeEx'];
        this.importeBarajaNm = data.json()['importeNm'];

        const datosChart: string[] = [];

        for (let i = 0; i <= 16; i++) {
          if (data.json()[i] > 0) {
            datosChart.push(data.json()[i]);
            this.lineChartLabels.push('Coste ' + i);
          }
        }

        // this.lineChartData.push( { data: datosChart, label: 'Costes'});
        this.lineChartData = datosChart;
      });

      this.servicio.comparacionColeccion(params['id3'], this.user).subscribe(data => {
        this.cartasFaltan = data.json();

        for (const item of this.cartasFaltan) {
          this.importeFaltaBarajaEx = this.importeFaltaBarajaEx + (parseFloat(item.importeEx) * parseFloat(item.cantidad));
          this.importeFaltaBarajaMn = this.importeFaltaBarajaMn + (parseFloat(item.importeNm) * parseFloat(item.cantidad));
        }
        this.loading = false;
      });
    });
  }

  public redireccionExterna(url: string) {
    window.open(url, '_blank');
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  public actualizaListado() {
    this.servicio.comparacionColeccion(this.codigoBaraja, this.user).subscribe(data => {

      this.cartasFaltan.splice(0);
      this.cartasFaltan = data.json();

      this.importeFaltaBarajaEx = 0;
      this.importeFaltaBarajaMn = 0;

      for (const item of this.cartasFaltan) {
        this.importeFaltaBarajaEx = this.importeFaltaBarajaEx + parseFloat(item.importeEx);
        this.importeFaltaBarajaMn = this.importeFaltaBarajaMn + parseFloat(item.importeNm);
      }
    });
  }

}
