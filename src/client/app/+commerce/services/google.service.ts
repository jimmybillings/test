import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { WindowRef } from '../../shared/services/window-ref.service';

@Injectable()
export class GoogleService {
  public autocomplete: any;
  public script: HTMLElement;
  private readonly scriptSrc: string =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyCzyGsK3zaRGFAEC72nWbdRvBY1Lo92Cfw&libraries=places';
  private callback: Function;
  constructor(private window: WindowRef, @Inject(DOCUMENT) private document: any) { }

  public geolocate(): void {
    navigator.geolocation.getCurrentPosition((position: any) => {
      let geolocation: any = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      let circle: any = new this.window.nativeWindow.google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      this.autocomplete.setBounds(circle.getBounds());
    });
  }

  public loadPlacesLibrary(callback: Function): void {
    this.callback = callback;
    let scripts: any = this.document.getElementsByTagName('script');
    let i: number = scripts.length, scriptLoaded: boolean = false;

    while (i--) {
      if (scripts[i].src === this.scriptSrc) {
        scriptLoaded = true;
      }
    }

    if (scriptLoaded) {
      this.initAutocomplete();
    } else {
      this.script = this.document.createElement('script');
      Object.assign(this.script, { src: this.scriptSrc, type: 'text/javascript' });
      this.document.body.appendChild(this.script);
      this.script.onload = this.initAutocomplete;
    }
  }

  public initAutocomplete = (): void => {
    if (this.window.nativeWindow.google) {
      this.autocomplete = new this.window.nativeWindow.google.maps.places.Autocomplete(
        this.document.getElementById('autocomplete'),
        { types: ['geocode'] }
      );
      this.autocomplete.addListener('place_changed', this.callback);
    }
  }

  public getPlace(): any {
    let place: any = this.autocomplete.getPlace();

    return place.address_components.reduce((prev: any, current: any) => {
      prev[current.types[0]] = { long_name: current['long_name'], short_name: current['long_name'] };
      return prev;
    }, {});
  }
}
