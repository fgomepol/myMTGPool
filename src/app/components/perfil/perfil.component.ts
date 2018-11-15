import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class PerfilComponent implements OnInit {

  public user: number;
  public forma: FormGroup;
  public formularioRelleno = false;
  public paises;
  public datosUsuario: any;
  public pantalla = 'perfil';
  public cargandoPagina = true;

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {
    this.forma = new FormGroup({
      'id': new FormControl('', Validators.required),
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required),
      'password': new FormControl('', [Validators.required,  Validators.minLength(8)]),
      'email': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
      'provincia': new FormControl('', Validators.required),
      'pais': new FormControl('', Validators.required),
      'localidad': new FormControl('', Validators.required),
      'cp': new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('\\d{5,10}')])
    });

    this.servicio.listaPaises().subscribe(data => {
      this.paises = data.json();
    });
   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.servicio.datosUsuario(this.user).subscribe( data => {

      this.datosUsuario = data.json();

      for (const item of this.datosUsuario) {
        this.forma.setValue({
          firstName : item.firstName,
          lastName : item.lastName,
          password : item.password,
          email : item.email,
          provincia : item.provincia,
          pais : item.pais,
          localidad : item.localidad,
          cp : item.cp,
          id: item.id
        });
        this.cargandoPagina = false;
      }
    });
  }

  guardarCambios() {
    this.servicio.modUser( this.forma.value ).subscribe( data => {
      this.formularioRelleno = true;
    }, error => console.error(error));
  }
}
