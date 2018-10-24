import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class MtgService {

constructor(private http: Http) {}

  listaCartasMazo() {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=listaCartasMazo');
  }

  altaUser(item: Object) {
    return this.http.post('http://localhost/mkmApi/coleccion.php?opcion=altaUser', item);
  }

  modUser(item: Object) {
    return this.http.post('http://localhost/mkmApi/coleccion.php?opcion=modUser', item);
  }

  desactivaUser(id: number) {
    return this.http.post('http://localhost/mkmApi/coleccion.php?opcion=desactivaUser', id);
  }

  existeUsuario( control: string ) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=compruebaUsuario&nombre=' + control);
  }

  listaPaises() {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=listaPaises');
  }

  datosUsuario(id: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=datosUsuario&id=' + id);
  }

  envioEmail(item: Object) {
    return this.http.post('http://localhost/mkmApi/coleccion.php?opcion=envioCorreo', item);
  }

  listadoMensajes(usuario: string) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=listadoCorreos&usuario=' + usuario);
  }

  correosNoLeidos(usuario: string) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=correosNoLeidos&usuario=' + usuario);
  }

  obtenerMensaje(id: number, remitente: string) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=obtenerMensaje&id=' + id + '&usuario=' + remitente);
  }

  marcarLeido(id: number, visto: string) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=marcarLeido&id=' + id + '&visto=' + visto);
  }

  listadoMensajesEnviados(usuario: string) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=listadoCorreosEnviados&usuario=' + usuario);
  }

  obtenerMensajeEnviado(id: number, remitente: string) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=obtenerMensajeEnviado&id=' + id + '&usuario=' + remitente);
  }

  listaCartasBusqueda(item: Object) {
    return this.http.post('http://localhost/mkmApi/coleccion.php?opcion=listaCartasBusqueda', item);
  }

  listaTipos() {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=listaTipos');
  }

  listaSubtipos() {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=listaSubtipos');
  }

  guardarCartasColeccion(item: Object, usuario: number) {
    return this.http.post('http://localhost/mkmApi/coleccion.php?opcion=guardarCartasColeccion', [item, usuario]);
  }

  idiomaDeCarta(id: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=idiomaDeCarta&id=' + id);
  }

  datosColeccion(usuario: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=datosColeccion&usuario=' + usuario);
  }

  datosColeccionColor(usuario: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=datosColeccionColor&usuario=' + usuario);
  }

  datosColeccionRareza(usuario: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=datosColeccionRareza&usuario=' + usuario);
  }

  datosColeccionGestion(usuario: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=datosColeccionGestion&usuario=' + usuario);
  }

  datosArticulo(id: number, usuario: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=datosArticulo&id=' + id + '&usuario=' + usuario);
  }

  modificaColeccion(item: Object, usuario: number) {
    return this.http.post('http://localhost/mkmApi/coleccion.php?opcion=modificaColeccion', [item, usuario]);
  }

  eliminarElemento(id: number, usuario: number) {
    return this.http.post('http://localhost/mkmApi/coleccion.php?opcion=eliminarElemento', [id, usuario]);
  }

  cartaConcreta(id: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=cartaConcreta&id=' + id);
  }

  listadoEdiciones() {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=listadoEdiciones');
  }

  tendenciaCarta(id: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=tendenciaCarta&id=' + id);
  }

  guardarContacto(item: Object) {
    return this.http.post('http://localhost/mkmApi/coleccion.php?opcion=guardarContacto', item);
  }

  eliminarContacto(usuario: number, id: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=eliminarContacto&usuario=' + usuario + '&id=' + id);
  }

  listadoContactos(id: number) {
    return this.http.get('http://localhost/mkmApi/coleccion.php?opcion=listadoContactos&id=' + id);
  }
}
