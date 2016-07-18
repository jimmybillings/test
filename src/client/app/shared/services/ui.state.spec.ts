import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { UiState, uiState } from './ui.state';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { provideStore } from '@ngrx/store';

export function main() {
  describe('UI State', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({ uiState: uiState }),
      UiState,
    ]);

    it('Should initialize booleans in the store to define default positioning',
      inject([UiState], (service: UiState) => {
        service.uiState.first().subscribe(data => {
          expect(data.showFixed).toEqual(false);
          expect(data.collectionsListIsOpen).toEqual(false);
          expect(data.newCollectionFormIsOpen).toEqual(false);
          expect(data.binTrayIsOpen).toEqual(false);
          expect(data.searchBarIsActive).toEqual(false);
          expect(data.searchIsOpen).toEqual(true);
        });
      }));

    it('Should set the header to absolute by setting \'showFixed\' to be false if the page scrolls less than 111px\'s',
      inject([UiState], (service: UiState) => {
        service.showFixedHeader(108);
        service.uiState.first().subscribe(data => {
          expect(data.showFixed).toEqual(false);
        });
      }));

    it('Should set the header to fixed by setting \'showFixed\' to be true if the page scrolls down more than 111px\'s',
      inject([UiState], (service: UiState) => {
        service.showFixedHeader(114);
        service.uiState.first().subscribe(data => {
          expect(data.showFixed).toEqual(true);
        });
      }));

    it('Should hide the search bar on certain routes', inject([UiState], (service: UiState) => {
      ['/', 'admin', 'user', 'notification'].forEach(item => {
        service.checkRouteForSearchBar(item);
        service.uiState.first().subscribe(data => {
          expect(data.searchBarIsActive).toEqual(false);
        });
      });
    }));

    it('Should show the search bar on other routes', inject([UiState], (service: UiState) => {
      ['asdf', 'fdsadsf', 'fdsf', 'wefwer', 'aasfasdf'].forEach((item) => {
        service.checkRouteForSearchBar(item);
        service.uiState.first().subscribe(data => {
          expect(data.searchBarIsActive).toEqual(true);
        });
      });
    }));
  });
}
