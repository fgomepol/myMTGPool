import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class BarajasService {

  public baseUrl = 'http://localhost/mkmApi/torneos.php';

  constructor(private http: Http) { }

  listaBarajasTorneo(idTorneo: string, formato: string, usuario: number) {
    return this.http.get(`${this.baseUrl}?opcion=listaBarajasTorneo&idTorneo=${idTorneo}&formato=${formato}&usuario=${usuario}`);
  }

  listadoTorneos(formato: string) {
    return this.http.get(`${this.baseUrl}?opcion=listadoTorneos&formato=${formato}`);
  }

  cartasBaraja(idTorneo: string, idBaraja: string) {
    return this.http.get(`${this.baseUrl}?opcion=cartasBaraja&idTorneo=${idTorneo}&idBaraja=${idBaraja}`);
  }

  barajasArquetipo(tipoBaraja: string, formato: string, usuario: number, pagina: number = 1) {
    return this.http.get(`${this.baseUrl}?opcion=barajasArquetipo&formato=${formato}&tipoBaraja=${tipoBaraja}&usuario=${usuario}&page=${pagina}`);
  }

  resultados(jugador: string, formato: string) {
    return this.http.get(`${this.baseUrl}?opcion=resultados&jugador=${jugador}&formato=${formato}`);
  }

  topArquetipos(formato: string, limite: number) {
    return this.http.get(`${this.baseUrl}?opcion=topArquetipos&formato=${formato}&limite=${limite}`);
  }

  barajasUltimoMes(formato: string, limite: number) {
    return this.http.get(`${this.baseUrl}?opcion=barajasUltimoMes&formato=${formato}&limite=${limite}`);
  }

  barajasMetajuego(formato: string) {
    return this.http.get(`${this.baseUrl}?opcion=barajasMetajuego&formato=${formato}`);
  }

  barajasSugerencia(formato: string) {
    return this.http.get(`${this.baseUrl}?opcion=barajasSugerencia&formato=${formato}`);
  }

  datosEstadisticosBaraja(idBaraja: number) {
    return this.http.get(`${this.baseUrl}?opcion=datosEstadisticosBaraja&idBaraja=${idBaraja}`);
  }

  ultimosTorneos(formato: string, limite: number) {
    return this.http.get(`${this.baseUrl}?opcion=ultimosTorneos&formato=${formato}&limite=${limite}`);
  }

  comparacionColeccion(idBaraja: number, usuario: number) {
    return this.http.get(`${this.baseUrl}?opcion=comparacionColeccion&idBaraja=${idBaraja}&usuario=${usuario}`);
  }

  decklist(codigoBaraja: number) {
    return this.http.get(`${this.baseUrl}?opcion=decklist&codigoBaraja=${codigoBaraja}`);
  }

  compruebaFavorita(idBaraja: number, usuario: number) {
    return this.http.get(`${this.baseUrl}?opcion=compruebaFavorita&idBaraja=${idBaraja}&usuario=${usuario}`);
  }

  addFavorita(idBaraja: number, usuario: number, valor: string) {
    return this.http.get(`${this.baseUrl}?opcion=addFavorita&idBaraja=${idBaraja}&usuario=${usuario}&valor=${valor}`);
  }

  listaBarajasFavoritas(usuario: number) {
    return this.http.get(`${this.baseUrl}?opcion=listaBarajasFavoritas&usuario=${usuario}`);
  }
}
