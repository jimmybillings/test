import {Component} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {CurrentUser} from '../../../common/models/current-user.model';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

@Component({
  selector: 'app-footer',
  templateUrl: 'components/application/footer/footer.html',
  directives: [ROUTER_DIRECTIVES, NgClass, MATERIAL_DIRECTIVES],
  inputs: ['currentUser']
})


export class Footer {
  public currentUser: CurrentUser;
  
  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
}
