import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BarajasService } from '../../service/barajas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-arquetipo',
  templateUrl: './arquetipo.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    './arquetipo.component.css'
]
})
export class ArquetipoComponent implements OnInit {

  public user: number;
  public pantalla = 'torneos';
  public datosArquetipo: any;
  public cargado = false;
  public formato: string;
  public baraja: string;
  public loading: boolean;
  public texto = 'Cargando arquetipos, por favor espere';
  public hayBarajas = false;

  constructor(
    private storageService: StorageService,
    private servicio: BarajasService,
    private routerActivated: ActivatedRoute
  ) {
   }

   ngOnInit() {
    this.user = this.storageService.getCurrentUser();
    this.loading = true;

    this.routerActivated.params.subscribe( params => {
      let formato = '';
      let tipoBaraja = '';

      if (params['id'] === 'Vintage' || params['id'] === 'Legacy' || params['id'] === 'Modern' || params['id'].indexOf('Standard') !== -1) {
        formato = params['id'];
        tipoBaraja = params['id2'];
      } else {
        formato = params['id2'];
        tipoBaraja = params['id'];
      }

      this.formato = formato;
      this.baraja = tipoBaraja;

      this.texto = 'Cargando datos de ' + tipoBaraja + ', por favor espere';

      this.servicio.barajasArquetipo(tipoBaraja, formato, this.user).subscribe(data => {

        if (data['_body'] !== 'no hay datos') {
          this.datosArquetipo = JSON.parse(data['_body']);
          this.hayBarajas = true;
        }
        this.loading = false;
      });
    });
  }
}
