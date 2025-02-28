import { FormControl } from "@angular/forms";

import { FormInputType } from "../enums/form-input-type.enum";

export interface FormInput {

    label?: string;
    control: FormControl;
    type?: FormInputType;

}
