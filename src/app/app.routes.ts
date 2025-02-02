import { Routes } from '@angular/router';
import { PostListComponent } from "./social-media/components/post-list/post-list.component";
import { PostListResolver } from "./social-media/resolvers/post-list.resolver";

export const routes: Routes = [
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