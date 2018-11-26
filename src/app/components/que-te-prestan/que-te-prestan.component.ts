import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';
import { MtgService } from 'src/app/service/mtg.service';

@Component({
  selector: 'app-que-te-prestan',
  templateUrl: './que-te-prestan.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../../vendor/Keyrune/css/keyrune.css'
]
})
export class QueTePrestanComponent implements OnInit {

  public user: number;
  public pantalla = 'prestamos';
  public texto = 'Cargando cartas prestadas, por favor espere';
  public cargandoPagina = true;
  public cartasQueTienes: any[];
  public noEncontrado = false;
  public cartasQueTePrestan = false;

  public tipos;
  public subtipos;
  public edicionesCartas: any[] = [];

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {
   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.servicio.cartasQueMePrestan(this.user).subscribe(data => {
      if (data['_body'] !== '[]') {
        this.cartasQueTienes = data.json();
        this.cartasQueTePrestan = true;
      }
    });

    this.cargandoPagina = false;
  }

  public redireccionExterna(url: string) {
    window.open(url, '_blank');
  }

}
