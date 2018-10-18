import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class PrestamosComponent implements OnInit {

  public user: number;
  public pantalla = 'prestamos';

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {
   }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();
  }

}
