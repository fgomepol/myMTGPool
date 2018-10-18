import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class LoginModule {

  public username: string;
  public password: string;

  constructor( object: any) {
    this.username = (object.username) ? object.username : null;
    this.password = (object.password) ? object.password : null;
  }
}
