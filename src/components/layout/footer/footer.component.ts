import {Component, Input} from 'angular2/core';
import {NgClass, NgIf} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

/**
 * site footer component - renders the footer information
 */ 
@Component({
  selector: 'app-footer',
  templateUrl: 'components/layout/footer/footer.html',
  directives: [ROUTER_DIRECTIVES, NgClass, NgIf, MATERIAL_DIRECTIVES],
  inputs: ['currentUser', 'config']
})

export class Footer {
  @Input() currentUser;
  @Input() config;
}
