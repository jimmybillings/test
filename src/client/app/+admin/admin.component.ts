import {Component} from '@angular/core';
import {CurrentUser} from '../shared/services/current-user.model';

@Component({
  moduleId: module.id,
  selector: 'admin-component',
  templateUrl: 'admin.html',
})

export class AdminComponent {
  constructor(public currentUser: CurrentUser) {}
}
