import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MtgService } from '../../service/mtg.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modificar-articulo',
  templateUrl: './modificar-articulo.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../../vendor/Keyrune/css/keyrune.css'
]
})
export class ModificarArticuloComponent implements OnInit {

  public user: number;
  public forma3: FormGroup;
  public formularioRelleno = false;
  public carta: any = '';
  public idiomasCartas: any[] = [];
  public pantalla = 'coleccion';
  public cargandoPagina = true;
  public texto = 'Cargando datos, por favor espere';

  constructor(
    private storageService: StorageService,
    private router: Router,
    private routerActivated: ActivatedRoute,
    private servicio: MtgService
  ) {

    this.forma3 = new FormGroup({
      'idUsuario': new FormControl(''),
      'idProducto': new FormControl(''),
      'estado': new FormControl('', Validators.required),
      'cantidad': new FormControl('', Validators.required),
      'foil': new FormControl(''),
      'signed': new FormControl(''),
      'idioma': new FormControl(''),
      'codColeccion': new FormControl('')
    });
   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.routerActivated.params.subscribe( params => {
      this.servicio.datosArticulo( params['id'], this.user).subscribe( data => {
        this.forma3.setValue({
          idUsuario : data.json()[0].idUsuario,
          idProducto: data.json()[0].productId,
          estado: data.json()[0].estado,
          cantidad: data.json()[0].cantidad,
          foil: data.json()[0].foil,
          signed: data.json()[0].signed,
          codColeccion: data.json()[0].codColeccion,
          idioma: data.json()[0].idioma
        });
        this.idiomaDeCarta(data.json()[0].productId);
        this.carta = data.json()[0];
        this.cargandoPagina = false;
      });
    });
  }

  idiomaDeCarta(id: number) {
    this.servicio.idiomaDeCarta(id).subscribe(data => {
      this.idiomasCartas.push(data.json());
    });
  }

  guardarCambios() {
    this.servicio.modificaColeccion( this.forma3.value, this.user ).subscribe( data => {
      if (data['_body'] === 'true') {
        this.router.navigate(['/gestionarColeccion']);
      } else {
        this.formularioRelleno = false;
      }
    }, error => console.error(error));
  }

  public eliminar(id: number) {
    this.servicio.eliminarElemento(id, this.user).subscribe(data => {
      if (data['_body'] === 'true') {
        this.router.navigate(['/gestionarColeccion']);
      }
    });
  }

}
