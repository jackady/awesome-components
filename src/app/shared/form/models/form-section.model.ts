import { FormGroup } from "@angular/forms";

import { FormRow } from "../types/form-types.type";


export interface FormSection {

    title: string;
    group: FormGroup;
    rows: FormRow[];

}
