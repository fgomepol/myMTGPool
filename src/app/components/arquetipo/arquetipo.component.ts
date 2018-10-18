import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BarajasService } from '../../service/barajas.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-arquetipo',
  templateUrl: './arquetipo.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class ArquetipoComponent implements OnInit {

  public user: number;
  public pantalla = 'torneos';
  public html: any;
  public cargado = false;
  public formato: string;
  public baraja: string;

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
      let formato = '';
      let tipoBaraja = '';

      if (params['id'] === 'Vintage' || params['id'] === 'Legacy' || params['id'] === 'Modern' || params['id'].indexOf('Standard') !== -1) {
        formato = params['id'];
        tipoBaraja = params['id2'];

        this.formato = params['id2'];
        this.baraja = params['id'];
      } else {
        formato = params['id2'];
        tipoBaraja = params['id'];

        this.formato = params['id2'];
        this.baraja = params['id'];
      }

      this.servicio.barajasArquetipo(tipoBaraja, formato, params['id3']).subscribe(data => {
        this.html = this.sanitizer.bypassSecurityTrustHtml(data['_body']);
        console.log(data['_body']);
      });
    });
  }
}
