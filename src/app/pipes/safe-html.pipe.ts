import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})

export class SafeHtmlPipe implements PipeTransform  {

  transform(value: string): SafeHtml {

    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(value, 'text/html');

    for (let i = 0; i < parsedHtml.getElementsByTagName('a').length; i++) {
      parsedHtml.getElementsByTagName('a').item(i).setAttribute('routerLink', '');
    }

    console.log(parsedHtml);

    return parsedHtml;
  }
}

