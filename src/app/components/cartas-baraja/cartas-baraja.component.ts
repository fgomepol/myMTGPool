import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { BarajasService } from '../../service/barajas.service';
import { ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';
import { DeckModule } from 'src/app/models/deck.module';
import { DeckEditorService } from 'src/app/service/deck-editor.service';
import { MtgService } from '../../service/mtg.service';

@Component({
  selector: 'app-cartas-baraja',
  templateUrl: './cartas-baraja.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../../vendor/Keyrune/css/keyrune.css'
]
})
export class CartasBarajaComponent implements OnInit {

  public user: number;
  public pantalla = 'torneos';
  public html: any;
  public cargado = false;
  public formato = '';
  public pagina = '';
  public torneo = '';
  public codigoBaraja: number;
  public baraja: any;
  public loading = true;
  public loadingPendientes = false;
  public favorita = false;
  public totalCartas: number;
  public importeBarajaEx: number;
  public importeBarajaNm: number;
  public cartasFaltan: any[] = [];
  public cartasPrestadas: any[] = [];
  public importeFaltaBarajaEx = 0;
  public importeFaltaBarajaMn = 0;
  public texto = 'Cargando baraja, por favor espere';
  public datosDecklist: any;
  public nombreBaraja = '';
  public arquetipo = '';
  public jugador = '';
  public posicion = '';
  public error = '';

  // Variables de datos de la baraja
  public tierras = 0;
  public criaturas = 0;
  public instantaneos = 0;
  public conjuros = 0;
  public encantamientos = 0;
  public planeswalkers = 0;
  public artefactos = 0;
  public otros = 0;
  public sideboard = 0;

  public cartasBaraja: DeckModule[] = [];
  public cartasTierras: DeckModule[] = [];
  public cartasCriaturas: DeckModule[] = [];
  public cartasInstantaneos: DeckModule[] = [];
  public cartasConjuros: DeckModule[] = [];
  public cartasEncantamientos: DeckModule[] = [];
  public cartasPlaneswalkers: DeckModule[] = [];
  public cartasArtefactos: DeckModule[] = [];
  public cartasOtros: DeckModule[] = [];
  public cartasSideboard: DeckModule[] = [];
  public cartasFormato: any[] = [];

  public comunes = 0;
  public infrecuentes = 0;
  public raras = 0;
  public miticas = 0;

  public rojas = 0;
  public negras = 0;
  public blancas = 0;
  public verdes = 0;
  public azules = 0;
  public incoloras = 0;

  public sumaTotal = 0;
  public totalMain = 0;
  public totalSide = 0;

  // grafico para colores de la baraja
  public doughnutChartLabels: string[] = ['Rojas', 'Azules', 'Verdes', 'Negras', 'Blancas', 'Incoloras', 'Tierras'];
  public donutColors = [
  {
    backgroundColor: [
      'rgba(209, 0, 3, 1)',
      'rgba(91, 154, 255, 1)',
      'rgba(22, 196, 45, 1)',
      'rgba(0, 0, 0, 1)',
      'rgba(212, 198, 0, 0.637)',
      'rgba(182, 182, 182, 1)',
      'rgba(113, 81, 69, 1)'
    ]
  }
  ];

  public doughnutChartType = 'doughnut';
  public doughnutChartData: number[] = [];
  public doughnutPercentage: number[] = [];
  public rarityPercentage: number[] = [];

  // grafico para curva de mana

  public lineChartType = 'line';
  public lineChartLegend = true;

