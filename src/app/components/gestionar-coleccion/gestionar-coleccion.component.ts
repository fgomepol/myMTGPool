import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';

@Component({
  selector: 'app-gestionar-coleccion',
  templateUrl: './gestionar-coleccion.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../../vendor/Keyrune/css/keyrune.css'
]
})
export class GestionarColeccionComponent implements OnInit {

  public user: number;
  public formularioRelleno = false;
  public cartasColeccion: any[];
  public importeColeccion: number;
  public totalamount = 0;
  public pantalla = 'coleccion';
  public page = 1;

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {

   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.servicio.datosColeccion(this.user).subscribe( data => {
      this.importeColeccion = data.json()[0].totalColeccion;
      if ( this.importeColeccion > 0) {
        this.formularioRelleno = true;
        this.servicio.datosColeccionGestion(this.user).subscribe( data2 => {
          this.cartasColeccion = data2.json();
          for (const carta of this.cartasColeccion) {
              this.totalamount += carta.precio;
          }
        });
      }
    });
  }

  public redireccionExterna(url: string) {
    window.open(url, '_blank');
  }
}
