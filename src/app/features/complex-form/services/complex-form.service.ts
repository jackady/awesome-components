import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl, FormGroup, ValidatorFn } from "@angular/forms";

import { catchError, delay, map, Observable, of, startWith, tap } from "rxjs";

import { environment } from "../../../../environments/environment";
import { FormInputValidators } from "../../../shared/form/classes/form-input-validators.class";
import { FormInputRadioValue } from "../../../shared/form/models/form-input-radio-value.model";
import { FormMain } from "../../../shared/form/models/form-main.model";
import { FormRowConfirm } from "../../../shared/form/models/form-row-confirm.model";
import { FormUtilService } from "../../../shared/form/services/form-util.service";
import { FormRowInputs } from "../../../shared/form/types/form-types.type";
import { InputRadioContactValue } from "../classes/input-radio-contact-values.class";
import { ComplexFormDto } from "../models/complex-form-dto.model";
import { ComplexFormSectionKey } from "../types/complex-form-section-key.type";
import { ComplexFormBuilderService } from "./complex-form-builder.service";

@Injectable({ providedIn: 'root' })
export class ComplexFormService {

    public form!: FormMain<ComplexFormSectionKey>;

    public loading!: boolean;

    constructor(
        private readonly formUtilService: FormUtilService,
        private readonly complexFormBuilderService: ComplexFormBuilderService,
        private readonly httpClient: HttpClient
    ) {
        this.initForm();
    }

    public initForm(): void {
        this.form = this.complexFormBuilderService.buildForm();
        this.loading = false;
    }

    public get contactPreference(): FormControl {
        return ( this.form.sections['contact'].rows[0] as FormRowInputs )[0].control;
    }

    public buildEmailSectionConditionObservable(): Observable<boolean> {
        return this.buildSectionConditionObservable(this.contactPreference, InputRadioContactValue.EMAIL,
            (isSelected: boolean): void => this.setOrClearEmailValidators(isSelected));
    }

    public buildPhoneSectionConditionObservable(): Observable<boolean> {
        return this.buildSectionConditionObservable(this.contactPreference, InputRadioContactValue.PHONE,
            (isSelected: boolean): void => this.setOrClearPhoneValidators(isSelected));
    }

    public submitForm() {
        this.loading = true;

        let formGroup: FormGroup = this.form.group;
        this.saveUserInfo(formGroup.value).pipe(
            tap((saved: boolean): void => {
                this.loading = false;

                if (saved) {
                    formGroup.reset();
                    this.contactPreference.patchValue(InputRadioContactValue.EMAIL.value);
                } else {
                    console.error('Echec de l\'enregistrement');
                }
            })
        ).subscribe();
    }

    private buildSectionConditionObservable(formControl: FormControl<string>, contactValue: FormInputRadioValue,
                                            setOrClearValidatorsCallback: (isSelected: boolean) => void): Observable<boolean> {
        return formControl.valueChanges.pipe(
            startWith(formControl.value),
            map((value: string): boolean => {
                let isSelected = value === contactValue.value;
                setOrClearValidatorsCallback(isSelected);
                return isSelected
            })
        );
    }

    private setOrClearEmailValidators(isSetup: boolean): void {
        const formRowConfirm: FormRowConfirm = this.form.sections['email'].rows[0] as FormRowConfirm;
        const validators: ValidatorFn[] = FormInputValidators.EMAIL_VALIDATORS;

        this.formUtilService.setOrClearValidators(formRowConfirm.base.control, isSetup, validators);
        this.formUtilService.setOrClearValidators(formRowConfirm.confirm.control, isSetup, validators);
    }

    private setOrClearPhoneValidators(isSetup: boolean): void {
        const phoneControl: FormControl = ( this.form.sections['phone'].rows[0] as FormRowInputs )[0].control;

        this.formUtilService.setOrClearValidators(phoneControl, isSetup, FormInputValidators.PHONE_VALIDATORS);
    }

    private saveUserInfo(formValue: ComplexFormDto): Observable<boolean> {
        return this.httpClient.post(`${ environment.apiUrl }/users`, formValue).pipe(
            map(() => true),
            delay(1000),
            catchError(() => of(false).pipe(
                delay(1000)
            ))
        );
    }
}