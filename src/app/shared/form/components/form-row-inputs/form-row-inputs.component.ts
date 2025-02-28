import { NgForOf } from "@angular/common";
import { Component, Input } from '@angular/core';
import { FormRowInputs } from "../../types/form-types.type";
import { FormInputComponent } from "../form-input/form-input.component";

@Component({
    selector: 'app-form-row-inputs',
    imports: [
        FormInputComponent,
        NgForOf
    ],
    templateUrl: './form-row-inputs.component.html',
    styleUrl: './form-row-inputs.component.scss'
})
export class FormRowInputsComponent {

    @Input() formRowInputs!: FormRowInputs;

}
