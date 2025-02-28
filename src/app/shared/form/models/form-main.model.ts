import { FormGroup } from "@angular/forms";

import { FormSection } from "./form-section.model";

export interface FormMain<KeyType extends string> {

    title: string;
    group: FormGroup;
    sections: Record<KeyType, FormSection>;

}
