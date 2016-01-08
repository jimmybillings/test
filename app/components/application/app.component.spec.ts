import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {AppComponent} from './app.component';


describe('App Component', () => {

  beforeEachProviders(() => []);


  it('should expect 2 to be 2', () => {
    expect(2).toBe(2)
  });

});

