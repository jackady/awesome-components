import { FormMain } from "../../../shared/form/models/form-main.model";

export type ComplexFormSectionKey = 'name' | 'contact' | 'email' | 'phone' | 'login';

export type ComplexForm = FormMain<ComplexFormSectionKey>;
