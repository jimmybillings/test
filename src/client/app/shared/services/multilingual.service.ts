// angular
import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ILang, MultilingualStateI } from '../interfaces/language.interface';
import 'rxjs/add/operator/take';

declare let portal: string;
declare let baseUrl: string;
const initialState: MultilingualStateI = {
  lang: ''
};

// actions
const MULTILINGUAL_ACTIONS: any = {
  LANG_CHANGE: '[Multilingual] LANG_CHANGE'
};

// ActionReducer
export const multilingualActionReducer: ActionReducer<MultilingualStateI> = (state: MultilingualStateI = initialState, action: Action) => {
  switch (action.type) {
    case MULTILINGUAL_ACTIONS.LANG_CHANGE:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

// service
@Injectable()
export class MultilingualService {
  // default supported languages
  // see main.ts bootstrap for example of how to provide different value
  public static SUPPORTED_LANGUAGES: Array<ILang> = [
    { code: 'en', title: 'English' },
    { code: 'fr', title: 'French' },
    { code: 'de', title: 'German' }
  ];

  constructor(
    private translate: TranslateService,
    public store: Store<any>) {
    // subscribe to changes
    this.setLanguage('en');
    store.select('i18n').subscribe((state: MultilingualStateI) => {
      this.translate.use(state.lang);
    });
  }

  public setLanguage(lang: string) {
    lang = `${baseUrl.split(':/')[1]}identities-api/v1/translation/${portal}/${lang}`;
    this.store.dispatch({ type: MULTILINGUAL_ACTIONS.LANG_CHANGE, payload: { lang } });
  }
}
