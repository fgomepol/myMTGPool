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

  listadoTorneos(formato: string, pagina: number = 1) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=listadoTorneos&formato=' + formato + '&page=' + pagina);
  }

  cartasBaraja(idTorneo: string, idBaraja: string) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=cartasBaraja&idTorneo=' + idTorneo + '&idBaraja=' + idBaraja);
  }

  barajasArquetipo(tipoBaraja: string, formato: string, pagina: number = 1) {
    return this.http.get('http://localhost/mkmApi/torneos.php?opcion=barajasArquetipo&formato=' + formato + '&tipoBaraja=' + tipoBaraja + '&page=' + pagina);
  }
}
