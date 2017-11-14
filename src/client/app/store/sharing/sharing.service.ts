import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FutureApiService } from '../api/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { SubclipMarkers, Duration, durationFrom, bothMarkersAreSet } from '../../shared/interfaces/subclip-markers';
import { Pojo } from '../../shared/interfaces/common.interface';
import { CurrentUserService } from '../../shared/services/current-user.service';

@Injectable()
export class SharingService {
  constructor(private apiService: FutureApiService, private currentUserService: CurrentUserService) { }

  public createAssetShareLink(assetId: number, subclipMarkers: SubclipMarkers): Observable<string> {
    return this.callSharingEndpointWith(this.formatAssetCreateBodyWith(assetId, subclipMarkers))
      .map(response => `${window.location.href};share_key=${response.apiKey}`);
  }

  public emailAssetShareLink(assetId: number, subclipMarkers: SubclipMarkers, parameters: Pojo): Observable<null> {
    return this.callSharingEndpointWith(this.formatAssetEmailBodyWith(assetId, subclipMarkers, parameters))
      .map(response => null);
  }

  private callSharingEndpointWith(body: Pojo): Observable<Pojo> {
    return this.apiService.post(Api.Identities, 'accessInfo', { body: body });
  }

  private formatAssetCreateBodyWith(assetId: number, subclipMarkers: SubclipMarkers): Pojo {
    return {
      type: 'asset',
      accessInfo: String(assetId),
      accessStartDate: this.formatStartDate(),
      accessEndDate: this.formatEndDate(),
      properties: this.formatTimePropertiesFrom(subclipMarkers)
    };
  }

  private formatAssetEmailBodyWith(assetId: number, subclipMarkers: SubclipMarkers, parameters: Pojo): Pojo {
    return {
      ...this.formatAssetCreateBodyWith(assetId, subclipMarkers),
      recipientEmails: this.formatEmailReceipientsFrom(parameters.recipientEmails, parameters.copyMe),
      comment: parameters.comment,
      project: parameters.project
    };
  }

  private formatStartDate(): string {
    return this.isoFormatLocalDate(new Date());
  }

  private formatEndDate(): string {
    const date: Date = new Date();
    date.setDate(date.getDate() + 10);

    return this.isoFormatLocalDate(date);
  }

  private isoFormatLocalDate(date: Date): string {
    const outputDate: string = `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`;
    const outputTime: string = `${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())}`;
    const timeZoneOffset: number = -date.getTimezoneOffset();
    const outputTimeZoneSign: string = timeZoneOffset >= 0 ? '+' : '-';
    const outputTimeZoneOffset: string = `${this.pad(timeZoneOffset / 60)}:${this.pad(timeZoneOffset % 60)}`;

    return `${outputDate}T${outputTime}${outputTimeZoneSign}${outputTimeZoneOffset}`;
  }

  private pad(number: number): string {
    var integer: number = Math.abs(Math.floor(number));
    return integer < 10 ? `0${integer}` : String(integer);
  }

  private formatTimePropertiesFrom(subclipMarkers: SubclipMarkers): Duration {
    return bothMarkersAreSet(subclipMarkers) ? durationFrom(subclipMarkers) : null;
  }

  private formatEmailReceipientsFrom(recipientsString: string, copyMe: boolean): string[] {
    return recipientsString.split(/\s*,\s*|\s*;\s*/).concat(copyMe ? [this.currentUserService.state.emailAddress] : []);
  }
}
