import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DeckModule } from '../models/deck.module';

@Injectable({
  providedIn: 'root'
})
export class DeckEditorService {

  public baseUrl = 'http://localhost/mkmApi/deckEditor.php';

  constructor(private http: Http) { }

  listaCartasFormato(item: Object, formato: string, codBaraja: 0) {
    return this.http.post(`${this.baseUrl}?opcion=listaCartasFormato`, [item, formato, codBaraja]);
  }

  listadoArquetipos(formato: string) {
    return this.http.get(`${this.baseUrl}?opcion=listadoArquetipos&formato=${formato}`);
  }

  datosCarta(UID: number) {
    return this.http.get(`${this.baseUrl}?opcion=datosCarta&UID=${UID}`);
  }

  comparacionColeccion(item: DeckModule[], usuario: number) {
    return this.http.post(`${this.baseUrl}?opcion=comparacionColeccion`, [item, usuario]);
  }

  guardaBarajaPersonalizada(item: any, cartasBaraja: DeckModule[], usuario: number) {
    return this.http.post(`${this.baseUrl}?opcion=guardaBarajaPersonalizada`, [item, cartasBaraja, usuario]);
  }

  listadoMazos(usuario: number) {
    return this.http.get(`${this.baseUrl}?opcion=listadoMazos&usuario=${usuario}`);
  }

  decklistMazo(codigoBaraja: number) {
    return this.http.get(`${this.baseUrl}?opcion=decklistMazo&codigoBaraja=${codigoBaraja}`);
  }

  eliminaBarajaPersonalizada(codigoBaraja: number, usuario: number) {
    return this.http.post(`${this.baseUrl}?opcion=eliminaBarajaPersonalizada`, [codigoBaraja, usuario]);
  }

  datosBaraja(codigoBaraja: number, usuario: number, sitio: string) {
    return this.http.post(`${this.baseUrl}?opcion=datosBaraja`, [codigoBaraja, usuario, sitio]);
  }
}
