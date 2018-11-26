import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';
import { BarajasService } from 'src/app/service/barajas.service';

@Component({
  selector: 'app-mazos-favoritos',
  templateUrl: './mazos-favoritos.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../gestionar-coleccion/gestionar-coleccion.component.css'
]
})
export class MazosFavoritosComponent implements OnInit {

  public user: number;
  public pantalla = 'mazos';
  public loading = true;
  public hayMazos = false;
  public datosDecklist: any;
  public barajas: any;
  public texto = 'Cargando barajas favoritas, por favor espere';

  constructor(
    private storageService: StorageService,
    private servicioBarajas: BarajasService
  ) {
   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.servicioBarajas.listaBarajasFavoritas(this.user).subscribe(data => {

      if (data['_body'] !== 'no hay datos') {
        this.barajas = data.json();
        this.hayMazos = true;
      } else {
        this.hayMazos = false;
      }
      this.loading = false;
    });
  }

}
