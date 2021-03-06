import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BarajasService } from '../../service/barajas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listado-barajas',
  templateUrl: './listado-barajas.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../mensajes/mensajes.component.css'
]
})
export class ListadoBarajasComponent implements OnInit {

  public user: number;
  public pantalla = 'torneos';
  public html: any;
  public cargado = false;
  public formato = '';
  public pagina = '';
  public barajas: any;
  public cargandoPagina = true;
  public texto = 'Cargando listado de barajas, por favor espere';

  constructor(
    private storageService: StorageService,
    private servicio: BarajasService,
    private routerActivated: ActivatedRoute
  ) {
   }

   ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.routerActivated.params.subscribe( params => {
      this.servicio.listaBarajasTorneo(params['id2'], params['id'], this.user).subscribe(data => {
        this.formato = params['id'];
        if (data['_body'] !== 'no hay datos') {
          this.barajas = data.json();
        } else {
          this.barajas = '';
        }
        this.cargandoPagina = false;
      });
    });
  }

}
