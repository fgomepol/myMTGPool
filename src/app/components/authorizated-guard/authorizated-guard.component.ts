import { Component } from '@angular/core';
import { Router, CanActivate  } from '@angular/router';
import { StorageService } from '../../service/storage.service';

@Component({
  selector: 'app-authorizated-guard',
  templateUrl: './authorizated-guard.component.html'
})
export class AuthorizatedGuardComponent implements CanActivate {

  constructor(private router: Router,
              private storageService: StorageService) { }

  canActivate() {
    if (this.storageService.isAuthenticated()) {
      return true;
    }

     this.router.navigate(['/index']);
     return false;
  }
}
