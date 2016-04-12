import {Component, ChangeDetectionStrategy, Input} from 'angular2/core';
/**
 * site header component - renders the header information
 */ 
@Component({
  selector: 'notification',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Notification {
  @Input() state: string;
  
  ngOnChanges(changes) {
    if (changes.state && changes.state.currentValue.indexOf('confirmed=true') > 0) setTimeout(() => console.log('Welcome new user'), 200);
  }
}
