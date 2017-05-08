import { Frame } from 'wazee-frame-formatter';
import { Asset, Metadatum } from '../interfaces/commerce.interface';

interface InternalCache {
  [index: string]: any;
}

export class EnhancedAsset implements Asset {
  public readonly assetId?: number;
  public readonly assetName?: string;
  public readonly assetDuration?: number;
  public readonly metadata?: Metadatum[];
  public readonly rightsManaged?: string;
  public readonly supplierId?: number;
  public readonly supplierName?: string;
  public readonly thumbnailUrl?: string;
  public readonly timeStart?: number;
  public readonly timeEnd?: number;
  public readonly clipUrl?: string;
  public readonly uuid?: string;

  private calculationCache: InternalCache = {};

  //// asset duration

  public get durationFrame(): Frame {
    return this.getCached('durationFrame');
  }

  public get durationFrameNumber(): number {
    return this.frameNumberFrom(this.durationFrame);
  }

  public get durationMilliseconds(): number {
    return this.getCached('durationMilliseconds');
  }

  //// subclip duration

  public get subclipDurationFrame(): Frame {
    return this.getCached('subclipDurationFrame');
  }

  public get subclipDurationFrameNumber(): number {
    return this.frameNumberFrom(this.subclipDurationFrame);
  }

  public get subclipDurationMilliseconds(): number {
    return this.millisecondsFrom(this.subclipDurationFrame);
  }

  //// in marker

  public get inMarkerFrame(): Frame {
    return this.getCached('inMarkerFrame');
  }

  public get inMarkerFrameNumber(): number {
    return this.frameNumberFrom(this.inMarkerFrame);
  }

  public get inMarkerMilliseconds(): number {
    return this.millisecondsFrom(this.inMarkerFrame);
  }

  //// out marker

  public get outMarkerFrame(): Frame {
    return this.getCached('outMarkerFrame');
  }

  public get outMarkerFrameNumber(): number {
    return this.frameNumberFrom(this.outMarkerFrame);
  }

  public get outMarkerMilliseconds(): number {
    return this.millisecondsFrom(this.outMarkerFrame);
  }

  //// metadata

  public getMetadataValueFor(metadataName: string): string {
    return this.findMetadataValueFor(metadataName);
  }

  public convertMetadataValueFor(metadataName: string, converter: (value: string) => any): any {
    const value: string = this.getMetadataValueFor(metadataName);

    return value ? converter(value) : undefined;
  }

  //// other assorted information

  public get resourceClass(): string {
    return this.getCached('resourceClass');
  }

  public get isImage(): boolean {
    return this.resourceClass === 'Image';
  }

  public get framesPerSecond(): number {
    return this.getCached('framesPerSecond');
  }

  //// private methods

  private getCached(key: string): any {
    if (!this.calculationCache.hasOwnProperty(key)) this.calculationCache[key] = this.calculateValueFor(key);

    return this.calculationCache[key];
  }

  private calculateValueFor(key: string): any {
    switch (key) {
      case 'durationFrame':
        return this.framesPerSecond && this.durationMilliseconds
          ? this.newFrame.setFromSeconds(this.durationMilliseconds / 1000.0)
          : undefined;

      case 'durationMilliseconds':
        return this.convertMetadataValueFor('Format.Duration', value => parseInt(value));

      case 'framesPerSecond':
        return this.convertMetadataValueFor('Format.FrameRate', value => parseFloat(value));

      case 'inMarkerFrame':
        return this.framesPerSecond
          ? this.newFrame.setFromFrameNumber(this.timeStart >= 0 ? this.timeStart : 0)
          : undefined;

      case 'outMarkerFrame':
        return this.framesPerSecond
          ? (this.timeEnd >= 0 ? this.newFrame.setFromFrameNumber(this.timeEnd) : this.durationFrame)
          : undefined;

      case 'resourceClass':
        return this.getMetadataValueFor('Resource.Class');

      case 'subclipDurationFrame':
        return this.framesPerSecond && this.inMarkerFrame && this.outMarkerFrame
          ? this.newFrame.setFromFrameNumber(this.outMarkerFrameNumber - this.inMarkerFrameNumber)
          : undefined;

      default:
        throw new Error(`Value calculation for '${key}' is missing.`);
    }
  }

  private get newFrame(): Frame {
    return new Frame(this.framesPerSecond);
  }

  private frameNumberFrom(frame: Frame) {
    return frame ? frame.asFrameNumber() : undefined;
  }

  private millisecondsFrom(frame: Frame) {
    return frame ? frame.asSeconds() * 1000 : undefined;
  }

  private findMetadataValueFor(metadataName: string, object: any = this.metadata): string {
    if (object !== Object(object)) return undefined;

    const keys: string[] = Object.keys(object);

    if (keys.length === 2 && keys.sort().join('|') === 'name|value' && object.name === metadataName) {
      return object.value;
    }

    for (var key of keys) {
      if (object[key]) {
        const value: string = this.findMetadataValueFor(metadataName, object[key]);
        if (value) return value;
      }
    }

    return undefined;
  }
}
