import { Component } from '@angular/core';
import { MatToolbar, MatToolbarRow } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-header',
    imports: [
        RouterLink,
        MatToolbarRow,
        MatToolbar
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
