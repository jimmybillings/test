import { Injectable } from '@angular/core';
import { CurrentUserService } from '../../../shared/services/current-user.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class QuoteCapabilities {
  constructor(public currentUser: CurrentUserService) { }

  public administerQuotes(): boolean {
    return this.userHas('CreateQuotes') && this.userHas('DeleteQuotes') && this.userHas('EditQuotes');
  }

  public userHas(permission: string): boolean {
    return this.currentUser.hasPermission(permission);
  }
}
