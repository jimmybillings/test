import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders,
} from '@angular/core/testing';
import { provide} from '@angular/core';
import { BinTrayComponent} from './bin-tray.component';
import { UiConfig} from '../../services/ui.config';
import { Router } from '@angular/router';
import { CollectionsService, collections} from '../../../+collections/services/collections.service';
import { provideStore } from '@ngrx/store';
import { ApiConfig } from '../../../shared/services/api.config';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';

export function main() {
  describe('Bin Tray Component', () => {
    class MockRouter{}
    class Search { }
    beforeEachProviders(() => [
      BinTrayComponent,
      { provide: Router, useClass: MockRouter },
      UiConfig,
      CollectionsService,
      ApiConfig,
      MockBackend,
      BaseRequestOptions,
      provideStore(collections),
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),

    ]);

    it('Should have a bin tray instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(BinTrayComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof BinTrayComponent).toBeTruthy();
        });
      }));

    // it('Should create the form object for the search bar', inject([SearchBox], (component) => {
    //   component.setForm();
    //   expect(component.searchForm.value).toEqual({ query: '' });
    // }));

    // it('Should fire an event to logout a user', inject([SearchBox], (component) => {
    //   component.config = {};
    //   component.config.pageSize = {};
    //   component.config.pageSize.value = 25;
    //   component.router.config([ { path: '/Search', name: 'Search', component: Search }]);
    //   spyOn(component.router, 'navigate');
    //   component.onSubmit('Dogs');
    //   expect(component.router.navigate).toHaveBeenCalledWith(['/Search', { q: 'Dogs', n: 25 }]);
    // }));

  });
}
