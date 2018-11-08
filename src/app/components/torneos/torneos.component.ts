import { Component, OnInit, DoCheck } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BarajasService } from '../../service/barajas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-torneos',
  templateUrl: './torneos.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../mensajes/mensajes.component.css'
]
})
export class TorneosComponent implements OnInit, DoCheck {

  public user: number;
  public pantalla = 'torneos';
  public formato = '';
  public pagina = '';
  public torneos: any;
  public loadingModern: boolean;
  public html;

  public barajasVintage: any;
  public barajasLegacy: any;
  public barajasModern: any;
  public barajasStandard: any = '';

  public torneosVintage: any[] = [];
  public torneosLegacy: any[] = [];
  public torneosModern: any[] = [];
  public torneosStandard: any[] = [];

  public error = false;

  constructor(
    private storageService: StorageService,
    private servicio: BarajasService,
    private routerActivated: ActivatedRoute
  ) {
      this.loadingModern = true;
   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.routerActivated.params.subscribe( params => {
      this.servicio.listadoTorneos(params['id']).subscribe(data => {
        if (params['id']) {
          this.formato = params['id'];
          this.torneos = JSON.parse(data['_body']);
          this.barajasModern = 'lleno';
        } else {
          this.formato = '';
          // Sacamos el top 3 de barajas de cada arquetipo

          this.servicio.barajasUltimoMes('Vintage', 8).subscribe( data2 => {

            if (data2['_body'] !== 'no hay datos') {
              this.barajasVintage = data2.json()['labels'];
            } else {
              this.barajasVintage = '';
            }
          });

          this.servicio.barajasUltimoMes('Legacy', 8).subscribe( data2 => {
            if (data2['_body'] !== 'no hay datos') {
              this.barajasLegacy = data2.json()['labels'];
            } else {
              this.barajasLegacy = '';
            }
          });

          this.servicio.barajasUltimoMes('Modern', 8).subscribe( data2 => {
            if (data2['_body'] !== 'no hay datos') {
              this.barajasModern = data2.json()['labels'];
            } else {
              this.barajasModern = '';
            }
          });

          this.servicio.barajasUltimoMes('Standard', 8).subscribe( data2 => {
            if (data2['_body'] !== 'no hay datos') {
              this.barajasStandard = data2.json()['labels'];
            } else {
              this.barajasStandard = '';
            }
          });

          // Sacamos los últimos 5 torneos de cada arquetipo

          this.servicio.ultimos5Torneos('Vintage').subscribe( data2 => {
            if (data2['_body'] !== 'no hay datos') {
              this.torneosVintage = data2.json();
            }
          });

          this.servicio.ultimos5Torneos('Legacy').subscribe( data2 => {
            if (data2['_body'] !== 'no hay datos') {
              this.torneosLegacy = data2.json();
            }
          });

          this.servicio.ultimos5Torneos('Modern').subscribe( data2 => {
            if (data2['_body'] !== 'no hay datos') {
              this.torneosModern = data2.json();
            }
          });

          this.servicio.ultimos5Torneos('Standard').subscribe( data2 => {
            if (data2['_body'] !== 'no hay datos') {
              this.torneosStandard = data2.json();
            }
          });
        }
      });
    });
  }

  ngDoCheck() {
    if (this.barajasStandard !== '' || this.barajasStandard !== '') {
      this.loadingModern = false;
    } else {
      this.loadingModern = true;
    }
  }
}
