import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { StorageService } from '../../service/storage.service';
import { LoginModule } from '../../models/login.module';
import { SessionModule } from '../../models/session.module';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html'
})
export class IndexComponent implements OnInit {
  public loginForm: FormGroup;
  public submitted: Boolean = false;
  public hayError: Boolean = false;
  public error: {code: number, message: string} = null;
  public destinatarios: any;

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private storageService: StorageService,
              private router: Router) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public submitLogin(): void {
    this.submitted = true;
    this.error = null;
    this.hayError = false;

    if (this.loginForm.valid) {
      this.authenticationService.login(new LoginModule(this.loginForm.value)).subscribe(data => {
        if (data['_body'] !== '[]') {

          const datosRecibidos = JSON.parse(data['_body']);
          const tokenCod = datosRecibidos[0].id + '' + new Date().getTime();

          datosRecibidos[0].token = tokenCod;
          this.correctLogin(datosRecibidos[0]);

          this.storageService.getUsuarios(datosRecibidos[0].id).subscribe(result => {

            this.destinatarios = result.json();
            this.authenticationService.setDestinatarios(this.destinatarios);
          });

        } else {
          this.error = {
            'code' : 1,
            'message' : 'El usuario y contraseña introducidos no existe'
          };

          this.loginForm['username'] = '';
          this.loginForm['password'] = '';
          this.hayError = true;
        }
      }, error => this.error = JSON.parse(error._body));
    } else {
      this.error = {
        'code' : 2,
        'message' : 'Debe introducir usuario y contraseña.'
      };
      this.hayError = true;
    }
  }

  private correctLogin(data: SessionModule) {
    this.storageService.setCurrentSession(data);
    this.router.navigate(['/home']);
  }
}
