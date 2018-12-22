import { Component, OnInit } from '@angular/core';
import { MtgService } from '../../service/mtg.service';
import { StorageService } from '../../service/storage.service';
import { DeckEditorService } from 'src/app/service/deck-editor.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DeckModule } from 'src/app/models/deck.module';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editor-mazos',
  templateUrl: './editor-mazos.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/font-awesome/css/font-awesome.min.css',
    '../gestionar-coleccion/gestionar-coleccion.component.css',
    '../../vendor/Keyrune/css/keyrune.css',
    'editor-mazos.component.css'
]
})
export class EditorMazosComponent implements OnInit {

  public user: number;
  public pantalla = 'mazos';
  public loading = true;
  public hayMazos = false;
  public texto = 'Cargando editor de mazos, por favor espere';
  public forma: FormGroup;
  public forma2: FormGroup;
  public ocultaFiltros = true;
  public noEncontrado = false;
  public tipos;
  public subtipos;
  public edicionesCartas: any[] = [];
  public arquetipos: any[] = [];
  public cartasFormato: any[] = [];
  public imagen = '/src/assets/img/noimage.png';
  public valorMainAdd = '0';
  public valorSideAdd = '0';
  public valorMainDel = '0';
  public valorSideDel = '0';
  public cartasBaraja: DeckModule[] = [];
  public cartasMain: DeckModule[] = [];
  public cartasSide: DeckModule[] = [];
  public error = '';
  public formato = '';
  public loadingPendientes = false;

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

  // Variables de datos de la baraja
  public tierras = 0;
  public criaturas = 0;
  public instant = 0;
  public otros = 0;

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

  public importeBarajaEx: number;
  public importeBarajaNm: number;
  public cartasFaltan: any[] = [];
  public importeFaltaBarajaEx = 0;
  public importeFaltaBarajaMn = 0;

  public sumaTotal = 0;
  public totalMain = 0;
  public totalSide = 0;

