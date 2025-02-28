import { Injectable } from "@angular/core";
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

import { FormErrorControlLabel, FormErrorControls } from "../constants/form-error-controls.const";
import { FormErrorControl } from "../models/form-error-control.model";

@Injectable({ providedIn: 'root' })
export class FormErrorService {

    private readonly DEFAULT_ERROR_MESSAGE: string = 'Ce champ contient une erreur';

    public initErrorControls(control: AbstractControl): FormErrorControl[] {
        const errorControls: FormErrorControl[] = [];

        const validators: ValidatorFn | null = control.validator;

        // Here we define priority order for error controls
        if (validators !== null) {
            // console.log('validators not null');
            this.addErrorControlIfHasValidator(errorControls, validators, 'required')
            this.addErrorControlIfHasValidator(errorControls, validators, 'email')
            this.addErrorControlIfHasValidator(errorControls, validators, 'minlength')
            this.addErrorControlIfHasValidator(errorControls, validators, 'maxlength')
        }

        return errorControls;
    }

    public getPriorityErrorMessage(formControl: FormControl, errorControls: FormErrorControl[]): string {
        const errorMessages: string[] = this.getErrorMessages(formControl, errorControls);
        return errorMessages.length === 0 ? this.DEFAULT_ERROR_MESSAGE : errorMessages[0];
    }

    private addErrorControlIfHasValidator(errorControls: FormErrorControl[], validators: ValidatorFn,
                                          errorControlLabel: FormErrorControlLabel): void {
        if (this.hasValidator(validators, errorControlLabel)) {
            // console.log('push errorControl:' + errorControlLabel);
            errorControls.push(FormErrorControls[errorControlLabel])
        }
    }

    private hasValidator(validators: ValidatorFn, errorControlLabel: FormErrorControlLabel): boolean {
        const errorControl: FormErrorControl = FormErrorControls[errorControlLabel];
        let errors = this.getErrors(validators, errorControl.triggerValue);
        // console.log(errorControl);
        // console.log(errors);
        return errorControl.errorLabel in errors;
    }

    private getErrors(validators: ValidatorFn, triggerValue: string | number): ValidationErrors {
        return validators(new FormControl(triggerValue)) ?? {};
    }

    private getErrorMessages(formControl: FormControl<any>, errorControls: FormErrorControl[]) {
        return errorControls.filter((errorControl: FormErrorControl): boolean =>
            formControl.hasError(errorControl.errorLabel)
        ).map((errorControl: FormErrorControl): string => errorControl.errorMessage);
    }

}