import { AsyncPipe, NgIf } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { MatButton } from "@angular/material/button";
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatCardTitleGroup
} from "@angular/material/card";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, switchMap, take, tap } from "rxjs";
import { CandidateModel } from "../../models/candidate.model";
import { CandidatesService } from "../../services/candidates.service";

@Component({
    selector: 'app-single-candidate',
    imports: [
        MatCard,
        MatProgressSpinner,
        MatCardActions,
        MatButton,
        AsyncPipe,
        NgIf,
        MatCardContent,
        MatCardTitleGroup,
        MatCardTitle,
        MatCardSubtitle
    ],
    templateUrl: './single-candidate.component.html',
    styleUrl: './single-candidate.component.scss'
})
export class SingleCandidateComponent implements OnInit {

    loading$!: Observable<boolean>;
    candidate$!: Observable<CandidateModel>;

    constructor(
        private readonly candidatesService: CandidatesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.initObservables();
    }

    private initObservables() {
        this.loading$ = this.candidatesService.loading$;
        this.candidate$ = this.activatedRoute.params.pipe(
            switchMap(params => this.candidatesService.getCandidateById(+params['id']))
        );
    }

    onHire() {
        this.candidate$.pipe(
            take(1),
            tap(candidate => {
                this.candidatesService.hireCandidate(candidate.id);
                this.onGoBack();
            })
        ).subscribe();
    }

    onRefuse() {
        this.candidate$.pipe(
            take(1),
            tap(candidate => {
                this.candidatesService.refuseCandidate(candidate.id);
                this.onGoBack();
            })
        ).subscribe();
    }

    onGoBack() {
        this.router.navigateByUrl('candidates');
    }
}
