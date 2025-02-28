import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, switchMap, take, tap } from 'rxjs';
import { environment } from "../../../../environments/environment";
import { CandidateModel } from '../models/candidate.model';

@Injectable({ providedIn: 'root' })
export class CandidatesService {

    private readonly _loading$ = new BehaviorSubject<boolean>(false);
    private readonly _candidates$ = new BehaviorSubject<CandidateModel[]>([]);

    private lastCandidatesLoad: number = 0;

    constructor(private readonly http: HttpClient) {}

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    get candidates$(): Observable<CandidateModel[]> {
        return this._candidates$.asObservable();
    }

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    getCandidatesFromServer() {
        if (Date.now() - this.lastCandidatesLoad > 300000) {
            this.setLoadingStatus(true);
            this.http.get<CandidateModel[]>(`${ environment.apiUrl }/candidates`).pipe(
                delay(1000),
                tap(candidates => {
                    this.lastCandidatesLoad = Date.now();
                    this._candidates$.next(candidates);
                    this.setLoadingStatus(false);
                })
            ).subscribe();
        }
    }

    getCandidateById(id: number): Observable<CandidateModel> {
        if (!this.lastCandidatesLoad) {
            this.getCandidatesFromServer();
        }
        return this.candidates$.pipe(
            map(candidates => candidates.filter(candidate => candidate.id === id)[0])
        );
    }

    refuseCandidate(id: number): void {
        this.setLoadingStatus(true);
        this.http.delete(`${ environment.apiUrl }/candidates/${ id }`).pipe(
            delay(1000),
            switchMap(() => this.candidates$),
            take(1),
            map(candidates => candidates.filter(candidate => candidate.id !== id)),
            tap(candidates => {
                this._candidates$.next(candidates);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    hireCandidate(id: number): void {
        this.candidates$.pipe(
            take(1),
            map(candidates => candidates
                .map(candidate => candidate.id === id ?
                    { ...candidate, company: 'Snapface Ltd' } :
                    candidate
                )
            ),
            tap(updatedCandidates => this._candidates$.next(updatedCandidates)),
            switchMap(updatedCandidates =>
                this.http.patch(`${ environment.apiUrl }/candidates/${ id }`,
                    updatedCandidates.find(candidate => candidate.id === id))
            )
        ).subscribe();
    }
}