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
import {Header} from './header.component';
import {Component, View} from 'angular2/core';


describe('Header Component', () => {

  beforeEachProviders(() => []);
  it('should expect 8 to be 8', () => {
    expect(8).toBe(8)
  });

});
