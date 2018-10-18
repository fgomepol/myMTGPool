import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../../service/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../service/storage.service';
import { MtgService } from '../../../service/mtg.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [
    '../../../vendor/bootstrap/css/bootstrap.min.css',
    '../../../vendor/metisMenu/metisMenu.min.css',
    '../../../dist/css/sb-admin-2.css',
    '../../../vendor/morrisjs/morris.css',
    '../../../vendor/font-awesome/css/font-awesome.min.css',
    '../../../vendor/Keyrune/css/keyrune.css'
]
})
export class NavbarComponent implements OnInit {

  public forma: FormGroup;
  public user: number;
  public datosUsuario: any;
  @Input() pantalla;

  constructor(
    private storageService: StorageService,
    private authenticationService: AuthenticationService,
    private servicio: MtgService,
    private router: Router
  ) {
    this.forma = new FormGroup({
      'id': new FormControl('', Validators.required),
      'firstName': new FormControl('', Validators.required)
    });
   }

  ngOnInit() {

    this.user = this.storageService.getCurrentUser();

    this.servicio.datosUsuario(this.user).subscribe( data => {
        this.datosUsuario = data.json()[0];
        this.forma.setValue({
          firstName : this.datosUsuario.firstName,
          id: this.datosUsuario.id
        });
    });
  }
  public logout(): void {
    this.authenticationService.logout().subscribe(
        response => {
            if (response) {
                this.storageService.logout();
                this.router.navigate(['/index']);
            }
        }
    );
  }
}
