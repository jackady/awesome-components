import { AsyncPipe, NgIf } from "@angular/common";
import { Component, Input, OnInit } from '@angular/core';
import { FormControlStatus, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { map, Observable } from "rxjs";
import { FormRowConfirm } from "../../models/form-row-confirm.model";
import { FormSection } from "../../models/form-section.model";
import { FormInputComponent } from "../form-input/form-input.component";

@Component({
    selector: 'app-form-row-confirm',
    imports: [
        ReactiveFormsModule, NgIf, AsyncPipe,
        FormInputComponent
    ],
    templateUrl: './form-row-confirm.component.html',
    styleUrl: './form-row-confirm.component.scss'
})
export class FormRowConfirmComponent implements OnInit {

    @Input() formSection!: FormSection;
    @Input() formRowConfirm!: FormRowConfirm;

    showConfirmError$!: Observable<boolean>;

    ngOnInit(): void {
        const formGroup: FormGroup = this.formSection.group;
        const baseControl = this.formRowConfirm.base.control;
        const confirmControl = this.formRowConfirm.confirm.control;

        this.showConfirmError$ = formGroup.statusChanges.pipe(
            map((status: FormControlStatus): boolean =>
                status === 'INVALID' &&
                formGroup.hasError('confirmEqual') &&
                baseControl.value && confirmControl.value
            )
        );
    }

}
