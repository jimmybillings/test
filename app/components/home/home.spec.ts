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
import {Home} from './home.component';
import {Component, View} from 'angular2/core';


describe('Home Component', () => {

  beforeEachProviders(() => []);
  it('should expect 4 to be 4', () => {
    expect(4).toBe(4)
  });

});
