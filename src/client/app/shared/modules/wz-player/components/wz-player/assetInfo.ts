import { Frame } from 'wazee-frame-formatter';

export class AssetInfo {
  private _asset: any;
  private _framesPerSecond: number;
  private scratchPadFrame: Frame = new Frame(29.97);

  public set asset(newAsset: any) {
    this._asset = newAsset;
    this._framesPerSecond = null;
    if (this._asset.resourceClass !== 'Image') this.scratchPadFrame.setFramesPerSecondTo(this.framesPerSecond);
  }

  public get asset() {
    return this._asset;
  }

  public get framesPerSecond(): number {
    if (!this._framesPerSecond) {
      let frameRateMetadata: string = this.findMetadataValueFor('Format.FrameRate', this._asset);

      if (frameRateMetadata === null) {
        const assetName: string = this.findMetadataValueFor('name', this._asset) || 'asset';

        console.error(`Could not find 'Format.FrameRate' metadata for ${assetName} (id=${this._asset.assetId}).` +
          ' Using arbitrary frameRate of 29.97fps, which could be completely wrong.');

        frameRateMetadata = '29.97';
      }

      this._framesPerSecond = parseFloat(frameRateMetadata);
    }

    return this._framesPerSecond;
  }

  public get inMarkerAsSeconds(): number {
    return this.asSeconds(this._asset.timeStart);
  }

  public get outMarkerAsSeconds(): number {
    return this.asSeconds(this._asset.timeEnd);
  }

  private findMetadataValueFor(metadataName: string, object: any): string {
    if (object !== Object(object)) return null;

    const keys = Object.keys(object);

    if (keys.length === 2 && keys.sort().join('|') === 'name|value' && object.name === metadataName) {
      return object.value;
    }

    for (var key of keys) {
      const value = this.findMetadataValueFor(metadataName, object[key]);
      if (value) return value;
    }

    return null;
  }

  private asSeconds(frameNumber: string): number {
    return frameNumber ? this.scratchPadFrame.setFromFrameNumber(parseInt(frameNumber)).asSeconds() : undefined;
  }
}
