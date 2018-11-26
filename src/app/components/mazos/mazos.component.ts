import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BarajasService } from 'src/app/service/barajas.service';
import { MtgService } from '../../service/mtg.service';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-mazos',
  templateUrl: './mazos.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../gestionar-coleccion/gestionar-coleccion.component.css'
]
})
export class MazosComponent implements OnInit {
  public user: number;
  public pantalla = 'mazos';
  public loading = true;
  public hayMazos = false;
  public datosDecklist: any;
  public barajas: any;
  public texto = 'Cargando tus mazos, por favor espere';

  constructor(
    private storageService: StorageService,
    private servicioBarajas: BarajasService,
    private servicioMtg: MtgService
  ) {
   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.servicioMtg.listadoMazos(this.user).subscribe(data => {
      // this.barajas = data.json();
      this.loading = false;
    });
  }

  public descargaPDF(codigoBaraja: number) {

    this.servicioBarajas.decklistMazo(codigoBaraja).subscribe(data => {

      this.datosDecklist = data.json();

      const doc = new jsPDF('p', 'mm', 'a4');
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      doc.addImage('/src/assets/img/mtg_registration.jpeg', 'JPEG', 0, 0, width, height);
      doc.setFont('times');
      doc.setFontSize(9);
      doc.text(this.datosDecklist.arquetipo, 142, 36);

      let y = 69;
      let x = 30;
      let x2 = 45;
      let y2 = 157;
      let contador = 0;
      let contador2 = 0;
      let totalBase = 0;
      let totalSide = 0;
      let nCartas = 0;

      for (const item of this.datosDecklist.baraja) {
        const cantidadBase = item.cantidad - item.side;

        if (cantidadBase > 0) {
          doc.text(cantidadBase.toString(), x, y);
          doc.text(item.name, x2, y);

          if (contador > 2) {
            y = y + 9;
            contador = 0;
          } else {
            y = y + 6;
            contador++;
          }
          totalBase = totalBase + cantidadBase;
          nCartas++;

          if (nCartas === 31) {
            x = 123;
            x2 = 138;
            y = 69;
            contador = 0;
          }
        }

        if (item.side > 0) {
          doc.text(item.side.toString(), 123, y2);
          doc.text(item.name, 138, y2);

          if (contador2 > 2) {
            y2 = y2 + 9;
            contador2 = 0;
          } else {
            y2 = y2 + 6;
            contador2++;
          }
          totalSide = totalSide + parseFloat(item.side);
        }
      }

      doc.text(totalBase.toString(), 95, 280);
      doc.text(totalSide.toString(), 187, 260);

      doc.save('DeckList ' + this.datosDecklist.nombre + '.pdf');
    });
  }
}
