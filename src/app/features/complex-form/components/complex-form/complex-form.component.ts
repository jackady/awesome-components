import { AsyncPipe, NgIf } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { MatButton } from "@angular/material/button";
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";

import { Observable } from "rxjs";

import { FormSectionComponent } from "../../../../shared/form/components/form-section/form-section.component";
import { InputRadioContactValue } from "../../classes/input-radio-contact-values.class";
import { ComplexFormService } from "../../services/complex-form.service";
import { ComplexForm } from "../../types/complex-form-section-key.type";

@Component({
    selector: 'app-complex-form',
    imports: [
        ReactiveFormsModule, NgIf, AsyncPipe,
        FormSectionComponent,
        MatCard, MatCardHeader, MatCardContent, MatCardActions, MatCardTitle, MatCardSubtitle,
        MatRadioGroup, MatRadioButton, MatButton, MatProgressSpinner
    ],
    templateUrl: './complex-form.component.html',
    styleUrl: './complex-form.component.scss'
})
export class ComplexFormComponent implements OnInit {

    protected readonly contactValues = InputRadioContactValue;

    protected complexForm!: ComplexForm;
    protected showEmailSection$!: Observable<boolean>;

    protected showPhoneSection$!: Observable<boolean>;

    protected loading!: boolean;

    constructor(private readonly complexFormService: ComplexFormService) {}

    ngOnInit(): void {
        this.complexFormService.initForm();

        this.complexForm = this.complexFormService.form;
        this.loading = this.complexFormService.loading;

        this.showEmailSection$ = this.complexFormService.buildEmailSectionConditionObservable();
        this.showPhoneSection$ = this.complexFormService.buildPhoneSectionConditionObservable();
    }

    public onClick(): void { this.complexFormService.submitForm(); }

    public get contactPreference(): FormControl { return this.complexFormService.contactPreference; }
}