  constructor(
    private storageService: StorageService,
    private servicioMtg: MtgService,
    private routerActivated: ActivatedRoute,
    private servicioEditor: DeckEditorService,
    private router: Router
  ) {
    this.forma = new FormGroup({
      'formato': new FormControl(''),
      'nombreBaraja': new FormControl('', Validators.required),
      'main': new FormControl(''),
      'side': new FormControl(''),
      'arquetipo': new FormControl(''),
      'cartasEdicion': new FormControl(''),
      'codBaraja': new FormControl('')
    });

    this.forma2 = new FormGroup({
      'nombre': new FormControl(''),
      'colors': new FormControl(''),
      'edicion': new FormControl(''),
      'rarity': new FormControl(''),
      'subtipo': new FormControl(''),
      'tipo': new FormControl('')
    });

    this.servicioMtg.listaTipos().subscribe(data => {
      this.tipos = data.json();
    });

    this.servicioMtg.listaSubtipos().subscribe(data => {
      this.subtipos = data.json();
    });

    this.servicioMtg.listadoEdiciones().subscribe(data => {
      this.edicionesCartas.push(data.json());
    });

   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();

    this.forma2.setValue({
      nombre : '',
      colors: '',
      edicion: '',
      rarity: '',
      subtipo: '',
      tipo: ''
    });

    this.texto = 'Cargando datos del mazo, por favor espere';
    this.loading = true;

    this.routerActivated.params.subscribe( params => {
      if (params['id'] && params['id2']) {

        if (params['id2'] === 'misBarajas' || params['id2'] === 'barajasTorneo') {

          this.servicioEditor.datosBaraja(params['id'], this.user, params['id2']).subscribe(data => {
            if (data['_body'] !== 'no hay datos') {

              const cartasDeck: any[] = [];
              cartasDeck.push(data.json()['baraja']);

              this.servicioEditor.listadoArquetipos(data.json()['formato']).subscribe(data3 => {
                this.arquetipos.push(data3.json());
              });

              this.servicioEditor.listaCartasFormato( this.forma2.value, data.json()['formato'], 0, '').subscribe( data2 => {

                this.cartasFormato.push(data2.json());

                if (params['id2'] === 'misBarajas') {

                  this.forma.setValue({
                    formato : data.json()['formato'],
                    nombreBaraja : data.json()['nombre'],
                    main : '',
                    side : '',
                    arquetipo : data.json()['arquetipo'],
                    cartasEdicion : data2.json()['0'].UID,
                    codBaraja: params['id']
                  });
                } else if (params['id2'] === 'barajasTorneo') {
                  this.forma.setValue({
                    formato : data.json()['formato'],
                    nombreBaraja : data.json()['nombre'],
                    main : '',
                    side : '',
                    arquetipo : data.json()['arquetipo'],
                    cartasEdicion : data2.json()['0'].UID,
                    codBaraja: 0
                  });
                }

                if (this.cartasFormato[0].length === 0) {
                  this.error = 'No hemos encontrado cartas con los criterios de búsqueda indicados.';
                  this.FadeOutLink();
                } else {
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

                  this.filtroMain(this.cartasBaraja);

                  setTimeout( () => {
                    this.filtroSide(this.cartasBaraja);
                  }, 2000);
                }
              }, error => console.error(error));
            } else {
              this.error = 'Los datos introducidos no pertenecen a ninguna baraja';
              this.FadeOutLink();
              this.loading = false;
            }
          });
        } else {
          this.error = 'Los datos introducidos no pertenecen a ninguna baraja';
          this.FadeOutLink();
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    });
  }

  guardarCambios() {
    this.texto = 'Validando baraja, por favor espere';
    this.loading = true;
    if (this.validaFormatoBaraja()) {
      this.servicioEditor.guardaBarajaPersonalizada( this.forma.value, this.cartasBaraja, this.user ).subscribe( data => {
        this.loading = false;
        this.router.navigate(['mazos']);
      }, error => console.error(error));
    } else {
      this.error = 'Hay cartas en baraja que no pertecen al formato seleccionado';
      this.FadeOutLink();
      this.loading = false;
    }
  }

  muestraFiltros(valor: boolean) {
    this.ocultaFiltros = valor;
  }

  buscarCartas() {

    this.texto = 'Filtrando resultados, por favor espere';
    this.loading = true;
    this.cartasFormato.splice(0);

    this.servicioEditor.listaCartasFormato( this.forma2.value, this.formato, 0, '').subscribe( data => {

      this.cartasFormato.push(data.json());

      if (this.cartasFormato[0].length === 0) {
        this.error = 'No hemos encontrado cartas con los criterios de búsqueda indicados.';
        this.FadeOutLink();
      }

      this.loading = false;
    }, error => console.error(error));
  }

  reseteaBusqueda() {
    this.forma2.reset();
  }

  cambiaFormato(formato: string) {

    this.formato = formato;
    this.texto = 'Cargando datos del formato, por favor espere';

    this.arquetipos.splice(0);
    this.cartasFormato.splice(0);
    this.loading = true;

    this.servicioEditor.listadoArquetipos(formato).subscribe(data => {
      this.arquetipos.push(data.json());
    });

    this.servicioEditor.listaCartasFormato(this.forma2.value, formato, 0, '').subscribe(data => {
      this.cartasFormato.push(data.json());
      this.forma.setValue({
        formato : formato,
        nombreBaraja : '',
        main : '',
        side : '',
        arquetipo : '',
        cartasEdicion : data.json()['0'].UID,
        codBaraja: 0
      });

      this.valorMainAdd = data.json()['0'].UID;
      this.valorSideAdd = data.json()['0'].UID;

      this.cambiaImagen(data.json()['0'].UID, 'baraja');
      this.loading = false;
    });
  }

  cambiaImagen(valor: string, lista: string) {
    this.valorMainAdd = valor;
    this.valorSideAdd = valor;

    if (lista === 'main') {
      this.valorMainDel = valor;
      this.valorSideDel = '0';
    } else if (lista === 'side') {
      this.valorMainDel = '0';
      this.valorSideDel = valor;
    } else if (lista === 'baraja') {
      this.valorMainDel = '0';
      this.valorSideDel = '0';
    }

    let encontrado = false;
    for (const elemento of this.cartasFormato[0]) {

      if (elemento.UID == valor) {
        this.imagen = elemento.imagen;
        encontrado = true;
      }
    }

    if (!encontrado) {
      this.imagen = '/src/assets/img/noimage.png';
    }
  }

  // Controlamos la base de la baraja

  addMain(valor: number) {
    let carta: DeckModule;
    let encontrado = false;

    for (let i = 0; i < this.cartasBaraja.length; i++) {
      if (this.cartasBaraja[i].UID == valor) {
        const compruebaCantidad = this.comprubaCantidadValida(this.cartasBaraja[i]);

        if (compruebaCantidad) {
          this.cartasBaraja[i].cantidad = this.cartasBaraja[i].cantidad + 1;
          this.valorMainDel = valor.toString();
        }
        encontrado = true;
      }
    }

    if (!encontrado) {
      const obj = this.cartasFormato[0].find(obj => obj.UID == valor);
      carta = {
        UID: valor,
        name: obj.name,
        cantidad: 1,
        side: 0,
        tipo: obj.type,
        color: obj.colors,
        rareza: obj.rarity,
        cmc: obj.cmc,
        importeEx: obj.importeEx,
        importeNm: obj.importeNm
      };

      this.cartasBaraja.push(carta);
      this.valorMainDel = carta.UID.toString();
    }

    this.filtroMain(this.cartasBaraja);
  }

  filtroMain(listaCartas: DeckModule[]) {
    let carta: DeckModule;
    this.cartasMain.splice(0);
    this.totalMain = 0;

    for (const element of listaCartas) {
      if (element.cantidad - element.side > 0) {
        carta = {
          UID: element.UID,
          name: element.name,
          cantidad: element.cantidad - element.side,
          side: 0,
          tipo: element.tipo,
          color: element.color,
          rareza: element.rareza,
          cmc: element.cmc,
          importeEx: element.importeEx,
          importeNm: element.importeNm
        };

        this.cartasMain.push(carta);
        this.totalMain = this.totalMain + (element.cantidad - element.side);
      }
    }

    this.compruebaBaraja();
  }

  // Controlamos el side de la baraja

  filtroSide(listaCartas: DeckModule[]) {
    let carta: DeckModule;
    this.cartasSide.splice(0);
    this.totalSide = 0;

    for (const element of listaCartas) {
      if (element.side > 0) {
        carta = {
          UID: element.UID,
          name: element.name,
          cantidad: element.cantidad,
          side: element.side,
          tipo: element.tipo,
          color: element.color,
          rareza: element.rareza,
          cmc: element.cmc,
          importeEx: element.importeEx,
          importeNm: element.importeNm
        };

        this.cartasSide.push(carta);
        this.totalSide = this.totalSide + element.side;
      }
    }

    this.compruebaBaraja();
  }

  addSide(valor: number) {
    let carta: DeckModule;
    let encontrado = false;
    let cartasSide = 0;

    for (const element of this.cartasSide) {
        cartasSide = cartasSide + element.side;
    }

    if (cartasSide < 15) {

      for (let i = 0; i < this.cartasBaraja.length; i++) {
        if (this.cartasBaraja[i].UID == valor) {
          const compruebaCantidad = this.comprubaCantidadValida(this.cartasBaraja[i]);
          if (compruebaCantidad) {
            this.cartasBaraja[i].cantidad = this.cartasBaraja[i].cantidad + 1;
            this.cartasBaraja[i].side = this.cartasBaraja[i].side + 1;
            this.valorSideDel = valor.toString();
          }
          encontrado = true;
        }
      }

      if (!encontrado) {
        const obj = this.cartasFormato[0].find(obj => obj.UID == valor);

        carta = {
          UID: valor,
          name: obj.name,
          cantidad: 1,
          side: 1,
          tipo: obj.type,
          color: obj.colors,
          rareza: obj.rarity,
          cmc: obj.cmc,
          importeEx: obj.importeEx,
          importeNm: obj.importeNm
        };
        this.cartasBaraja.push(carta);
        this.valorSideDel = carta.UID.toString();
      }

      this.filtroSide(this.cartasBaraja);
    } else {
      this.error = 'Tu banquillo ya está completo';
      this.FadeOutLink();
    }
  }

  // Validamos que el numero de cartas de la baraja sea correcto

  comprubaCantidadValida (elemento: DeckModule) {
    let valido = true;

    if (elemento.UID == parseFloat('456080') || elemento.UID == parseFloat('455927') || elemento.UID == parseFloat('456239') || elemento.UID == parseFloat('455777') || elemento.UID == parseFloat('455928') || elemento.UID == parseFloat('407693')) {
      valido = true;
    } else {
      for (const element of this.cartasFormato[0]) {

        if (element.UID == elemento.UID && elemento.cantidad >= element.cantidad) {
          valido = false;
          this.error = 'Ya ha introducido el número máximo de cartas permitido';
          this.FadeOutLink();
          break;
        } else if (element.UID == elemento.UID && elemento.cantidad < element.cantidad) {
          break;
        }
      }
    }

    return valido;
  }

  FadeOutLink() {
    setTimeout( () => {
      this.error = '';
    }, 3000);
  }

  delete(valor: number, sitio: string) {

    for (let i = 0; i < this.cartasBaraja.length; i++) {
      if (this.cartasBaraja[i].UID == valor) {
        if (this.cartasBaraja[i].cantidad - 1 === 0) {
          this.cartasBaraja.splice(i, 1);
          this.valorMainDel = '0';
          this.valorSideDel = '0';
        } else {
          this.cartasBaraja[i].cantidad = this.cartasBaraja[i].cantidad - 1;
          if (sitio === 'side') {
            this.cartasBaraja[i].side = this.cartasBaraja[i].side - 1;
          }
        }
      }
    }

    if (sitio === 'main') {
      this.filtroMain(this.cartasBaraja);
    } else if (sitio === 'side') {
      this.filtroSide(this.cartasBaraja);
    }
  }

  compruebaBaraja() {

    this.loadingPendientes = true;

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

    this.actualizaListado(true);
  }

  public actualizaListado($event) {

    if ($event === true) {
      this.cartasFaltan.splice(0);
      this.servicioEditor.comparacionColeccion(this.cartasBaraja, this.user).subscribe(data => {

        if (data['_body'] !== 'no hay datos') {
          this.cartasFaltan = data.json();
        }

        this.importeFaltaBarajaEx = 0;
        this.importeFaltaBarajaMn = 0;

        if (this.cartasFaltan.length > 0) {
          for (const item of this.cartasFaltan) {
            this.importeFaltaBarajaEx = this.importeFaltaBarajaEx + (parseFloat(item.importeEx) * item.cantidad);
            this.importeFaltaBarajaMn = this.importeFaltaBarajaMn + (parseFloat(item.importeNm) * item.cantidad);
          }
        }
        this.loadingPendientes = false;
        this.loading = false;
      });
    }
  }

  public validaFormatoBaraja () {
      let valida = true;
      const cartasFormato: any[] = [];

      this.servicioEditor.listaCartasFormato('', this.formato, 0, '').subscribe(data => {
        cartasFormato.push(data.json());

        for (const carta of this.cartasBaraja) {
          const obj = cartasFormato[0].find(obj => obj.UID == carta.UID);
          if (!obj) {
            valida = false;
            break;
          }
        }
      });

      return valida;
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  public redireccionExterna(url: string) {
    window.open('https://www.cardmarket.com/en/Magic/Cards/' + url, '_blank');
  }

}
