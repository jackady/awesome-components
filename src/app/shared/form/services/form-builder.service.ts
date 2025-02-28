import { Injectable } from "@angular/core";
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormInputType } from "../enums/form-input-type.enum";
import { FormInput } from "../models/form-input.model";
import { FormMain } from "../models/form-main.model";
import { FormRowConfirm } from "../models/form-row-confirm.model";
import { FormSection } from "../models/form-section.model";
import { FormRow, FormRowInputs } from "../types/form-types.type";

import { confirmEqualValidator } from "../validators/confirm-equal.validator";
import { FormUtilService } from "./form-util.service";

@Injectable({ providedIn: 'root' })
export class FormBuilderService {

    private readonly EMPTY_STRING: string = '';

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly formUtilService: FormUtilService
    ) {}

    public buildFormMain<KeyType extends string>(title: string, sections: Record<KeyType, FormSection>): FormMain<KeyType> {
        const formGroup: FormGroup = this.formBuilder.group({});

        for (let key in sections) {
            formGroup.addControl(key, sections[key].group);
        }

        return { title: title, group: formGroup, sections: sections };
    }

    public buildFormSection(title: string, rows: FormRow[]): FormSection {
        const formGroup = this.buildFormGroupFromFormRows(rows);
        return { title: title, group: formGroup, rows: rows };
    }

    private buildFormGroupFromFormRows(rows: FormRow[]) {
        const formGroup: FormGroup = this.formBuilder.group({});

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let inputKey: string = `row-${ i }`;

            if (this.formUtilService.isFormRowConfirm(row)) {
                let formRowConfirm: FormRowConfirm = this.formUtilService.castInFormRowConfirm(row);

                let inputKeyBase: string = `${ inputKey }-base`;
                let inputKeyConfirm: string = `${ inputKey }-confirm`;

                formGroup.addControl(inputKeyBase, formRowConfirm.base.control);
                formGroup.addControl(inputKeyConfirm, formRowConfirm.confirm.control);

                formGroup.addValidators([ confirmEqualValidator(inputKeyBase, inputKeyConfirm) ]);
            } else {
                let formInputs: FormRowInputs = this.formUtilService.castInFormRowInputs(row);

                for (let j = 0; j < formInputs.length; j++) {
                    formGroup.addControl(`${ inputKey }-${ j }`, formInputs[j].control);
                }
            }

        }

        return formGroup;
    }

    public buildRequiredFormInput(label?: string, type?: FormInputType, placeHolder?: string): FormInput {
        const control: FormControl<string | null> = this.buildControl(placeHolder, { validators: [ Validators.required ] });
        return this.buildFormInputWithFormControl(control, label, type);
    }

    public buildFormInput(label?: string, type?: FormInputType, options?: AbstractControlOptions, placeHolder?: string): FormInput {
        const control: FormControl<string | null> = this.buildControl(placeHolder, options);
        return this.buildFormInputWithFormControl(control, label, type);
    }

    public buildFormInputWithFormControl(control: FormControl<string | null>, label?: string, type?: FormInputType): FormInput {
        return { label: label, control: control, type: type ?? FormInputType.TEXT };
    }

    public buildControl(placeHolder?: string, options?: AbstractControlOptions): FormControl<string | null> {
        const inputPlaceHolder: string = placeHolder ?? this.EMPTY_STRING;
        return this.formBuilder.control(inputPlaceHolder, options);
    }

}