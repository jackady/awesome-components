import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { catchError, delay, map, Observable, of } from "rxjs";
import { environment } from "../../../../environments/environment";
import { FormSection } from "../../../shared/form/models/form-section.model";
import { FormInput } from "../../../shared/form/models/input.model";
import { FormService } from "../../../shared/form/services/form.service";
import { ComplexFormModel } from "../models/complex-form.model";
import { confirmEqualValidator } from "../validators/confirm-equal.validator";

@Injectable({ providedIn: 'root' })
export class ComplexFormService {

    private readonly TITLE_PERSONAL_INFO: string = 'Informations personnelles';
    private readonly LABEL_FIRST_NAME: string = 'Prénom';
    private readonly LABEL_LAST_NAME: string = 'Nom';

    private readonly TITLE_EMAIL: string = 'Email';
    private readonly LABEL_EMAIL: string = 'Adresse mail';
    private readonly LABEL_CONFIRM_EMAIL: string = 'Confirmer votre adresse mail';

    private readonly TITLE_LOGIN: string = 'Informations de connexion';
    private readonly LABEL_USERNAME: string = 'Nom d\'utilisateur';
    private readonly LABEL_PASSWORD: string = 'Mot de passe';
    private readonly LABEL_CONFIRM_PASSWORD: string = 'Confirmer votre mot de passe';

    constructor(
        private readonly formService: FormService,
        private readonly formBuilder: FormBuilder,
        private readonly http: HttpClient
    ) {}

    public buildPersonalInfoSection(): FormSection {
        const firstNameControl: FormControl<string | null> = this.formService.buildRequiredControl();
        const firstNameInput: FormInput = this.formService.buildFormInput(firstNameControl, this.LABEL_FIRST_NAME);

        const lastNameControl: FormControl<string | null> = this.formService.buildRequiredControl();
        const lastNameInput: FormInput = this.formService.buildFormInput(lastNameControl, this.LABEL_LAST_NAME);

        const personalInfoGroup: FormGroup = this.formBuilder.group({
            'firstName': firstNameInput.control,
            'lastName': lastNameInput.control
        });

        return this.formService.buildFormSection(this.TITLE_PERSONAL_INFO, personalInfoGroup,
            [ { 'firstName': firstNameInput, 'lastName': lastNameInput } ]);
    }

    public buildPreferenceSection(): FormSection {
        const preferenceControl: FormControl<string | null> = this.formService.buildControl('email');
        const preferenceInput: FormInput = this.formService.buildFormInput(preferenceControl);

        const preferenceGroup: FormGroup = this.formBuilder.group({ 'single': preferenceInput.control });

        return this.formService.buildFormSection('Comment préférez-vous être contacté(e) ?', preferenceGroup,
            [ { 'single': preferenceInput } ]);
    }

    public buildPhoneSection(): FormSection {
        const phoneControl: FormControl<string | null> = this.formService.buildControl();
        const phoneInput: FormInput = this.formService.buildFormInput(phoneControl, 'Numéro de téléphone');

        const phoneGroup: FormGroup = this.formBuilder.group({ 'single': phoneInput.control });

        return this.formService.buildFormSection('Téléphone', phoneGroup,
            [ { 'single': phoneInput } ]);
    }

    public buildEmailSection(): FormSection {
        const emailControl: FormControl<string | null> = this.formService.buildControl();
        const emailInput: FormInput = this.formService.buildFormInput(emailControl, this.LABEL_EMAIL);

        const confirmEmailControl: FormControl<string | null> = this.formService.buildControl();
        const confirmEmailInput: FormInput = this.formService.buildFormInput(
            confirmEmailControl, this.LABEL_CONFIRM_EMAIL);

        const emailGroup: FormGroup = this.formBuilder.group(
            { 'email': emailInput.control, 'confirm': confirmEmailInput.control },
            { validators: [ confirmEqualValidator('email', 'confirm') ], updateOn: 'blur' });

        return this.formService.buildFormSection(this.TITLE_EMAIL, emailGroup,
            [ { 'email': emailInput, 'confirm': confirmEmailInput } ]);
    }

    public buildLoginSection(): FormSection {
        const usernameControl: FormControl<string | null> = this.formService.buildRequiredControl();
        const usernameInput: FormInput = this.formService.buildFormInput(usernameControl, this.LABEL_USERNAME);

        const passwordControl: FormControl<string | null> = this.formService.buildRequiredControl();
        const passwordInput: FormInput = this.formService.buildFormInput(passwordControl, this.LABEL_PASSWORD);

        const confirmPasswordControl: FormControl<string | null> = this.formService.buildRequiredControl();
        const confirmPasswordInput: FormInput = this.formService.buildFormInput(
            confirmPasswordControl, this.LABEL_CONFIRM_PASSWORD);

        const loginGroup: FormGroup = this.formBuilder.group(
            {
                'username': usernameInput.control,
                'password': passwordInput.control,
                'confirmPassword': confirmPasswordInput.control
            },
            { validators: [ confirmEqualValidator('password', 'confirmPassword') ] });

        return this.formService.buildFormSection(this.TITLE_LOGIN, loginGroup,
            [
                { 'username': usernameInput },
                { 'password': passwordInput, 'confirmPassword': confirmPasswordInput }
            ]);
    }

    saveUserInfo(formValue: ComplexFormModel): Observable<boolean> {
        return this.http.post(`${ environment.apiUrl }/users`, formValue).pipe(
            map(() => true),
            delay(1000),
            catchError(() => of(false).pipe(
                delay(1000)
            ))
        );
    }
}