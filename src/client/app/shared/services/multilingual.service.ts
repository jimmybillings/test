// angular
import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { TranslateService } from 'ng2-translate';
import { ILang, MultilingualStateI } from '../interfaces/language.interface';
import { ApiConfig } from './api.config';
import 'rxjs/add/operator/take';

declare let portal: string;

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

  public portal: string;
  public baseUrl: string;

  constructor(
    private translate: TranslateService,
    private apiConfig: ApiConfig,
    public store: Store<any>) {
    this.baseUrl = this.apiConfig.baseUrl();
    this.setLanguage('en');

    // subscribe to changes
    store.select('i18n').subscribe((state: MultilingualStateI) => {
      this.translate.use(state.lang);
    });

  }

  public setLanguage(lang: string) {
    lang = `${this.baseUrl.split(':/')[1]}api/identities/v1/translation/${portal}/${lang}`;
    this.store.dispatch({ type: MULTILINGUAL_ACTIONS.LANG_CHANGE, payload: { lang } });
  }
}
