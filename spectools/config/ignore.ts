export const ignoredFilePatterns: string[] = [
  // The ending '.ts' is implied.
  '*.interface',
  '*.module',
  '*.routes',
  'main',
  'system-config',
  'env.config',
  'wz-clipboard.directive',
  'wz-pikaday.directive'
];

export const ignoredDirectoryNames: string[] = [
  'imports'
];
