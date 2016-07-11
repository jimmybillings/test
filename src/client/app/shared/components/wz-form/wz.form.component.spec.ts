import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide, PLATFORM_PIPES} from '@angular/core';
import {WzFormComponent} from './wz.form.component';
import {FormModel} from './wz.form.model';
import { TranslateLoader, TranslateStaticLoader, TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FormBuilder } from '@angular/forms';

export function main() {
  describe('Form Component', () => {
    beforeEachProviders(() => [
      WzFormComponent,
      FormBuilder,
      FormModel,
      TranslateService,
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true}),
    ]);

    it('Should create instance of WzForm',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzFormComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzFormComponent).toBeTruthy();
        });
      })
    );

    it('Should create an angular form object on ngOnInit with the correct register keys.',
      inject([WzFormComponent], (form: WzFormComponent) => {
        form.items = items();
        form.ngOnInit();
        expect(Object.keys(form.form.value)).toEqual(['firstName', 'lastName', 'emailAddress', 'password']);
      }));

    it('Should return an array of items when passord a comma delimited string',
      inject([WzFormComponent], (form: WzFormComponent) => {
        let cities = 'London,New York,San Francisco,Denver,Paris,Rome,Sydney';
        expect(form.parseOptions(cities)).toEqual(['London', 'New York', 'San Francisco', 'Denver', 'Paris', 'Rome', 'Sydney']);
      })
    );

    it('Should cause a console error if the form is invalid',
      inject([WzFormComponent], (form: WzFormComponent) => {
        form.items = items();
        form.ngOnInit();
        spyOn(console, 'log');
        form.onSubmit();
        expect(console.log).toHaveBeenCalled();
      })
    );

    it('Should pass as a valid form object and send to parent object using the event emitter',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzFormComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          instance.items = validItems();
          instance.ngOnInit();
          instance.formSubmit.subscribe((x: any) => {
            expect(x.value).toEqual({ firstName: 'test', lastName: 'test', emailAddress: 'email@email.com', password: 'Test1233' });
          });
          expect(instance.form.valid).toBeTruthy();
          spyOn(instance, 'resetForm');
          instance.onSubmit(instance.form);
          expect(instance.resetForm).toHaveBeenCalled();
        });
      })
    );


  });

  function items() {
    return [{ 'name': 'firstName', 'label': 'First Name', 'type': 'text', 'value': '', 'validation': 'REQUIRED' }, { 'name': 'lastName', 'label': 'Last Name', 'type': 'text', 'value': 'null', 'validation': 'REQUIRED' }, { 'name': 'emailAddress', 'label': 'Email', 'type': 'email', 'value': 'null', 'validation': 'EMAIL' }, { 'name': 'password', 'label': 'Password', 'type': 'password', 'value': 'null', 'validation': 'PASSWORD' }];
  }

  function validItems() {
    return [{ 'name': 'firstName', 'label': 'First Name', 'type': 'text', 'value': 'test', 'validation': 'REQUIRED' }, { 'name': 'lastName', 'label': 'Last Name', 'type': 'text', 'value': 'test', 'validation': 'REQUIRED' }, { 'name': 'emailAddress', 'label': 'Email', 'type': 'email', 'value': 'email@email.com', 'validation': 'EMAIL' }, { 'name': 'password', 'label': 'Password', 'type': 'password', 'value': 'Test1233', 'validation': 'PASSWORD' }];
  }
}
