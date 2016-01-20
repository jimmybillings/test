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
  it('should expect 20 to be 20', () => {
    expect(20).toBe(20)
  });

});
