import { Component, OnInit, DoCheck } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BarajasService } from '../../service/barajas.service';
import { ActivatedRoute } from '@angular/router';
import { BarajaModule } from '../../models/baraja.module';

@Component({
  selector: 'app-metajuego',
  templateUrl: './metajuego.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class MetajuegoComponent implements OnInit, DoCheck {

  public user: number;
  public formularioRelleno = false;
  public importeColeccion: number;
  public totalCartas: number;
  public pantalla = 'metajuego';
  public loadingModern: boolean;
  public formato = '';

  public error = false;

  public topVintage = '';
  public topLegacy = '';
  public topModern = '';
  public topStandard = '';

  public nFilas: number[] = [];

  // Datos del chart de donut

  public doughnutChartLabels: string[] = [];
  public doughnutChartType = 'doughnut';
  public doughnutChartData: number[] = [];
  public doughnutPercentage: number[] = [];

  public donutColors = [
    {
      backgroundColor: [
        'rgba(30,204,219,1)',
        'rgba(36,74,139,1)',
        'rgba(252,63,147,1)',
        'rgba(112,87,153,1)',
        'rgba(129,108,120,1)',
        'rgba(56,98,97,1)',
        'rgba(234,75,18,1)',
        'rgba(66,78,110,1)',
        'rgba(65,160,27,1)',
        'rgba(174,95,165,1)'
       ]
    }
    ];

  public totalBarajas = 0;

  public barajas: BarajaModule[] = [{ baraja: '', total: 0 }];

  constructor(
    private storageService: StorageService,
    private servicio: BarajasService,
    private routerActivated: ActivatedRoute
  ) {

   }

  ngOnInit() {

    this.loadingModern = true;
    this.user = this.storageService.getCurrentUser();

    this.routerActivated.params.subscribe( params => {

      if (params['id']) {

        this.formato = params['id'];
        this.doughnutChartLabels.splice(0);
        this.doughnutChartData.splice(0);
        this.doughnutPercentage.splice(0);

        this.nFilas.splice(0);
        this.barajas.splice(0);

        this.servicio.barajasUltimoMes(this.formato, 10).subscribe( data => {
          // console.log(data);
          if (data['_body'] !== 'no hay datos') {
            this.error = false;

           this.totalBarajas = data.json()['totalBarajas'];

            for (const baraja of data.json()['info']) {

              const percentage = Math.round((baraja / this.totalBarajas) * 100);
              this.doughnutPercentage.push(percentage);
            }

            this.doughnutChartData = data.json()['info'];

            let i = 0;
            for (const baraja of data.json()['labels']) {
              this.doughnutChartLabels[i] = baraja;
              // this.donutColors[0].backgroundColor.push(this.random_rgba());
              i++;
            }

            /*
            for (let y = 0; y < 20; y++) {
              this.donutColors[0].backgroundColor.push(this.random_rgba());
            }
            */
          } else {
            this.error = true;
          }
        });

        this.servicio.barajasMetajuego(this.formato).subscribe( data => {

          // console.log(data);
          if (data['_body'] !== 'no hay datos') {
            this.error = false;

            let i = 0;
            let j = 0;
            for (const baraja of data.json()) {
              const divididas = baraja.split('/');

              if (divididas[1]) {
                const baraja1 = JSON.parse(divididas[0]);
                const baraja2 = JSON.parse(divididas[1]);

                this.barajas.push(baraja1);
                this.barajas.push(baraja2);

                i++;
                i++;
                this.nFilas[j] = j + 1;
                j++;
              } else {
                const baraja1 = JSON.parse(divididas[0]);
                this.barajas.push(baraja1);

                i++;
                this.nFilas[j] = j + 1;
                j++;
              }
            }

          } else {
            this.error = true;
          }
        });
      }
    });

    if (this.formato === '') {

      this.servicio.topArquetipos('Vintage').subscribe(data => {
        this.topVintage = JSON.parse(data['_body']);
      });

      this.servicio.topArquetipos('Legacy').subscribe(data => {
        this.topLegacy = JSON.parse(data['_body']);
      });

      this.servicio.topArquetipos('Modern').subscribe(data => {
        this.topModern = JSON.parse(data['_body']);
      });
    }
  }

  ngDoCheck() {
    if ((this.formato === '' && this.topModern !== '') || (this.nFilas.length > 0 && this.formato !== '')) {
      this.loadingModern = false;
    } else {
      this.loadingModern = true;
    }
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  public random_rgba() {
    const o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
  }

}
