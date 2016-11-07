import { SpecAnalyzer } from './src/specAnalyzer';

const analyzer: SpecAnalyzer = new SpecAnalyzer();

const abbreviate: Function = (filenames: string[]): string[] => {
  return filenames.map(filename => filename.replace(analyzer.rootDir, ''));
}

const log: Function = (message: string = ''): void => {
  console.log(`  ${message}`);
}

abbreviate(analyzer.sourcesWithoutSpecs)
  .forEach((sourceFilename: string) => log(`ERROR: No spec for ${sourceFilename}`));

if (analyzer.sourcesWithoutSpecs.length > 0) log();
log(`* Total number of testable source files: ${analyzer.allSourceFilenames.length}`);
log(`* Number of testable source files without a matching spec file: ${analyzer.sourcesWithoutSpecs.length}`);
log();

abbreviate(analyzer.specsWithoutSources)
  .forEach((specFilename: string) => log(`ERROR: No source for ${specFilename}`));

if (analyzer.specsWithoutSources.length > 0) log();
log(`* Total number of spec files: ${analyzer.allSpecFilenames.length}`);
log(`* Number of spec files without a matching source file: ${analyzer.specsWithoutSources.length}`);

process.exit(
  (analyzer.sourcesWithoutSpecs.length > 0 || analyzer.specsWithoutSources.length > 0) ? 1 : 0
);
