import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { AppStore, AppState } from '../../app.store';
import { HelpRequestService } from './help-request.service';
import * as HelpRequestActions from './help-request.actions';
import { Action } from '@ngrx/store';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { Asset, Pojo } from '../../shared/interfaces/common.interface';
import { FormFields } from '../../shared/interfaces/forms.interface';

@Injectable()
export class HelpRequestEffects {

  @Effect({ dispatch: false })
  public showHelpRequest: Observable<Action> = this.actions.ofType(HelpRequestActions.ShowHelpRequest.Type)
    .withLatestFrom(this.store.select(state => state))
    .map(([action, state]: [HelpRequestActions.ShowHelpRequest, AppState]) => {
      return this.prepareHelpRequestForm(action.assetName, state);
    })
    .do((formConfig: any) => {
      this.dialogService.openFormDialog(formConfig,
        {
          title: 'ASSET.HELP.DIALOG_HEADER_TITLE',
          submitLabel: 'ASSET.HELP.FORM.SUBMIT_BTN_LABEL',
          autocomplete: 'off'
        },
        (formItems) => this.store.dispatch(factory => factory.helpRequest.SubmitHelpRequest(formItems))
      );
    });

  @Effect()
  public submitHelpRequest: Observable<Action> = this.actions.ofType(HelpRequestActions.SubmitHelpRequest.Type)
    .switchMap((action: HelpRequestActions.SubmitHelpRequest) =>
      this.service.submitHelpRequest(action.formItems)
        .map(() => this.store.create(factory => factory.snackbar.display('This will be success message')))
    );

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: HelpRequestService,
    private dialogService: WzDialogService) { }

  private prepareHelpRequestForm(assetName: Asset['name'], state: Pojo) {
    let formItems: FormFields[] = state.uiConfig.components.helpRequest.config.form.items;
    let UserFirstName: string = state.currentUser.firstName;
    let UserLastName: string = state.currentUser.lastName;
    let UserName: string = `${UserFirstName} ${UserLastName}`;
    let UserEmail: string = state.currentUser.emailAddress;
    let siteName: string = state.currentUser.siteName;

    formItems = formItems.map((item: FormFields) => {
      if (item.name === 'name') item.value = UserName;
      if (item.name === 'email') item.value = UserEmail;
      if (item.name === 'subject') item.value = `${siteName} customer request for asset ${assetName}`;

      return item;
    });
    return formItems;
  }

}
