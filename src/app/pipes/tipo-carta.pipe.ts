import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoCarta'
})
export class TipoCartaPipe implements PipeTransform {

  transform(value: string): string {
    let tipoFinal: string[];

    tipoFinal = value.split('  ');

    return tipoFinal[0];
  }

}
