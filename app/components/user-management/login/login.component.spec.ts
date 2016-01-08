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
import {Login} from './login.component';
import {Component, View} from 'angular2/core';


describe('Login Component', () => {

  beforeEachProviders(() => []);
  it('should expect 12 to be 12', () => {
    expect(8).toBe(8)
  });

});
