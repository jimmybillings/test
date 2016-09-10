// angular
import {Injectable} from '@angular/core';
import {Store, ActionReducer, Action} from '@ngrx/store';
import {TranslateService} from 'ng2-translate/ng2-translate';
import {ILang, MultilingualStateI} from '../interfaces/language.interface';
import 'rxjs/add/operator/take';

const initialState: MultilingualStateI = {
  lang: 'en'
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

  constructor(private translate: TranslateService, public store: Store<any>) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // subscribe to changes
    store.select('i18n').subscribe((state: MultilingualStateI) => {
      // update ng2-translate which will cause translations to occur wherever the TranslatePipe is used in the view
      if (this.translate.getLangs() && (this.translate.getLangs().indexOf(state.lang) > -1)) {
        this.translate.use(state.lang);
      } else {
        this.translate.reloadLang(state.lang).take(1).subscribe(() => {
          setTimeout(() => this.translate.use(state.lang), 0);
        });
      }
    });
  }

  public setLanguage(lang: string) {
    this.store.dispatch({ type: MULTILINGUAL_ACTIONS.LANG_CHANGE, payload: { lang } });
  }
}
