import { Component, OnInit } from '@angular/core';
import { MtgService } from '../../service/mtg.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html'
})
export class FormularioComponent implements OnInit {

  hayUsuario = false;
  formularioRelleno = false;
  forma: FormGroup;
  paises;
  item;

  constructor(private servicio: MtgService) {
    this.forma = new FormGroup({
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required),
      'userName': new FormControl('', [Validators.required, Validators.minLength(5)]),
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

  existeUsuario( nombre: FormControl ) {

    this.servicio.existeUsuario(nombre.value).subscribe(data => {

      if (data['_body'] !== '[]') {
        this.hayUsuario = true;
        nombre.setValue('');
      } else {
        this.hayUsuario = false;
      }
    });
  }

  guardarCambios() {
    this.servicio.altaUser( this.forma.value ).subscribe( data => {
      this.formularioRelleno = true;
    }, error => console.error(error));
  }

  ngOnInit() {
  }

}
