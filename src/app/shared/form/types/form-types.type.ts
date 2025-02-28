import { FormInput } from "../models/form-input.model";
import { FormRowConfirm } from "../models/form-row-confirm.model";

export type FormRowInputs = FormInput[];

export type FormRow = FormRowInputs | FormRowConfirm;

