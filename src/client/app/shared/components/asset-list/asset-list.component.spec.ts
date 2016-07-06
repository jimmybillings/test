import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provide} from '@angular/core';
import { Router } from '@angular/router';
import {AssetListComponent} from './asset-list.component';
import {createOverlayContainer} from '@angular2-material/core/overlay/overlay-container';
import {OVERLAY_CONTAINER_TOKEN} from '@angular2-material/core/overlay/overlay';

export function main() {
  describe('Asset List Component', () => {
    class MockRouter { }
    beforeEachProviders(() => [
      AssetListComponent,
      { provide: Router, useClass: MockRouter },
      provide(OVERLAY_CONTAINER_TOKEN, {useValue: createOverlayContainer()})
    ]);

    it('Create instance of AssetList',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(AssetListComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AssetListComponent).toBeTruthy();
        });
      }));

    it('Should return a shortened version for High Definition, Standard Definition etc...', inject([AssetListComponent], (service: AssetListComponent) => {
      expect(service.formatType('High Definition')).toEqual('hd');
      expect(service.formatType('Standard Definition')).toEqual('sd');
      expect(service.formatType('Digital Video')).toEqual('dv');
      expect(service.formatType('lksjdflkjsdklfj')).toEqual('hd');
    }));

    it('Should fire an event to show an asset when clicked', inject([AssetListComponent], (service: AssetListComponent) => {
      spyOn(service.onShowAsset, 'emit');
      service.showAsset('12345');
      expect(service.onShowAsset.emit).toHaveBeenCalledWith('12345');
    }));
  });
}
