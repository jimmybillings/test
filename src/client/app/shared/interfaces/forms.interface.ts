export interface FormFields {
  name: string;
  type: string;
  value: string;
  label: string;
  hintTextStart?: string;
  hintTextEnd?: string;
  validation?: string;
  options?: string;
}

export interface ServerErrors {
  code: string;
  fieldErrors?: Errors[];
  message: string;
}

export interface Errors {
  code?: string;
  field: string;
  message: string;
  resource?: string;
}
