import {
  AdminResponse,
  AdminUrlParams,
  AdminFormParams,
  Account
} from '../../shared/interfaces/admin.interface';
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

  public getResourceIndex(queryObject: AdminUrlParams, resourceType: string): void {
    let params = JSON.parse(JSON.stringify(queryObject));
    params.i = (parseFloat(params.i) - 1).toString();

    this.api.get(Api.Identities, `${resourceType}/searchFields`, { parameters: params }).take(1).subscribe(response => {
      this.store.set(response);
    });
  }

  public postResource(resourceType: string, formData: User | Account): Observable<AdminResponse> {
    return this.api.post(Api.Identities, resourceType, { body: formData });
  }

  public putResource(resourceType: string, formData: User | Account): Observable<AdminResponse> {
    return this.api.put(Api.Identities, `${resourceType}/${formData.id}`, { body: formData });
  }

  public buildSearchTerm(filterParams: AdminFormParams): AdminFormParams {
    let params = this.sanitizeFormInput(filterParams);
    let rawFields = this.buildFields(params);
    let rawValues = this.buildValues(params);
    let fields = rawFields.filter(this.removeFields).join(',');
    let values = rawValues.filter(this.removeFields).join(',');
    return { fields, values };
  }

  // END OF PUBLIC INTERFACE

  private sanitizeFormInput(fields: any): AdminFormParams {
    for (var field in fields) {
      if (this.dateFieldIsEmpty(fields, field)) {
        let date = new Date();
        fields[field] = date.setDate(date.getDate()) * 1000;
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
    let map: any = { 'before': 'LT', 'after': 'GT' };
    let fields: Array<string> = Object.keys(filterParams);
    return fields.reduce((prev, current, index) => {
      if (current === 'DATE') {
        prev.push(current + ':' + map[filterParams[current]] + ':' + fields[index + 1]);
      } else {
        prev.push(current);
      }
      return prev;
    }, []);
  }

  private buildValues(filterParams: any): Array<string> {
    return Object.keys(filterParams).reduce((prev, current) => {
      if (this.valueIsADate(current)) {
        let date = new Date(filterParams[current]);
        prev.push(encodeURI((date.getTime() / 1000).toString()));
      } else {
        prev.push(encodeURI(filterParams[current]));
      }
      return prev;
    }, []);
  }

  private valueIsADate(currentField: string): boolean {
    return ['createdOn', 'lastUpdated'].indexOf(currentField) > -1;
  }

  private removeFields(field: string): boolean {
    return ['createdOn', 'lastUpdated', 'before', 'after'].indexOf(field) === -1;
  }
}
