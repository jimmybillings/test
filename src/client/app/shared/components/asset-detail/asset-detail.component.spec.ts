import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { Router } from '@angular/router';
import {provide} from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import {AssetDetailComponent} from './asset-detail.component';

export function main() {
  describe('Asset Detail Component', () => {
    class MockRouter{}
    beforeEachProviders(() => [
      AssetDetailComponent,
      { provide: Router, useClass: MockRouter },
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
    ]);

    it('Create instance of AssetDetail',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(AssetDetailComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AssetDetailComponent).toBeTruthy();
        });
      }));
  });
}
