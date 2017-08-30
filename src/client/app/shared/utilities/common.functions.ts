import { Pojo } from '../interfaces/common.interface';

export class Common {
  public static deletePropertiesFromObject(object: Pojo, propertiesToDelete: Array<string>) {

    Object.keys(object).forEach((item: string) => {

      // Delete any properties on the object if
      // they are listed in the propertiesToDelete argument.
      if (propertiesToDelete.indexOf(item) > -1) {
        delete object[item];
        return;
      }

      // If the property is another object but not
      // an array then recusively call this function
      // again with the propertie value.
      if (typeof object[item] === 'object' && !Array.isArray(object[item])) {
        Common.deletePropertiesFromObject(object[item], propertiesToDelete);
      }

      // If the properties value is an array of objects then
      // loop over the array and recursivly call this function
      // again for each object in the array.
      if (typeof object[item] === 'object' && Array.isArray(object[item])) {
        object[item].forEach((item: any) => {
          if (typeof item === 'object' && !Array.isArray(item)) {
            Common.deletePropertiesFromObject(item, propertiesToDelete);
          }
        });
      }

    });
    return object;
  }

  public static urlStringToParamsObject(url: string): Pojo {
    var hashes: string | string[] = url.split(/;(.+)/)[1];
    hashes = (hashes) ? hashes.split(';') : [];
    return hashes.reduce((urlObj: Pojo, hash: string) => {
      let param: string[] = hash.split('=');
      urlObj[param[0]] = param[1];
      return urlObj;
    }, {});
  }

  public static urlParamsObjectToUrlStringParams(urlObj: Pojo): string {
    let paramString: string = ';';
    Object.keys(urlObj).forEach((param) => {
      paramString = paramString + param + '=' + urlObj[param] + ';';
    });
    paramString = paramString.slice(0, -1);
    return paramString;
  }

  public static clone<T>(object: T): T {
    try {
      return JSON.parse(JSON.stringify(object));
    } catch (error) {
      return object;
    }
  }

  public static setMarginTop(className: string, document: Pojo): void {
    let target = document.getElementsByClassName(className);
    let scrollTopMargin: number = -1 * document.body.getBoundingClientRect().top;
    target[target.length - 1].setAttribute('style', `margin-top: ${scrollTopMargin}px`);
  }
}
