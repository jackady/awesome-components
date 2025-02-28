import { Injectable } from "@angular/core";
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from "@angular/forms";
import { ErrorControl } from "../enums/error-control.model";
import { ErrorControlLabel, ErrorControls } from "../enums/error-controls.const";
import { FormSection } from "../models/form-section.model";
import { FormInput, InputType } from "../models/input.model";

@Injectable({ providedIn: 'root' })
export class FormService {

    private readonly EMPTY_STRING = '';
    private readonly DEFAULT_ERROR_MESSAGE: string = 'Ce champ contient une erreur';

    constructor(private readonly formBuilder: FormBuilder) {}

    public buildFormSection(title: string, group: FormGroup,
                            inputs: Record<string, FormInput>[]): FormSection {
        return { title: title, group: group, rows: inputs };
    }

    public buildFormInput(control: FormControl<string | null>, label?: string,
                          type?: InputType, confirm?: boolean): FormInput {
        return {
            label: label,
            control: control,
            type: type ?? 'text',
            confirm: confirm || false
        };
    }

    public buildRequiredControl(placeHolder?: string): FormControl<string | null> {
        return this.buildControl(placeHolder, true);
    }

    public buildControl(placeHolder?: string, required?: boolean): FormControl<string | null> {
        let inputPlaceHolder: string = placeHolder ?? this.EMPTY_STRING;

        return required ?
            this.formBuilder.control(inputPlaceHolder, Validators.required) :
            this.formBuilder.control(inputPlaceHolder);
    }

    public initErrorControls(control: AbstractControl): ErrorControl[] {
        const errorControls: ErrorControl[] = [];

        const validators: ValidatorFn | null = control.validator;

        // Here we define priority order for error controls
        if (validators !== null) {
            this.addErrorControlIfHasValidator(errorControls, validators, 'required')
            this.addErrorControlIfHasValidator(errorControls, validators, 'email')
            this.addErrorControlIfHasValidator(errorControls, validators, 'minlength')
            this.addErrorControlIfHasValidator(errorControls, validators, 'maxlength')
        }

        return errorControls;
    }

    public getPriorityErrorMessage(formControl: FormControl, errorControls: ErrorControl[]): string {
        const errorMessages: string[] = this.getErrorMessages(formControl, errorControls);
        return errorMessages.length === 0 ? this.DEFAULT_ERROR_MESSAGE : errorMessages[0];
    }

    private addErrorControlIfHasValidator(errorControls: ErrorControl[], validators: ValidatorFn,
                                          errorControlLabel: ErrorControlLabel): void {
        if (this.hasValidator(validators, errorControlLabel)) {
            errorControls.push(ErrorControls[errorControlLabel])
        }
    }

    private hasValidator(validators: ValidatorFn, errorControlLabel: ErrorControlLabel): boolean {
        const errorControl: ErrorControl = ErrorControls[errorControlLabel];
        return errorControl.errorLabel in this.getErrors(validators, errorControl.triggerValue);
    }

    private getErrors(validators: ValidatorFn, triggerValue: string | number): ValidationErrors {
        return validators(new FormControl(triggerValue)) ?? {};
    }

    private getErrorMessages(formControl: FormControl<any>, errorControls: ErrorControl[]) {
        return errorControls.filter((errorControl: ErrorControl): boolean =>
            formControl.hasError(errorControl.errorLabel)
        ).map((errorControl: ErrorControl): string => errorControl.errorMessage);
    }

}