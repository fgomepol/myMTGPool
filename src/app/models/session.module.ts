import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class SessionModule {
  public token: string;
  public id: number;
  public userName: string;
}
