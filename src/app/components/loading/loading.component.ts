import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['loading.component.css'],
})
export class LoadingComponent implements OnInit {

  @Input() texto;

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    clearTimeout(setTimeout(() => {
        /** spinner ends after 300 seconds */
        this.spinner.hide();
    }, 300000));
  }
}
