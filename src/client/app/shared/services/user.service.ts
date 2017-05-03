import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../shared/services/api.service';
import { Api, ApiResponse } from '../../shared/interfaces/api.interface';
import { Response } from '@angular/http';
import { User, Address, ViewAddress, Document } from '../../shared/interfaces/user.interface';
import { CurrentUserService } from './current-user.service';
/**
 * Service that provides api access registering new users.
 */
@Injectable()
export class UserService {
  public documentId: number;
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
    return this.api.get(Api.Identities, 'document/activeVersion/TOS').flatMap((response: Document) => {
      this.documentId = response.id;
      return this.api.get(
        Api.Identities,
        `document/downloadDocumentFile/${response.id}`,
        { headerType: 'download' }
      );
    }).map((response: Response) => {
      return response.text();
    });
  }

  public agreeUserToTerms(): void {
    this.api.post(
      Api.Identities,
      `document/version/agree`,
      { parameters: { documentId: this.documentId.toString() } }
    ).take(1).subscribe();
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

  public getAddresses(): Observable<Array<ViewAddress>> {
    return this.api.get(Api.Identities, 'user/currentUsersAssociatedAddresses')
      .map((addresses: { list: ViewAddress[] }) => {
        return addresses.list;
      });
  }

  public addBillingAddress(address: Address): Observable<any> {
    let newUser: User = Object.assign({}, JSON.parse(localStorage.getItem('currentUser')), { mailingAddress: address });
    return this.api.put(Api.Identities, `user/${newUser.id}`, { body: newUser }).do((user: User) => {
      localStorage.setItem('currentUser', JSON.stringify(user));
    });
  }

  public addAccountBillingAddress(address: ViewAddress): Observable<any> {
    return this.api.get(Api.Identities, `account/${address.addressEntityId}`).flatMap((account: any) => {
      let newAccount: any = Object.assign({}, account, { billingInfo: { address: address.address } });
      return this.api.put(Api.Identities, `account/${address.addressEntityId}`, { body: newAccount });
    });
  }

  public getAccount(accountId: number): Observable<any> {
    return this.api.get(Api.Identities, `account/${accountId}`);
  }
}
