import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class MtgService {

  public baseUrl = 'http://localhost/mkmApi/coleccion.php';

constructor(private http: Http) {}

  listaCartasMazo() {
    return this.http.get(`${this.baseUrl}?opcion=listaCartasMazo`);
  }

  altaUser(item: Object) {
    return this.http.post(`${this.baseUrl}?opcion=altaUser`, item);
  }

  modUser(item: Object) {
    return this.http.post(`${this.baseUrl}?opcion=modUser`, item);
  }

  desactivaUser(id: number) {
    return this.http.post(`${this.baseUrl}?opcion=desactivaUser`, id);
  }

  existeUsuario( control: string ) {
    return this.http.get(`${this.baseUrl}?opcion=compruebaUsuario&nombre=${control}`);
  }

  listaPaises() {
    return this.http.get(`${this.baseUrl}?opcion=listaPaises`);
  }

  datosUsuario(id: number) {
    return this.http.get(`${this.baseUrl}?opcion=datosUsuario&id=${id}`);
  }

  envioEmail(item: Object) {
    return this.http.post(`${this.baseUrl}?opcion=envioCorreo`, item);
  }

  listadoMensajes(usuario: string) {
    return this.http.get(`${this.baseUrl}?opcion=listadoCorreos&usuario=${usuario}`);
  }

  correosNoLeidos(usuario: string) {
    return this.http.get(`${this.baseUrl}?opcion=correosNoLeidos&usuario=${usuario}`);
  }

  obtenerMensaje(id: number, remitente: string) {
    return this.http.get(`${this.baseUrl}?opcion=obtenerMensaje&id=${id}&usuario=${remitente}`);
  }

  marcarLeido(id: number, visto: string) {
    return this.http.get(`${this.baseUrl}?opcion=marcarLeido&id=${id}&visto=${visto}`);
  }

  listadoMensajesEnviados(usuario: string) {
    return this.http.get(`${this.baseUrl}?opcion=listadoCorreosEnviados&usuario=${usuario}`);
  }

  obtenerMensajeEnviado(id: number, remitente: string) {
    return this.http.get(`${this.baseUrl}?opcion=obtenerMensajeEnviado&id=${id}&usuario=${remitente}`);
  }

  listaCartasBusqueda(item: Object) {
    return this.http.post(`${this.baseUrl}?opcion=listaCartasBusqueda`, item);
  }

  listaTipos() {
    return this.http.get(`${this.baseUrl}?opcion=listaTipos`);
  }

  listaSubtipos() {
    return this.http.get(`${this.baseUrl}?opcion=listaSubtipos`);
  }

  guardarCartasColeccion(item: Object, usuario: number) {
    return this.http.post(`${this.baseUrl}?opcion=guardarCartasColeccion`, [item, usuario]);
  }

  idiomaDeCarta(id: number) {
    return this.http.get(`${this.baseUrl}?opcion=idiomaDeCarta&id=${id}`);
  }

  datosColeccion(usuario: number) {
    return this.http.get(`${this.baseUrl}?opcion=datosColeccion&usuario=${usuario}`);
  }

  datosColeccionColor(usuario: number) {
    return this.http.get(`${this.baseUrl}?opcion=datosColeccionColor&usuario=${usuario}`);
  }

  datosColeccionRareza(usuario: number) {
    return this.http.get(`${this.baseUrl}?opcion=datosColeccionRareza&usuario=${usuario}`);
  }

  datosColeccionGestion(usuario: number) {
    return this.http.get(`${this.baseUrl}?opcion=datosColeccionGestion&usuario=${usuario}`);
  }

  datosArticulo(id: number, usuario: number) {
    return this.http.get(`${this.baseUrl}?opcion=datosArticulo&id=${id}&usuario=${usuario}`);
  }

  modificaColeccion(item: Object, usuario: number) {
    return this.http.post(`${this.baseUrl}?opcion=modificaColeccion`, [item, usuario]);
  }

  eliminarElemento(id: number, usuario: number) {
    return this.http.post(`${this.baseUrl}?opcion=eliminarElemento`, [id, usuario]);
  }

  cartaConcreta(id: number) {
    return this.http.get(`${this.baseUrl}?opcion=cartaConcreta&id=${id}`);
  }

  listadoEdiciones() {
    return this.http.get(`${this.baseUrl}?opcion=listadoEdiciones`);
  }

  tendenciaCarta(id: number) {
    return this.http.get(`${this.baseUrl}?opcion=tendenciaCarta&id=${id}`);
  }

  guardarContacto(item: Object) {
    return this.http.post(`${this.baseUrl}?opcion=guardarContacto`, item);
  }

  eliminarContacto(usuario: number, id: number) {
    return this.http.get(`${this.baseUrl}?opcion=eliminarContacto&usuario=${usuario}&id=${id}`);
  }

  listadoContactos(id: number) {
    return this.http.get(`${this.baseUrl}?opcion=listadoContactos&id=${id}`);
  }
}
