import { Injectable } from '@angular/core';
import { SessionModule } from '../models/session.module';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public baseUrl = 'http://localhost/mkmApi/coleccion.php';
  private localStorageService;

  constructor(private router: Router, private http: Http) {
    this.localStorageService = localStorage;
  }

  setCurrentSession(session: SessionModule): void {
    this.localStorageService.setItem('currentUser', JSON.stringify(session));
  }
  loadSessionData(): SessionModule {
    const sessionStr = this.localStorageService.getItem('currentUser');
    return (sessionStr) ? <SessionModule> JSON.parse(sessionStr) : null;
  }

  loadDestinatario(): any {
    const sessionStr = this.localStorageService.getItem('destinatarios');
    return (sessionStr) ? JSON.parse(sessionStr) : null;
  }

  getCurrentSession(): SessionModule {
    return this.loadSessionData();
  }
  removeCurrentSession(): void {
    this.localStorageService.removeItem('currentUser');
    this.localStorageService.removeItem('destinatarios');
  }
  getCurrentUser(): number {
    const session: SessionModule = this.getCurrentSession();
    return (session && this.getCurrentSession().id) ? this.getCurrentSession().id : null;
  }
  isAuthenticated(): boolean {
    return (this.getCurrentToken() != null) ? true : false;
  }

  getCurrentToken(): string {
    const session = this.getCurrentSession();
    return (session && session.token) ? session.token : null;
  }

  logout(): void {
    this.removeCurrentSession();
    this.router.navigate(['/login']);
  }

  getUsuario(): string {
    const session = this.getCurrentSession();
    return (session && session.userName) ? session.userName : null;
  }

  getUsuarios(id: number) {
    return this.http.get(`${this.baseUrl}?opcion=listadoUsuarios&id=${ id }`);
  }
}
