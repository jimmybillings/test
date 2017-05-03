export interface FormFields {
  name: string;
  type: string;
  value: string;
  label: string;
  hintTextStart?: string;
  hintTextEnd?: string;
  validation?: string;
  options?: string;
  tags?: Array<string>;

  // Use the following to control an input from a select.
  // The number of options should equal the number
  // of slaveFieldValues.  When an option is
  // selected, the slave field is updated to the
  // corresponding slave field value.
  slaveFieldName?: string;
  slaveFieldValues?: string[];
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
