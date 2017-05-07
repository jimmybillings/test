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
    if (!this._resourceClass) this._resourceClass = this.getMetadataAtIndex(6, 'Resource.Class');

    return this._resourceClass;
  }

  public get isImage(): boolean {
    return this.resourceClass === 'Image';
  }

  public get framesPerSecond(): number {
    if (!this._framesPerSecond) this._framesPerSecond = parseFloat(this.getMetadataAtIndex(2, 'Format.FrameRate'));

    return this._framesPerSecond;
  }

  public get durationAsMilliseconds(): number {
    if (!this._durationAsMilliseconds) this._durationAsMilliseconds = parseFloat(this.getMetadataAtIndex(5, 'Format.Duration'));

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

  private getMetadataAtIndex(index: number, expectedName: string): string {
    if (!this.metadata) return '';

    const metadatum: Metadatum = this.metadata[index];

    return metadatum && metadatum.name === expectedName ? metadatum.value : '';
  }
}
