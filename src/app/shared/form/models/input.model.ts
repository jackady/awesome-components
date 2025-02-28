import { FormControl } from "@angular/forms";

export type InputType = "text" | "email" | "password";

export interface FormInput {

    label?: string;
    control: FormControl;
    type?: InputType;
    confirm?: boolean

}
