import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageService } from 'src/app/service/storage.service';
import { MtgService } from 'src/app/service/mtg.service';
import { BarajasService } from 'src/app/service/barajas.service';

@Component({
  selector: 'app-sugerencia-inversion',
  templateUrl: './sugerencia-inversion.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../../vendor/Keyrune/css/keyrune.css',
    '../../vendor/manaSet/css/mana.css?v=1.4.0',
    '../gestionar-coleccion/gestionar-coleccion.component.css'
]
})
export class SugerenciaInversionComponent implements OnInit {
  public user: number;
  public forma: FormGroup;
  public formularioRelleno = false;
  public loading = true;
  public pantalla = 'sugerencias';
  public barajasBuscadas: any[] = [];
  public arquetipos: string[] = [];
  public barajasInvertir: any[];
  public formato = 'Vintage';
  public vacio: boolean;
  public texto = 'Cargando datos, por favor espere';

  constructor(
    private storageService: StorageService,
    private servicio: MtgService,
    private torneosServicio: BarajasService
  ) {
    this.forma = new FormGroup({
      'formato': new FormControl('', Validators.required),
      // 'minimo': new FormControl('', Validators.min(0)),
      'maximo': new FormControl('', Validators.min(1)),
      'arquetipo': new FormControl('')
    });
   }

   ngOnInit() {

    this.user = this.storageService.getCurrentUser();

    this.forma.setValue({
      formato : 'Vintage',
      // minimo : '0',
      maximo: '100',
      arquetipo: ''
    });

    this.torneosServicio.barajasSugerencia('Vintage').subscribe(data => {
      this.arquetipos = data.json();
      this.loading = false;
    });
  }

  guardarCambios() {
    this.texto = 'Cargando sugerencias, puede tomar unos minutos';
    this.vacio = false;
    this.loading = true;
    this.barajasBuscadas.splice(0);

    this.servicio.buscarBarajasInverir( this.forma.value, this.user ).subscribe( data => {

      if (data['_body'] !== 'no hay datos') {
        this.barajasBuscadas = data.json();
        this.formularioRelleno = true;
      } else {
        this.formularioRelleno = false;
        this.vacio = true;
      }
      this.loading = false;
    }, error => console.error(error));
  }

  reseteaBusqueda() {
    this.formularioRelleno = false;
    this.forma.reset();
  }

  listadoBarajas(formato: string) {
    this.texto = 'Cargando datos, por favor espere';
    this.loading = true;
    this.vacio = false;
    this.formularioRelleno = false;
    this.barajasBuscadas.splice(0);

    this.torneosServicio.barajasSugerencia(formato).subscribe(data => {
      this.formato = formato;
      this.arquetipos.splice(0);
      this.arquetipos = data.json();
      this.loading = false;
    });
  }

}
