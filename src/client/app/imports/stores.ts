
import { WAZEE_STORES } from './wazee';
import { Provider } from '@angular/core';

export const APPLICATION_STORES = [
  ...WAZEE_STORES
];

export const STORES:Provider[][] = [
  ...APPLICATION_STORES
];
