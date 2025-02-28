import { Injectable } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { FormInputType } from "../../../shared/form/enums/form-input-type.enum";

import { FormInput } from "../../../shared/form/models/form-input.model";
import { FormMain } from "../../../shared/form/models/form-main.model";
import { FormRowConfirm } from "../../../shared/form/models/form-row-confirm.model";
import { FormSection } from "../../../shared/form/models/form-section.model";
import { FormBuilderService } from "../../../shared/form/services/form-builder.service";
import { InputRadioContactValue } from "../classes/input-radio-contact-values.class";
import { ComplexFormLabel } from "../enums/complex-form-label.enum";
import { ComplexFormSectionKey } from "../types/complex-form-section-key.type";

@Injectable({ providedIn: 'root' })
export class ComplexFormBuilderService {

    constructor(private readonly formBuilderService: FormBuilderService) {}

    public buildForm(): FormMain<ComplexFormSectionKey> {
        const form: Record<ComplexFormSectionKey, FormSection> = {
            name: this.buildNameSection(),
            contact: this.buildContactSection(),
            email: this.buildEmailSection(),
            phone: this.buildPhoneSection(),
            login: this.buildLoginSection()
        };

        return this.formBuilderService.buildFormMain(ComplexFormLabel.FORM_TITLE, form);
    }

    private buildNameSection(): FormSection {
        const firstNameInput: FormInput = this.formBuilderService.buildRequiredFormInput(ComplexFormLabel.INPUT_FIRST_NAME_LABEL);
        const lastNameInput: FormInput = this.formBuilderService.buildRequiredFormInput(ComplexFormLabel.INPUT_LAST_NAME_LABEL);

        return this.formBuilderService.buildFormSection(ComplexFormLabel.SECTION_PERSONAL_INFO_TITLE, [ [ firstNameInput, lastNameInput ] ]);
    }

    private buildContactSection(): FormSection {
        const preferenceControl: FormControl<string | null> = this.formBuilderService.buildControl(InputRadioContactValue.EMAIL.value);
        const preferenceInput: FormInput = this.formBuilderService.buildFormInputWithFormControl(preferenceControl);

        return this.formBuilderService.buildFormSection(ComplexFormLabel.SECTION_CONTACT_PREFERENCE_TITLE, [ [ preferenceInput ] ]);
    }

    private buildPhoneSection(): FormSection {
        const phoneInput: FormInput = this.formBuilderService.buildFormInput(ComplexFormLabel.INPUT_PHONE_LABEL);

        return this.formBuilderService.buildFormSection(ComplexFormLabel.SECTION_PHONE_TITLE, [ [ phoneInput ] ]);
    }

    private buildEmailSection(): FormSection {
        const emailInput: FormInput = this.formBuilderService.buildFormInput(ComplexFormLabel.INPUT_EMAIL_LABEL,
            FormInputType.TEXT, { updateOn: 'blur' });
        const confirmEmailInput: FormInput = this.formBuilderService.buildFormInput(ComplexFormLabel.INPUT_CONFIRM_EMAIL_LABEL,
            FormInputType.TEXT, { updateOn: 'blur' });
        const formRowConfirm: FormRowConfirm = { base: emailInput, confirm: confirmEmailInput };

        return this.formBuilderService.buildFormSection(ComplexFormLabel.SECTION_EMAIL_TITLE, [ formRowConfirm ]);
    }

    private buildLoginSection(): FormSection {
        const usernameInput: FormInput = this.formBuilderService.buildRequiredFormInput(ComplexFormLabel.INPUT_USERNAME_LABEL);

        const passwordInput: FormInput = this.formBuilderService.buildFormInput(ComplexFormLabel.INPUT_PASSWORD_LABEL,
            FormInputType.PASSWORD, { validators: [ Validators.required ], updateOn: 'blur' });
        const confirmPasswordInput: FormInput = this.formBuilderService.buildFormInput(ComplexFormLabel.INPUT_CONFIRM_PASSWORD_LABEL,
            FormInputType.PASSWORD, { validators: [ Validators.required ], updateOn: 'blur' });
        const formRowConfirm: FormRowConfirm = { base: passwordInput, confirm: confirmPasswordInput };

        return this.formBuilderService.buildFormSection(ComplexFormLabel.SECTION_LOGIN_TITLE, [ [ usernameInput ], formRowConfirm ]);
    }

}