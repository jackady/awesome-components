import { AsyncPipe, NgIf } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { map, Observable, startWith, tap } from "rxjs";
import { InputTextComponent } from "../../../../shared/form/components/input-text/input-text.component";
import { FormSection } from "../../../../shared/form/models/form-section.model";
import { FormService } from "../../../../shared/form/services/form.service";
import { ComplexFormService } from "../../services/complex-form.service";
import { validValidator } from "../../validators/valid.validator";

@Component({
    selector: 'app-complex-form',
    imports: [
        NgIf,
        ReactiveFormsModule,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardSubtitle,
        MatCardContent,
        MatCardActions,
        MatButton,
        MatFormField,
        MatLabel,
        MatInput,
        MatRadioGroup,
        MatRadioButton,
        MatError,
        AsyncPipe,
        MatProgressSpinner,
        InputTextComponent
    ],
    templateUrl: './complex-form.component.html',
    styleUrl: './complex-form.component.scss'
})
export class ComplexFormComponent implements OnInit {

    form!: FormGroup;

    personalInfoSection!: FormSection;
    preferenceSection!: FormSection;
    emailSection!: FormSection;
    phoneSection!: FormSection;
    loginSection!: FormSection;

    showEmailCtrl$!: Observable<boolean>;
    showPhoneCtrl$!: Observable<boolean>;

    showEmailError$!: Observable<boolean>;
    showPasswordError$!: Observable<boolean>;

    loading = false;

    constructor(
        private readonly complexFormService: ComplexFormService,
        private readonly formService: FormService,
        private readonly formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.initFormObservables();
    }

    private initForm(): void {
        this.personalInfoSection = this.complexFormService.buildPersonalInfoSection();
        this.preferenceSection = this.complexFormService.buildPreferenceSection();
        this.phoneSection = this.complexFormService.buildPhoneSection();
        this.emailSection = this.complexFormService.buildEmailSection();
        this.loginSection = this.complexFormService.buildLoginSection();

        this.form = this.formBuilder.group({
            personalInfo: this.personalInfoSection.group,
            contactPreference: this.preferenceSection.group,
            email: this.emailSection.group,
            phone: this.phoneSection.group,
            loginInfo: this.loginSection.group
        });
    }


    private initFormObservables() {
        const contactPreferenceCtrl = this.preferenceSection.rows[0]['single'].control;

        this.showEmailCtrl$ = contactPreferenceCtrl.valueChanges.pipe(
            startWith(contactPreferenceCtrl.value),
            map(preference => preference === 'email'),
            tap(showEmailCtrl => this.setEmailValidators(showEmailCtrl))
        );

        this.showPhoneCtrl$ = contactPreferenceCtrl.valueChanges.pipe(
            startWith(contactPreferenceCtrl.value),
            map(preference => preference === 'phone'),
            tap(showPhoneCtrl => this.setPhoneValidators(showPhoneCtrl))
        );

        this.showEmailError$ = this.emailSection.group.statusChanges.pipe(
            map(status =>
                status === 'INVALID' &&
                this.emailSection.rows[0]['email'].control.value &&
                this.emailSection.rows[0]['confirm'].control.value
            )
        );

        this.showPasswordError$ = this.loginSection.group.statusChanges.pipe(
            map(status =>
                status === 'INVALID' &&
                this.emailSection.rows[0]['password'] &&
                this.emailSection.rows[0]['confirmPassword'] &&
                this.loginSection.group.hasError('confirmEqual')
            )
        );
    }

    private setEmailValidators(showEmailCtrl: boolean) {
        const emailControl = this.emailSection.rows[0]['email'].control;
        const confirmControl = this.emailSection.rows[0]['confirm'].control;

        if (showEmailCtrl) {
            emailControl.addValidators([ Validators.required, Validators.email ]);
            confirmControl.addValidators([ Validators.required, Validators.email ]);
        } else {
            emailControl.clearValidators();
            confirmControl.clearValidators();
        }

        emailControl.updateValueAndValidity();
        confirmControl.updateValueAndValidity();
    }

    private setPhoneValidators(showPhoneCtrl: boolean) {
        if (showPhoneCtrl) {
            this.phoneCtrl.addValidators([
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10)
            ]);
        } else {
            this.phoneCtrl.clearValidators();
        }
        this.phoneCtrl.updateValueAndValidity();
    }

    getFormControlErrorText(ctrl: AbstractControl) {
        if (ctrl.hasError('required')) {
            return 'Ce champ est requis';
        } else if (ctrl.hasError('email')) {
            return 'Merci d\'entrer une adresse mail valide';
        } else if (ctrl.hasError('minlength')) {
            return 'Ce numéro de téléphone ne contient pas assez de chiffres';
        } else if (ctrl.hasError('maxlength')) {
            return 'Ce numéro de téléphone contient trop de chiffres';
        } else if (ctrl.hasError('validValidator')) {
            return 'Ce texte ne contient pas le mot VALID';
        } else {
            return 'Ce champ contient une erreur';
        }
    }

    onSubmitForm() {
        this.loading = true;
        this.complexFormService.saveUserInfo(this.form.value).pipe(
            tap(saved => {
                this.loading = false;
                if (saved) {
                    this.resetForm();
                } else {
                    console.error('Echec de l\'enregistrement');
                }
            })
        ).subscribe();
    }

    private resetForm() {
        this.form.reset();
        this.contactPreferenceCtrl.patchValue('email');
    }

    get firstNameControl(): FormControl<any> {
        return this.personalInfoSection.group.controls['firstName'] as FormControl;
    }
}