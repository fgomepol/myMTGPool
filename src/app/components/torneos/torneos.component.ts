import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BarajasService } from '../../service/barajas.service';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
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
  public html: SafeHtml;
  public formato = '';
  public pagina = '';

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
      this.servicio.listadoTorneos(params['id'], params['id2']).subscribe(data => {
        this.formato = params['id'];
        this.pagina = params['id2'];
        this.html = this.sanitizer.bypassSecurityTrustHtml(data['_body']);
      });
    });
  }
}
