import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../../vendor/Keyrune/css/keyrune.css',
    '../gestionar-coleccion/gestionar-coleccion.component.css'
]
})
export class PrestamosComponent implements OnInit {

  public user: number;
  public pantalla = 'prestamos';
  public texto = 'Cargando cartas prestadas, por favor espere';
  public cargandoPagina = true;
  public cartasQuePrestas: any[] = [];
  public cartasYaDevueltas: any[] = [];
  public cartasPrestadas = false;
  public cartasDevueltas = false;
  public verDevueltas = false;
  public tipos;
  public subtipos;
  public edicionesCartas: any[] = [];
  public activarBoton = true;

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {

   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();
    this.listadoCartasPrestadas();
  }

  public redireccionExterna(url: string) {
    window.open(url, '_blank');
  }

  public guardarDevueltas() {
    const cartasSeleccionadas = this.cartasQuePrestas.filter( (cartaPrestada) => cartaPrestada.checked );
    this.servicio.marcarComoDevuelto(cartasSeleccionadas).subscribe(data => {
        this.listadoCartasPrestadas();
        this.cartasDevueltas = true;
        this.activarBoton = true;
        this.FadeOutLink();
    });
  }

  public listadoCartasDevueltas() {
    this.cargandoPagina = true;
    this.cartasYaDevueltas.splice(0);
    this.servicio.cartasYaDevueltas(this.user).subscribe(data2 => {
      if (data2['_body'] !== '[]') {
        this.cartasYaDevueltas = data2.json();
        this.cartasDevueltas = true;
      } else {
        this.cartasDevueltas = false;
      }
    });
    this.cargandoPagina = false;
  }

  public listadoCartasPrestadas() {
    this.cargandoPagina = true;
    this.cartasQuePrestas.splice(0);
    this.servicio.cartasPrestadas(this.user).subscribe(data => {
      if (data['_body'] !== '[]') {
        this.cartasQuePrestas = data.json();
        this.cartasPrestadas = true;
      } else {
        this.cartasPrestadas = false;
      }
      this.cargandoPagina = false;
    });
}

  public FadeOutLink() {
    setTimeout( () => {
      this.cartasDevueltas = false;
    }, 3000);
  }

  public verCartasDevueltas(ver) {
    this.verDevueltas = ver;

    if (ver === true) {
      this.listadoCartasDevueltas();
    } else {
      this.listadoCartasPrestadas();
    }
  }

  public activaBoton() {
    const cartasSeleccionadas = this.cartasQuePrestas.filter( (cartaPrestada) => cartaPrestada.checked );

    if (cartasSeleccionadas.length > 0) {
      this.activarBoton = false;
    } else {
      this.activarBoton = true;
    }
  }
}
