import { Observable} from 'rxjs/Observable';
import { Store, Reducer, Action} from '@ngrx/store';
import { Injectable } from 'angular2/core';



export const asset:Reducer<any> = (state = {}, action:Action) => {

    switch (action.type) {
        case 'SET_ASSET':
            return Object.assign({}, state, action.payload);

        default:
            return state;
    }
};

@Injectable()
/**
 * Model that describes current user, and provides  
 * methods for retrieving user attributes.
 */  
export class AssetService {

  public asset: Observable<any>;
  // we don't need a constructor because currentUser.set() is called from the app.component.
  // having both calls _user() multiple times.
  
  constructor(private store: Store<any>) {
    this.asset = this.store.select('asset');
  }
  
  public set(asset): void {
    this.store.dispatch({type: 'SET_ASSET', payload: asset});
  }

    
  
}
