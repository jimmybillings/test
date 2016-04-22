import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'values',
  pure: false
})

export class ValuesPipe implements PipeTransform {
  transform(value: any): any {
    return Object.keys(value).map(key => key);
  }
}
