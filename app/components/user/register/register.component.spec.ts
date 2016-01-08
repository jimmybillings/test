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
import {Register} from './register.component';
import {Component, View} from 'angular2/core';


describe('Register Component', () => {

  beforeEachProviders(() => []);
  it('should expect 15 to be 15', () => {
    expect(15).toBe(15)
  });

});
