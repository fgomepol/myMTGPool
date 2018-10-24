import { Component, OnInit } from '@angular/core';
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
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class TorneosComponent implements OnInit {

  public user: number;
  public pantalla = 'torneos';
  public formato = '';
  public pagina = '';
  public torneos: any;
  public loading: boolean;

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
      this.servicio.listadoTorneos(params['id']).subscribe(data => {
        this.formato = params['id'];
        this.torneos = JSON.parse(data['_body']);
        this.loading = false;
      });
    });
  }
}
