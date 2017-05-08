import { Frame, TimecodeFormat } from 'wazee-frame-formatter';
import { Asset, Metadatum } from '../interfaces/commerce.interface';

export class EnhancedAsset implements Asset {
  public assetId?: number;
  public assetName?: string;
  public assetDuration?: number;
  public metadata?: Metadatum[];
  public rightsManaged?: string;
  public supplierId?: number;
  public supplierName?: string;
  public thumbnailUrl?: string;
  public timeStart?: number;
  public timeEnd?: number;
  public clipUrl?: string;
  public uuid?: string;

  private _resourceClass: string;
  private _framesPerSecond: number;
  private _durationAsMilliseconds: number;

  public get resourceClass(): string {
    if (!this._resourceClass) this._resourceClass = this.findMetadataValueFor('Resource.Class');

    return this._resourceClass;
  }

  public get isImage(): boolean {
    return this.resourceClass === 'Image';
  }

  public get framesPerSecond(): number {
    if (!this._framesPerSecond) this._framesPerSecond = parseFloat(this.findMetadataValueFor('Format.FrameRate'));

    return this._framesPerSecond;
  }

  public get durationAsMilliseconds(): number {
    if (!this._durationAsMilliseconds) this._durationAsMilliseconds = parseFloat(this.findMetadataValueFor('Format.Duration'));

    return this._durationAsMilliseconds;
  }

  public get isSubclipped(): boolean {
    return this.timeStart >= 0 && this.timeEnd >= 0;
  }

  public get subclipDurationAsFrame(): Frame {
    if (!this.framesPerSecond || !this.isSubclipped) return undefined;

    return new Frame(this.framesPerSecond).setFromFrameNumber(this.timeEnd - this.timeStart);
  }

  public get fullDurationAsFrame(): Frame {
    if (!this.framesPerSecond || !this.durationAsMilliseconds) return undefined;

    return new Frame(this.framesPerSecond).setFromSeconds(this.durationAsMilliseconds / 1000.0);
  }

  private findMetadataValueFor(metadataName: string, object: any = this.metadata): string {
    if (object !== Object(object)) return null;

    const keys: string[] = Object.keys(object);

    if (keys.length === 2 && keys.sort().join('|') === 'name|value' && object.name === metadataName) {
      return object.value;
    }

    for (var key of keys) {
      if (object[key]) {
        const value = this.findMetadataValueFor(metadataName, object[key]);
        if (value) return value;
      }
    }

    return null;
  }
}
