import { Injectable, ComponentRef, ViewContainerRef, ComponentResolver, Renderer } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { ViewContainerService } from '../../shared/services/view-container.service';
import { Store, Reducer, Action} from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { EditComponent } from '../+edit/edit.component';
import { NewComponent } from '../+new/new.component';

const adminState: any = { items: [], pagination: {} };
export const adminResources: Reducer<any> = (state = adminState, action: Action) => {
  switch (action.type) {
    case 'ADMIN_SERVICE.SET_RESOURCES':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class AdminService {

  public operatorMap: any;
  public adminStore: Observable<any>;
  public cmpRef: ComponentRef<any>;
  public viewRef: Function;
  private vcRef: ViewContainerRef;

  constructor(public http: Http,
              public apiConfig: ApiConfig,
              private store: Store<any>,
              private renderer: Renderer,
              private resolver: ComponentResolver,
              private viewContainerService: ViewContainerService) {
    this.adminStore = this.store.select('adminResources');
    this.vcRef = this.viewContainerService.getRef();
    this.operatorMap = {
      'before': 'LT',
      'after': 'GT'
    };
  }

  public getResources(queryObject: any, resource: string): Observable<any> {
    queryObject['i'] = (parseFloat(queryObject['i']) - 1).toString();
    let url = this.getIdentitiesSearchPath(resource);
    let options = this.getIdentitiesSearchOptions(queryObject);
    return this.http.get(url, options).map((res: Response) => res.json());
  }

  public getResource(resourceType: string, resourceId: string): Observable<any> {
    let url = this.buildGetUrl(resourceType, resourceId);
    let headers = this.apiConfig.authHeaders();
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options).map((res: Response) => res.json());
  }

  public postResource(formData: any, resourceType: string): Observable<any> {
    let url = this.buildPostUrl(resourceType);
    let headers = this.apiConfig.authHeaders();
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(formData);
    return this.http.post(url, body, options).map((res: Response) => res.json());
  }

  public put(resourceType: string, formData: any): Observable<any> {
    let url = this.buildGetUrl(resourceType, formData.id);
    let headers = this.apiConfig.authHeaders();
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(formData);
    return this.http.put(url, body, options).map((res: Response) => res.json());
  }

  public setResources(data: any): void {
    this.store.dispatch({
      type: 'ADMIN_SERVICE.SET_RESOURCES', payload: {
        'items': data.items,
        'pagination': {
          'totalCount': data.totalCount,
          'currentPage': data.currentPage + 1,
          'hasNextPage': data.hasNextPage,
          'hasPreviousPage': data.hasPreviousPage,
          'numberOfPages': data.numberOfPages,
          'pageSize': data.pageSize
        }
      }
    });
  }

  public buildSearchTerm(filterParams: any): any {
    let params = this.sanitizeFormInput(filterParams);
    let rawFields = this.buildFields(params);
    let rawValues = this.buildValues(params);
    let fields = rawFields.filter(this.removeFields).join(',');
    let values = rawValues.filter(this.removeFields).join(',');
    return { fields, values };
  }

  public getIdentitiesSearchOptions(queryObject: any): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in queryObject) search.set(param, queryObject[param]);
    let headers = this.apiConfig.authHeaders();
    let options = { headers: headers, search: search };
    return new RequestOptions(options);
  }

  public buildPostUrl(resource: string): string {
    return this.apiConfig.baseUrl() + 'api/identities/v1/' + resource;
  }

  public buildGetUrl(resource: string, id: string): string {
    return this.apiConfig.baseUrl() + 'api/identities/v1/' + resource + '/' + id;
  }

  public getIdentitiesSearchPath(resource: string): string {
    return this.apiConfig.baseUrl() + 'api/identities/v1/' + resource + '/searchFields/?';
  }

  public sanitizeFormInput(params: any): any {
    for (var param in params) {
      if ((param === 'createdOn' || param === 'lastUpdated') && params[param] === '') {
        let date = new Date();
        params[param] = date.setDate(date.getDate() + 1) * 1000;
      } else if (params[param] === '') {
        delete params[param];
      }
    }
    return params;
  }

  public buildValues(filterParams: any): Array<string> {
    return Object.keys(filterParams).reduce((prev, current) => {
      if (current === 'createdOn' || current === 'lastUpdated') {
        let date = new Date(filterParams[current]);
        prev.push(encodeURI((date.getTime() / 1000).toString()));
      } else {
        prev.push(encodeURI(filterParams[current]));
      }
      return prev;
    }, []);
  }

  public buildFields(filterParams: any): Array<string> {
    let fields = Object.keys(filterParams);
    return fields.reduce((prev, current, index) => {
      if (current === 'DATE') {
        prev.push(current + ':' + this.operatorMap[filterParams[current]] + ':' + fields[index + 1]);
      } else {
        prev.push(current);
      }
      return prev;
    }, []);
  }

  public removeFields(value: any): boolean {
    let fieldsToRemove = ['createdOn', 'lastUpdated', 'before', 'after'];
    return !(fieldsToRemove.indexOf(value) > -1);
  }

  public showEditComponent(editFormItems: any, resource: any, resourceType: string): void {
    this.resolver.resolveComponent(EditComponent).then((factory: any) => {
      this.cmpRef = this.vcRef.createComponent(factory);
      this.cmpRef.instance.resource = resource;
      this.cmpRef.instance.formItems = editFormItems;
      this.cmpRef.instance.resourceType = resourceType;
      this.cmpRef.instance.cmpRef = this.cmpRef;
    });
  }

  public showNewComponent(newFormItems: any, resourceType: string): void {
    this.resolver.resolveComponent(NewComponent).then((factory: any) => {
      this.cmpRef = this.vcRef.createComponent(factory);
      this.cmpRef.instance.formItems = newFormItems;
      this.cmpRef.instance.resourceType = resourceType;
      this.cmpRef.instance.cmpRef = this.cmpRef;
    });
  }

  public destroyComponent(): void {
    this.cmpRef.destroy();
  }
}
