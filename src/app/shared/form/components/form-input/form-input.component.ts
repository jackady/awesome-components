import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

import { FormErrorControl } from "../../models/form-error-control.model";
import { FormInput } from "../../models/form-input.model";
import { FormErrorService } from "../../services/form-error.service";

@Component({
    selector: 'app-form-input',
    imports: [
        ReactiveFormsModule,
        MatFormField, MatLabel, MatInput, MatError
    ],
    templateUrl: './form-input.component.html',
    styleUrl: './form-input.component.scss'
})
export class FormInputComponent implements OnInit {

    @Input() input!: FormInput;

    errorControls!: FormErrorControl[]

    constructor(private readonly formErrorService: FormErrorService) {}

    ngOnInit(): void {
        this.errorControls = this.formErrorService.initErrorControls(this.input.control);

        console.log(this.input.label + ':');
        console.log(this.errorControls);
    }

    public getErrorMessage(formControl: FormControl): string {
        return this.formErrorService.getPriorityErrorMessage(formControl, this.errorControls);
    }
}
