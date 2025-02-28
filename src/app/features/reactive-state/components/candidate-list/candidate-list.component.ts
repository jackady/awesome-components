import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatList, MatListItem, MatListItemAvatar, MatListItemLine, MatListItemTitle } from "@angular/material/list";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatFormField, MatOption, MatSelect, MatSuffix } from "@angular/material/select";
import { RouterLink } from "@angular/router";
import { combineLatest, map, Observable, startWith } from "rxjs";
import { CandidateSearchType } from "../../enums/candidate-search-type.enum";
import { CandidateModel } from "../../models/candidate.model";
import { CandidatesService } from "../../services/candidates.service";

@Component({
    selector: 'app-candidate-list',
    imports: [
        NgIf, NgForOf,
        AsyncPipe,
        RouterLink,
        MatCard, MatCardHeader, MatCardTitle, MatCardContent,
        MatList, MatListItem, MatListItemAvatar, MatListItemTitle, MatListItemLine,
        MatProgressSpinner, MatFormField, MatIcon, MatSuffix, MatInput, ReactiveFormsModule, MatOption, MatSelect
    ],
    templateUrl: './candidate-list.component.html',
    styleUrl: './candidate-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateListComponent implements OnInit {

    loading$!: Observable<boolean>;
    candidates$!: Observable<CandidateModel[]>;

    searchCtrl!: FormControl;
    searchTypeCtrl!: FormControl;
    searchTypeOptions!: {
        value: CandidateSearchType,
        label: string
    }[];

    constructor(private readonly candidatesService: CandidatesService,
                private readonly formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.initForm();
        this.initObservables();
        this.candidatesService.getCandidatesFromServer();
    }

    private initForm() {
        this.searchCtrl = this.formBuilder.control('');
        this.searchTypeCtrl = this.formBuilder.control(CandidateSearchType.LASTNAME);
        this.searchTypeOptions = [
            { value: CandidateSearchType.LASTNAME, label: 'Nom' },
            { value: CandidateSearchType.FIRSTNAME, label: 'Prénom' },
            { value: CandidateSearchType.COMPANY, label: 'Entreprise' }
        ];
    }

    private initObservables() {
        this.loading$ = this.candidatesService.loading$;
        // this.candidates$ = this.candidatesService.candidates$;

        const search$ = this.searchCtrl.valueChanges.pipe(
            startWith(this.searchCtrl.value),
            map(value => value.toLowerCase())
        );
        const searchType$: Observable<CandidateSearchType> = this.searchTypeCtrl.valueChanges.pipe(
            startWith(this.searchTypeCtrl.value)
        );

        this.candidates$ = combineLatest([
                search$,
                searchType$,
                this.candidatesService.candidates$
            ]
        ).pipe(
            map(([ search, searchType, candidates ]) =>
                candidates.filter(candidate => candidate[searchType]
                    .toLowerCase()
                    .includes(search as string))
            )
        );
    }

}
