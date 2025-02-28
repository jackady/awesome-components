import { ValidatorFn, Validators } from "@angular/forms";

export class FormInputValidators {

    public static readonly EMAIL_VALIDATORS: ValidatorFn[] = [ Validators.required, Validators.email ];
    public static readonly PHONE_VALIDATORS: ValidatorFn[] = [ Validators.required, Validators.minLength(10), Validators.maxLength(10) ];

}