  // ['Coste 0', 'Coste 1', 'Coste 2', 'Coste 3', 'Coste 4', 'Coste 5', 'Coste 6', 'Coste 7', 'Coste 8', 'Coste 9', 'Coste 10', 'Coste 11', 'Coste 12', 'Coste 13', 'Coste 14', 'Coste 15', 'Coste 16']
  public lineChartLabels: string[] = [];
  public lineChartData: any[] = [];

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0)',
      borderColor: 'rgba(148,159,177,1)'
    }
  ];

  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 5
        }
      }]
    }
  };

  constructor(
    private storageService: StorageService,
    private servicio: BarajasService,
    private mtgService: MtgService,
    private routerActivated: ActivatedRoute,
    private servicioEditor: DeckEditorService
  ) {
   }

   ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.routerActivated.params.subscribe( params => {

      this.servicioEditor.datosBaraja(params['id3'], this.user, 'barajasTorneo').subscribe(data => {

        this.formato = params['id'];
        this.torneo = params['id2'];
        this.codigoBaraja = params['id3'];

        if (data['_body'] !== 'no hay datos') {

          this.cartasFormato.splice(0);
          this.nombreBaraja = data.json()['nombre'];
          this.arquetipo = data.json()['arquetipo'];
          this.jugador = data.json()['jugador'];
          this.posicion = data.json()['posicion'];

          this.servicioEditor.listaCartasFormato('', this.formato, params['id3'], 'barajasTorneo').subscribe( data2 => {

			this.cartasFormato.push(data2.json());

            const cartasDeck: any[] = [];
            cartasDeck.push(data.json()['baraja']);

            for (const cartaDeck of cartasDeck[0]) {

              const carta = {
                UID: cartaDeck.UID,
                name: cartaDeck.name,
                cantidad: parseFloat(cartaDeck.cantidad),
                side: parseFloat(cartaDeck.side),
                tipo: cartaDeck.tipo,
                color: cartaDeck.color,
                rareza: cartaDeck.rareza,
                cmc: cartaDeck.cmc,
                importeEx: cartaDeck.importeEx,
                importeNm: cartaDeck.importeNm
              };

              this.cartasBaraja.push(carta);
            }

            this.compruebaBaraja();
          });

        } else {
          this.error = 'Los tados introducidos no pertenecen a nunguna baraja';
          this.FadeOutLink();
          this.loading = false;
        }
      });

      this.servicio.compruebaFavorita(params['id3'], this.user).subscribe(data => {
        if (data['_body'] !== '[]') {
          this.favorita = true;
        }
      });
    });
  }

  public redireccionExterna(url: string) {
    window.open('https://www.cardmarket.com/en/Magic/Cards/' + url, '_blank');
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  public actualizaListado($event) {
    if ($event === true) {
      this.loadingPendientes = true;
      this.servicio.comparacionColeccion(this.codigoBaraja, this.user).subscribe(data => {

        this.cartasFaltan.splice(0);
        this.cartasFaltan = data.json();

        this.importeFaltaBarajaEx = 0;
        this.importeFaltaBarajaMn = 0;

        for (const item of this.cartasFaltan) {
          this.importeFaltaBarajaEx = this.importeFaltaBarajaEx + (parseFloat(item.importeEx) * item.cantidad);
          this.importeFaltaBarajaMn = this.importeFaltaBarajaMn + (parseFloat(item.importeNm) * item.cantidad);
        }
        this.loadingPendientes = false;
        this.loading = false;
      });
    }
  }

  public listaCartasPrestadas() {
    this.mtgService.comparacionPrestadas(this.user, this.codigoBaraja, 'barajasTorneo').subscribe(data => {

      this.cartasPrestadas.splice(0);

      if (data['_body'] !== '[]') {
        this.cartasPrestadas.push(data.json());
      }
    });
  }

  public descargaPDF() {

    this.servicio.decklist(this.codigoBaraja).subscribe(data => {

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

      doc.save('DeckList ' + this.datosDecklist.arquetipo + '.pdf');
    });
  }

  public marcarFavorita(valor: string) {
    this.servicio.addFavorita(this.codigoBaraja, this.user, valor).subscribe(data => {
      if (valor === 'N') {
        this.favorita = false;
      } else {
        this.favorita = true;
      }
    });
  }

  compruebaBaraja() {

    this.importeBarajaEx = 0;
    this.importeBarajaNm = 0;

    this.tierras = 0;
    this.criaturas = 0;
    this.instantaneos = 0;
    this.conjuros = 0;
    this.encantamientos = 0;
    this.planeswalkers = 0;
    this.artefactos = 0;
    this.otros = 0;
    this.sideboard = 0;

    this.cartasTierras.splice(0);
    this.cartasCriaturas.splice(0);
    this.cartasInstantaneos.splice(0);
    this.cartasConjuros.splice(0);
    this.cartasEncantamientos.splice(0);
    this.cartasPlaneswalkers.splice(0);
    this.cartasArtefactos.splice(0);
    this.cartasOtros.splice(0);
    this.cartasSideboard.splice(0);

    this.comunes = 0;
    this.infrecuentes = 0;
    this.raras = 0;
    this.miticas = 0;

    this.rojas = 0;
    this.negras = 0;
    this.blancas = 0;
    this.verdes = 0;
    this.azules = 0;
    this.incoloras = 0;

    this.sumaTotal = 0;

    const coste = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < this.cartasBaraja.length; i++) {
      switch (this.cartasBaraja[i].rareza) {
        case 'common':
          this.comunes = this.comunes + this.cartasBaraja[i].cantidad;
          break;
        case 'uncommon':
          this.infrecuentes = this.infrecuentes + this.cartasBaraja[i].cantidad;
          break;
        case 'rare':
          this.raras = this.raras + this.cartasBaraja[i].cantidad;
          break;
        case 'mythic':
          this.miticas = this.miticas + this.cartasBaraja[i].cantidad;
          break;
      }

      if (this.cartasBaraja[i].tipo.includes('Land')) {
        if (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side > 0) {
          this.tierras = this.tierras + (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side);
          this.cartasTierras.push(this.cartasBaraja[i]);
        }
      } else if (this.cartasBaraja[i].tipo.includes('Creature')) {
        if (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side > 0) {
          this.criaturas = this.criaturas + (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side);
          this.cartasCriaturas.push(this.cartasBaraja[i]);
        }
      } else if (this.cartasBaraja[i].tipo.includes('Instant')) {
        if (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side > 0) {
          this.instantaneos = this.instantaneos + (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side);
          this.cartasInstantaneos.push(this.cartasBaraja[i]);
        }
      } else if (this.cartasBaraja[i].tipo.includes('Sorcery')) {
        if (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side > 0) {
          this.conjuros = this.conjuros + (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side);
          this.cartasConjuros.push(this.cartasBaraja[i]);
        }
      } else if (this.cartasBaraja[i].tipo.includes('Enchantment')) {
        if (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side > 0) {
          this.encantamientos = this.encantamientos + (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side);
          this.cartasEncantamientos.push(this.cartasBaraja[i]);
        }
      } else if (this.cartasBaraja[i].tipo.includes('Planeswalker')) {
        if (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side > 0) {
          this.planeswalkers = this.planeswalkers + (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side);
          this.cartasPlaneswalkers.push(this.cartasBaraja[i]);
        }
      } else if (this.cartasBaraja[i].tipo.includes('Artifact')) {
        if (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side > 0) {
          this.artefactos = this.artefactos + (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side);
          this.cartasArtefactos.push(this.cartasBaraja[i]);
        }
      } else {
        if (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side > 0) {
          this.otros = this.otros + (this.cartasBaraja[i].cantidad - this.cartasBaraja[i].side);
          this.cartasOtros.push(this.cartasBaraja[i]);
        }
      }

      if (this.cartasBaraja[i].side > 0) {
        this.sideboard = this.sideboard + this.cartasBaraja[i].side;
        this.cartasSideboard.push(this.cartasBaraja[i]);
      }

      if (this.cartasBaraja[i].color.includes('R')) {
        this.rojas = this.rojas + this.cartasBaraja[i].cantidad;
      }
      if (this.cartasBaraja[i].color.includes('G')) {
        this.verdes = this.verdes + this.cartasBaraja[i].cantidad;
      }
      if (this.cartasBaraja[i].color.includes('U')) {
        this.azules = this.azules + this.cartasBaraja[i].cantidad;
      }
      if (this.cartasBaraja[i].color.includes('B')) {
        this.negras = this.negras + this.cartasBaraja[i].cantidad;
      }
      if (this.cartasBaraja[i].color.includes('W')) {
        this.blancas = this.blancas + this.cartasBaraja[i].cantidad;
      }

      if (this.cartasBaraja[i].color === '' && !this.cartasBaraja[i].tipo.includes('Land')) {
        this.incoloras = this.incoloras + this.cartasBaraja[i].cantidad;
      }

      if (this.cartasBaraja[i].cmc !== '') {
        coste[this.cartasBaraja[i].cmc] = coste[this.cartasBaraja[i].cmc] + this.cartasBaraja[i].cantidad;
      }

      this.sumaTotal = this.sumaTotal + this.cartasBaraja[i].cantidad;
      this.importeBarajaEx = this.importeBarajaEx + (this.cartasBaraja[i].importeEx * this.cartasBaraja[i].cantidad);
      this.importeBarajaNm = this.importeBarajaNm + (this.cartasBaraja[i].importeNm * this.cartasBaraja[i].cantidad);

    }

    this.doughnutChartData = [this.rojas, this.azules, this.verdes, this.negras, this.blancas, this.incoloras, this.tierras];
    this.doughnutPercentage = [ Math.round((this.rojas / this.sumaTotal) * 100), Math.round((this.azules / this.sumaTotal) * 100), Math.round((this.verdes / this.sumaTotal) * 100), Math.round((this.negras / this.sumaTotal) * 100), Math.round((this.blancas / this.sumaTotal) * 100), Math.round((this.incoloras / this.sumaTotal) * 100), Math.round((this.tierras / this.sumaTotal) * 100)];
    this.rarityPercentage = [ Math.round((this.miticas / this.sumaTotal) * 100), Math.round((this.raras / this.sumaTotal) * 100), Math.round((this.infrecuentes / this.sumaTotal) * 100), Math.round((this.comunes / this.sumaTotal) * 100) ];

    const datosChart: string[] = [];

    this.lineChartLabels.splice(0);

    for (let i = 0; i <= 16; i++) {
      if (coste[i] > 0) {
        datosChart.push(coste[i].toString());
        this.lineChartLabels.push('Coste ' + i);
      }
    }

    this.lineChartData = datosChart;

    if (this.cartasFaltan.length > 0) {
      this.cartasFaltan.splice(0);
    }

    this.listaCartasPrestadas();

    this.actualizaListado(true);
  }

  FadeOutLink() {
    setTimeout( () => {
      this.error = '';
    }, 3000);
  }
}
