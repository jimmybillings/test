export const ignoredFilePatterns: string[] = [
  // The ending '.ts' is implied.
  '*.interface',
  '*.module',
  '*.routes',
  'main',
  'system-config',
  'env.config'
];

export const ignoredDirectoryNames: string[] = [
  'imports'
];
