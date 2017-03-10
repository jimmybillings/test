import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';
import { Api, ApiResponse } from '../../shared/interfaces/api.interface';
import { Response } from '@angular/http';
import { User, Address } from '../../shared/interfaces/user.interface';
import { CurrentUserService } from './current-user.service';
/**
 * Service that provides api access registering new users.
 */
@Injectable()
export class UserService {
  public activeVersionId: string;
  constructor(private api: ApiService, private currentUser: CurrentUserService) { }

  public get(): Observable<any> {
    return this.api.get(Api.Identities, 'user/currentUser');
  }

  public create(user: Object): Observable<any> {
    return this.api.post(Api.Identities, 'user/register',
      { body: user, loading: true }
    );
  }

  public forgotPassword(user: any): Observable<any> {
    return this.api.post(Api.Identities, 'user/requestPasswordReset',
      { body: user, loading: true }
    );
  }

  public downloadActiveTosDocument(): Observable<any> {
    return this.api.get(Api.Identities, 'document/public/name/TOS').flatMap((response: ApiResponse) => {
      this.activeVersionId = response[0].activeVersionId;
      return this.api.get(Api.Identities, `document/public/downloadFile/${response[0].activeVersionId}`, { download: true });
    }).map((response: Response) => {
      return response.text();
    });
  }

  public agreeUserToTerms(): void {
    this.api.post(Api.Identities, `document/version/${this.activeVersionId}/agree`).take(1).subscribe();
  }

  // Used by a logged-in user to change their password
  public changePassword(form: any): Observable<any> {
    return this.api.post(Api.Identities, 'user/changePassword', {
      body: { oldPassword: form.oldPassword, newPassword: form.newPassword },
      loading: true
    });
  }

  // Used by a logged-out user to reset their password - requires overridingToken
  public resetPassword(form: any, overridingToken: string): Observable<any> {
    return this.api.post(Api.Identities, 'user/passwordReset',
      { body: { newPassword: form.newPassword }, overridingToken: overridingToken, loading: true }
    );
  }

  public getAddresses(returnValue?: string): Observable<any[]> {
    // return this.api.get(Api.Identities, 'user/currentUsersAssociatedAddresses');
    if (returnValue === 'empty') {
      return Observable.of([]);
    } else {
      return Observable.of(this.mockAddresses);
    }
  }

  public addBillingAddress(address: Address): Observable<any> {
    let newUser: User = Object.assign({}, JSON.parse(localStorage.getItem('currentUser')), { mailingAddress: address });
    return this.api.put(Api.Identities, `user/${newUser.id}`, { body: newUser }).do((user: User) => {
      localStorage.setItem('currentUser', JSON.stringify(user));
    });
  }

  private get mockAddresses(): any {
    return [
      {
        type: 'user',
        name: 'Ross',
        address: {
          street: '395 South Cherokee Street',
          city: 'Denver',
          country: 'USA',
          state: 'CO',
          zipcode: '80223',
          phone: '9086989024',
          suburb: 'Denver'
        }
      },
      {
        type: 'account',
        name: 'Wazee Digital',
        address: {
          street: '1515 Arapahoe Street, Tower 3, Suite 400',
          city: 'Denver',
          country: 'USA',
          state: 'CO',
          zipcode: '80202',
          phone: '5555555555',
          suburb: 'Denver'
        }
      },
      {
        type: 'account',
        name: 'Another Acount',
        address: {
          street: '123 Main Street, Suite 123',
          city: 'New York',
          country: 'USA',
          state: 'NY',
          zipcode: '10001',
          phone: '5555555555',
          suburb: 'Manhattan'
        }
      },
    ];
  }
}
