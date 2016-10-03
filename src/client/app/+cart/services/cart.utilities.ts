export class CartUtilities {
  public static nextNewProjectNameGiven(existingNames: Array<string>) {
    const prefix: string = 'Project ';
    const existingLetterCodes: Array<string> = existingNames
                                              .filter(name => name.indexOf(prefix) === 0)
                                              .map(name => name.replace(prefix, ''));
    const latestLetterCode: string = this.latestLetterCodeFrom(existingLetterCodes);
    let newLetterCode: string;
    let nextNumber: number = existingNames.length;

    do {
      newLetterCode = this.letterCodeFor(nextNumber);
      nextNumber += 1;
    } while (!this.isUsableLetterCode(newLetterCode, latestLetterCode, existingLetterCodes));

    return `${prefix}${newLetterCode}`;
  }

  public static latestLetterCodeFrom(existingLetterCodes: Array<string>) {
    return existingLetterCodes.reduce((previous: string, current: string) => {
      return this.compareLetterCodes(previous, current) > 0 ? previous : current;
    }, '');
  }

  public static isUsableLetterCode(proposedCode: string, latestCode: string, existingCodes: Array<string>) {
    return (this.compareLetterCodes(proposedCode, latestCode) > 0) && existingCodes.indexOf(proposedCode) === -1;
  }

  // Standard Java-style comparator: returns (-1, 0, 1) respectively if (a < b, a === b, a > b).
  public static compareLetterCodes(a: string, b: string) {
    if (a === b) return 0;
    if (a.length === b.length) return a < b ? -1 : 1;
    return (a.length < b.length) ? -1 : 1;
  }

  // Given an integer, returns a Excel-column-like lettered representation.
  // Examples:
  //   Inputs:  0, 1, 2, ... 25, 26, 27, 28, ... 51, 52, 53, 54, ... 675, 676, 677, ...
  //   Outputs: A, B, C, ...  Z, AA, AB, AC, ... AZ, BA, BB, BC, ...  ZZ, AAA, AAB, ...
  public static letterCodeFor(n: number): string {
    let alphabet: Array<string> = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let result: string = '';

    while (n >= 0) {
        result = `${alphabet[n % 26]}${result}`;
        n = Math.floor(n / 26) - 1;
    }

    return result;
  }
}
