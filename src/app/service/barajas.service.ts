import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class BarajasService {

  constructor(private http: Http) { }

  listaBarajasTorneo(idTorneo: string) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=listaBarajasTorneo&idTorneo=' + idTorneo);
  }

  listadoTorneos(formato: string) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=listadoTorneos&formato=' + formato);
  }

  cartasBaraja(idTorneo: string, idBaraja: string) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=cartasBaraja&idTorneo=' + idTorneo + '&idBaraja=' + idBaraja);
  }

  barajasArquetipo(tipoBaraja: string, formato: string, pagina: number = 1) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=barajasArquetipo&formato=' + formato + '&tipoBaraja=' + tipoBaraja + '&page=' + pagina);
  }

  resultados(jugador: string) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=resultados&jugador=' + jugador);
  }

  topArquetipos(formato: string) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=topArquetipos&formato=' + formato);
  }

  barajasUltimoMes(formato: string) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=barajasUltimoMes&formato=' + formato);
  }

  barajasMetajuego(formato: string) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=barajasMetajuego&formato=' + formato);
  }
}
