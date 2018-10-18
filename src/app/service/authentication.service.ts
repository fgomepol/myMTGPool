import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoginModule } from '../models/login.module';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private localStorageService;

  constructor(private http: Http) {
    this.localStorageService = localStorage;
  }

  login(loginObj: LoginModule) {
    return this.http.post('http://localhost/mkmApi/coleccion.php?opcion=login', loginObj);
  }

  logout() {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=logout');
  }

  setDestinatarios(session: any): void {
    this.localStorageService.setItem('destinatarios', JSON.stringify(session));
  }
 }
