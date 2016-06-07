import {IFormFields} from './forms.interface.ts';

export interface IuiConfig {
  id: number;
  siteName: string;
  createdOn: string;
  lastUpdated: string;
  components: IuiComponents;
  config: {};
}

export interface IuiComponents {
  [ index: string ]: {config: IuiSubComponents};
}

export interface IuiSubComponents {
  [ index: string ]: {items?: Array<IuiTableHeaders> | Array<IFormFields>, value?: string};
}

export interface IuiTableHeaders {
  name: string;
  label: string;
}
