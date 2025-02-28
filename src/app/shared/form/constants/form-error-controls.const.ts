import { FormErrorControl } from "../models/form-error-control.model";

export type FormErrorControlLabel = 'required' | 'email' | 'minlength' | 'maxlength' | 'validValidator';

export const FormErrorControls: Record<FormErrorControlLabel, FormErrorControl> = {
    required: {
        errorLabel: 'required',
        errorMessage: 'Ce champ est requis',
        triggerValue: ''
    },
    email: {
        errorLabel: 'email',
        errorMessage: 'Ce champ doit présenter une adresse mail valide',
        triggerValue: 'not an email'
    },
    minlength: {
        errorLabel: 'minlength',
        errorMessage: 'Ce champ n\'est pas assez long',
        triggerValue: ' '
    },
    maxlength: {
        errorLabel: 'maxlength',
        errorMessage: 'Ce champ est trop long',
        triggerValue: ' '.repeat(999)
    },
    validValidator: {
        errorLabel: 'validValidator',
        errorMessage: 'Ce champ ne contient pas le mot VALID',
        triggerValue: ''
    }
}