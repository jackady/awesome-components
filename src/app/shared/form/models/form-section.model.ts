import { FormGroup } from "@angular/forms";
import { FormInput } from "./input.model";

export interface FormSection {

    title: string;
    group: FormGroup;
    rows: Record<string, FormInput>[];

}
