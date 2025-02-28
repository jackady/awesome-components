import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { ErrorControl } from "../../enums/error-control.model";
import { FormInput } from "../../models/input.model";
import { FormService } from "../../services/form.service";

@Component({
    selector: 'app-input-text',
    imports: [
        ReactiveFormsModule,
        MatFormField, MatLabel, MatInput, MatError
    ],
    templateUrl: './input-text.component.html',
    styleUrl: './input-text.component.scss'
})
export class InputTextComponent implements OnInit {

    private errorControls!: ErrorControl[];

    @Input() input!: FormInput;

    constructor(private readonly formService: FormService) {}

    ngOnInit(): void {
        this.errorControls = this.formService.initErrorControls(this.input.control);
    }

    public getErrorMessage(formControl: FormControl): string {
        return this.formService.getPriorityErrorMessage(formControl, this.errorControls);
    }
}
