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
    '../../vendor/font-awesome/css/font-awesome.min.css'
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
  public baraja: any;
  public loading: boolean;

  constructor(
    private storageService: StorageService,
    private servicio: BarajasService,
    private routerActivated: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
   }

   ngOnInit() {
    this.user = this.storageService.getCurrentUser();
    this.loading = true;

    this.routerActivated.params.subscribe( params => {
      this.servicio.cartasBaraja(params['id2'], params['id3']).subscribe(data => {

        this.baraja = JSON.parse(data['_body']);

        this.formato = params['id'];
        this.torneo = params['id2'];
        this.html = this.sanitizer.bypassSecurityTrustHtml(this.baraja[0].pagina);
        this.loading = false;
      });
    });
  }

}
