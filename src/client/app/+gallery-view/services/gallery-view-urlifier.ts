import { GalleryPath, GalleryPathSegment } from '../gallery-view.interface';

export class GalleryViewUrlifier {
  private static SEGMENT_DELIMITER: string = '~~~';
  private static SEGMENT_MEMBER_DELIMITER: string = '~~';
  private static SPACE_SYMBOL: string = '._.';

  public static urlify(path: GalleryPath): string[] {
    return (path && path.length > 0) ? [this.urlifyNamesIn(path), this.urlifyIdsIn(path)] : [];
  }

  public static unurlify(urlifiedNames: string, urlifiedIds: string): GalleryPath {
    if (!urlifiedNames || !urlifiedIds) return [];

    const allNames: string[][] = GalleryViewUrlifier.unurlifyNamesIn(urlifiedNames);
    const allIds: number[][] = GalleryViewUrlifier.unurlifyIdsIn(urlifiedIds);

    return allNames.map((names, index) => { return { names: names, ids: allIds[index] }; });
  }

  private static urlifyNamesIn(path: GalleryPath): string {
    return path.map(
      (segment: GalleryPathSegment) => {
        return segment.names.map(
          (name: string) => {
            return name.split(' ').join(GalleryViewUrlifier.SPACE_SYMBOL);
          }
        ).join(GalleryViewUrlifier.SEGMENT_MEMBER_DELIMITER);
      }
    ).join(GalleryViewUrlifier.SEGMENT_DELIMITER);
  }

  private static urlifyIdsIn(path: GalleryPath): string {
    return path.map(
      (segment: GalleryPathSegment) => {
        return segment.ids.join(GalleryViewUrlifier.SEGMENT_MEMBER_DELIMITER);
      }
    ).join(GalleryViewUrlifier.SEGMENT_DELIMITER);
  }

  private static unurlifyNamesIn(names: string): string[][] {
    return names
      .split(GalleryViewUrlifier.SPACE_SYMBOL)
      .join(' ')
      .split(GalleryViewUrlifier.SEGMENT_DELIMITER)
      .map(name => name.split(GalleryViewUrlifier.SEGMENT_MEMBER_DELIMITER));
  }

  private static unurlifyIdsIn(ids: string): number[][] {
    return ids
      .split(GalleryViewUrlifier.SEGMENT_DELIMITER)
      .map(idString => idString.split(GalleryViewUrlifier.SEGMENT_MEMBER_DELIMITER).map(idString => parseInt(idString)));
  }
}
