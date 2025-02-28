import { ErrorControl } from "./error-control.model";

export type ErrorControlLabel = 'required' | 'email' | 'minlength' | 'maxlength' | 'validValidator';

export const ErrorControls: Record<ErrorControlLabel, ErrorControl> = {
    required: {
        errorLabel: 'required',
        errorMessage: 'Ce champ est requis',
        triggerValue: ''
    },
    email: {
        errorLabel: 'email',
        errorMessage: 'Merci d\'entrer une adresse mail valide',
        triggerValue: ''
    },
    minlength: {
        errorLabel: 'minlength',
        errorMessage: 'Ce numéro de téléphone ne contient pas assez de chiffres',
        triggerValue: -Infinity
    },
    maxlength: {
        errorLabel: 'maxlength',
        errorMessage: 'Ce numéro de téléphone contient trop de chiffres',
        triggerValue: -Infinity
    },
    validValidator: {
        errorLabel: 'validValidator',
        errorMessage: 'Ce texte ne contient pas le mot VALID',
        triggerValue: ''
    }
}