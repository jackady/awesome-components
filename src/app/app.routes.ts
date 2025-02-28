import { Routes } from '@angular/router';
import { ComplexFormComponent } from "./features/complex-form/components/complex-form/complex-form.component";
import { CandidateListComponent } from "./features/reactive-state/components/candidate-list/candidate-list.component";
import {
    SingleCandidateComponent
} from "./features/reactive-state/components/single-candidate/single-candidate.component";
import { PostListComponent } from "./features/social-media/components/post-list/post-list.component";
import { PostListResolver } from "./features/social-media/resolvers/post-list.resolver";

export const routes: Routes = [
    { path: 'candidates', component: CandidateListComponent },
    { path: 'candidates/:id', component: SingleCandidateComponent },
    { path: 'complex-form', component: ComplexFormComponent },
    {
        path: 'social-media',
        component: PostListComponent,
        resolve: { posts: PostListResolver }
    },
    {
        path: '**',
        redirectTo: 'social-media'
    }
];