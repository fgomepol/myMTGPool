import { Component, Input, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MtgService } from '../../service/mtg.service';
import { StorageService } from '../../service/storage.service';

@Component({
  selector: 'app-modal-tendencia',
  templateUrl: './modal-tendencia.component.html',
  providers: [NgbModalConfig, NgbModal],
  styleUrls: [
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class ModalTendenciaComponent implements OnInit {
  public user: number;
  public datos: any;
  public nombreCarta: string;

  /*public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true
  };

  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartLabels: string[] = [];
  public barChartData: any[] = [];
  public barChartColors: any[] = [];

  @Input() id;

  constructor(config: NgbModalConfig,
    private modalService: NgbModal,
    private storageService: StorageService,
    private servicio: MtgService) {

      config.backdrop = 'static';
      config.keyboard = false;

      this.user = this.storageService.getCurrentUser();
    }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  open(content2) {

    this.modalService.open(content2);
  }

  cerrar() {
    this.modalService.dismissAll('Cross close');
  }

  ngOnInit() {

    this.servicio.tendenciaCarta(this.id).subscribe( data => {

      this.datos = data.json();

      this.nombreCarta = data.json()[0].name;

      const precioLow: string[] = [];
      const precioEx: string[] = [];
      const precioNm: string[] = [];
      const precioFoil: string[] = [];

      for (const item of this.datos) {
        const date = new Date(item.day * 1000);

        this.barChartLabels.push(date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear());
        precioLow.push(item.lowPoor);
        precioEx.push(item.lowEx);
        precioNm.push(item.trend);
        precioFoil.push(item.foil);
      }

      this.barChartData.push( { data: precioLow, label: 'Poor-Played'});

      this.barChartColors.push({
        backgroundColor: 'rgba(76, 25, 25, 1)'
      });

      this.barChartData.push( { data: precioEx, label: 'Exelent'});
      this.barChartColors.push({
        backgroundColor: 'rgba(242, 207, 78, 1)'
      });

      this.barChartData.push( { data: precioNm, label: 'Near Mint-Mint'});
      this.barChartColors.push({
        backgroundColor: 'rgba(63, 191, 27, 1)'
      });
      this.barChartData.push( { data: precioFoil, label: 'Foil'});
      this.barChartColors.push({
        backgroundColor: 'rgba(202, 144, 186, 1)'
      });

      console.log(this.barChartData);
    });
  }*/


  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartType = 'line';
  public lineChartLegend = true;

  public lineChartLabels: string[] = [];
  public lineChartData: any[] = [];
  public lineChartColors: any[] = [];

  @Input() id;

  constructor(config: NgbModalConfig,
    private modalService: NgbModal,
    private storageService: StorageService,
    private servicio: MtgService) {

      config.backdrop = 'static';
      config.keyboard = false;

      this.user = this.storageService.getCurrentUser();
    }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  open(content2) {

    this.modalService.open(content2);
  }

  cerrar() {
    this.modalService.dismissAll('Cross close');
  }

  ngOnInit() {

    this.servicio.tendenciaCarta(this.id).subscribe( data => {

      this.datos = data.json();

      this.nombreCarta = data.json()[0].name;

      const precioLow: string[] = [];
      const precioEx: string[] = [];
      const precioNm: string[] = [];
      const precioFoil: string[] = [];

      let precioPoorAux = 0;
      let precioExAux = 0;
      let precioNmAux = 0;
      let precioFoilAux = 0;

      for (const item of this.datos) {
        const date = new Date(item.day * 1000);

        this.lineChartLabels.push(date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear());

        if (item.lowPoor === 0) {
          item.lowPoor = precioPoorAux;
        } else {
          precioPoorAux = item.lowPoor;
        }

        if (item.lowEx === 0) {
          item.lowEx = precioExAux;
        } else {
          precioExAux = item.lowEx;
        }

        if (item.trend === 0) {
          item.trend = precioNmAux;
        } else {
          precioNmAux = item.trend;
        }

        if (item.foil === 0) {
          item.foil = precioFoilAux;
        } else {
          precioFoilAux = item.foil;
        }

        precioLow.push(item.lowPoor);
        precioEx.push(item.lowEx);
        precioNm.push(item.trend);
        precioFoil.push(item.foil);
      }

      this.lineChartData.push( { data: precioLow, label: 'Poor-Played'});

      this.lineChartColors.push({
        borderColor: 'rgba(76, 25, 25, 1)',
        backgroundColor: 'rgba(76, 25, 25, 0)'
      });

      this.lineChartData.push( { data: precioEx, label: 'Exelent'});
      this.lineChartColors.push({
        borderColor: 'rgba(242, 207, 78, 1)',
        backgroundColor: 'rgba(242, 207, 78, 0)'
      });

      this.lineChartData.push( { data: precioNm, label: 'Near Mint-Mint'});
      this.lineChartColors.push({
        borderColor: 'rgba(63, 191, 27, 1)',
        backgroundColor: 'rgba(63, 191, 27, 0)'
      });
      this.lineChartData.push( { data: precioFoil, label: 'Foil'});
      this.lineChartColors.push({
        borderColor: 'rgba(202, 144, 186, 1)',
        backgroundColor: 'rgba(202, 144, 186, 0)'
      });
    });
  }
}
