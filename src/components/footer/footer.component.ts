import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass, NgIf} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

/**
 * site footer component - renders the footer information
 */ 
@Component({
  selector: 'app-footer',
  templateUrl: 'components/footer/footer.html',
  directives: [ROUTER_DIRECTIVES, NgClass, NgIf, MATERIAL_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Footer {
  @Input() currentUser;
  @Input() config;
}
