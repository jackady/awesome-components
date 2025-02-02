import { Pipe, PipeTransform } from '@angular/core';
import { UserNameModel } from "../models/user-name.model";

@Pipe({
    name: 'username'
})
export class UsernamePipe implements PipeTransform {
    transform(value: UserNameModel, locale: 'en' | 'fr' = 'fr'): string {
        let upperCaseLastname = value.lastName.toUpperCase();

        return locale === 'en' ?
            `${ upperCaseLastname } ${ value.firstName }` :
            `${ value.firstName } ${ upperCaseLastname }`;
    }
}