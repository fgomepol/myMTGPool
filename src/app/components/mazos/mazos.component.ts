import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { MtgService } from '../../service/mtg.service';

@Component({
  selector: 'app-mazos',
  templateUrl: './mazos.component.html',
  styleUrls: [
    '../../vendor/bootstrap/css/bootstrap.min.css',
    '../../vendor/metisMenu/metisMenu.min.css',
    '../../dist/css/sb-admin-2.css',
    '../../vendor/morrisjs/morris.css',
    '../../vendor/font-awesome/css/font-awesome.min.css'
]
})
export class MazosComponent implements OnInit {
  public user: number;
  public pantalla = 'mazos';

  constructor(
    private storageService: StorageService,
    private servicio: MtgService
  ) {
   }

  ngOnInit() {
  }
}
