import { NgForOf, NgIf } from "@angular/common";
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";

import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle } from "@angular/material/card";

import { FormRowConfirm } from "../../models/form-row-confirm.model";
import { FormSection } from "../../models/form-section.model";
import { FormUtilService } from "../../services/form-util.service";
import { FormRow, FormRowInputs } from "../../types/form-types.type";
import { FormRowConfirmComponent } from "../form-row-confirm/form-row-confirm.component";
import { FormRowInputsComponent } from "../form-row-inputs/form-row-inputs.component";

@Component({
    selector: 'app-form-section',
    imports: [
        ReactiveFormsModule, NgIf, NgForOf,
        FormRowConfirmComponent, MatCard, MatCardHeader, MatCardSubtitle, FormRowInputsComponent, MatCardContent
    ],
    templateUrl: './form-section.component.html',
    styleUrl: './form-section.component.scss'
})
export class FormSectionComponent {

    @Input() formSection!: FormSection;

    constructor(private readonly formUtilService: FormUtilService) {}

    public isFormRowConfirm(row: FormRow): boolean { return this.formUtilService.isFormRowConfirm(row); }

    public castInFormRowInputs(row: FormRow): FormRowInputs { return this.formUtilService.castInFormRowInputs(row); }

    public castInFormRowConfirm(row: FormRow): FormRowConfirm { return this.formUtilService.castInFormRowConfirm(row); }

}
