import { Injectable } from "@angular/core";
import { FormControl, ValidatorFn } from "@angular/forms";

import { FormRowConfirm } from "../models/form-row-confirm.model";
import { FormRow, FormRowInputs } from "../types/form-types.type";

@Injectable({ providedIn: 'root' })
export class FormUtilService {

    public isFormRowConfirm(row: FormRow): boolean { return 'confirm' in row; }

    public castInFormRowInputs(row: FormRow): FormRowInputs { return row as FormRowInputs; }

    public castInFormRowConfirm(row: FormRow): FormRowConfirm { return row as FormRowConfirm; }

    public setOrClearValidators(formControl: FormControl, isSetup: boolean, validators: ValidatorFn[]) {
        if (isSetup) {
            formControl.addValidators(validators);
        } else {
            formControl.clearValidators();
        }

        formControl.updateValueAndValidity();
    }

}