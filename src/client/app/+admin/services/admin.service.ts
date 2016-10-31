import { AdminResponse, AdminUrlParams, AdminFormParams, Account } from '../../shared/interfaces/admin.interface';
import { User } from '../../shared/interfaces/user.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { AdminStore } from './admin.store';

@Injectable()
export class AdminService {
  public data: Observable<any>;
  constructor(public api: ApiService, private store: AdminStore) {
    this.data = this.store.data;
  }

  public getResourceIndex(queryObject: AdminUrlParams, resourceType: string): Observable<AdminResponse> {
    let params = JSON.parse(JSON.stringify(queryObject));
    params.i = (parseFloat(params.i) - 1).toString();

    return this.api.get(Api.Identities, `${resourceType}/searchFields`, { parameters: params }).do(response => {
      this.store.set(response);
    });
  }

  public postResource(resourceType: string, formData: User | Account): Observable<AdminResponse> {
    return this.api.post(Api.Identities, resourceType, { body: formData });
  }

  public putResource(resourceType: string, formData: User | Account): Observable<AdminResponse> {
    return this.api.put(Api.Identities, `${resourceType}/${formData.id}`, { body: formData });
  }

  public buildSearchParameters(filterParams: AdminFormParams): AdminFormParams {
    let params = this.sanitizeFormInput(filterParams);
    let rawFields = this.buildFields(params);
    let rawValues = this.buildValues(params);
    let fields = rawFields.filter(this.removeFields).join(',');
    let values = rawValues.filter(this.removeFields).join(',');
    return { fields, values };
  }

  // END OF PUBLIC INTERFACE - Everything below is to format the search request

  private sanitizeFormInput(fields: any): AdminFormParams {
    for (var field in fields) {
      if (this.dateFieldIsEmpty(fields, field)) {
        fields[field] = Date.now();
      } else if (fields[field] === '') {
        delete fields[field];
      }
    }
    return fields;
  }

  private dateFieldIsEmpty(fields: any, field: string): boolean {
    return (field === 'createdOn' || field === 'lastUpdated') && fields[field] === '';
  }

  private buildFields(filterParams: any): Array<string> {
    let map: any = { 'before': ':LT:', 'after': ':GT:' };
    let fields: Array<string> = Object.keys(filterParams);
    return fields.reduce((prev, current, index) => {
      if (current === 'DATE') {
        prev.push(current + map[filterParams[current]] + fields[index + 1]);
      } else {
        prev.push(current);
      }
      return prev;
    }, []);
  }

  private buildValues(filterParams: any): Array<string> {
    return Object.keys(filterParams).reduce((prev, current) => {
      if (this.valueIsADateString(filterParams, current)) {
        let date = new Date(filterParams[current]);
        prev.push(encodeURI((date.getTime()).toString()));
      } else {
        prev.push(encodeURI(filterParams[current]));
      }
      return prev;
    }, []);
  }

  private valueIsADateString(fields: any, field: any): boolean {
    return ['createdOn', 'lastUpdated'].indexOf(field) > -1 && typeof(fields[field]) === 'string';
  }

  private removeFields(field: string): boolean {
    return ['createdOn', 'lastUpdated', 'before', 'after'].indexOf(field) === -1;
  }
}
