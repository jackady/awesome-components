import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PostModel } from "../models/post.model";
import { PostsService } from '../services/post.service';

@Injectable({ providedIn: 'root' })
export class PostListResolver implements Resolve<PostModel[]> {

    constructor(private readonly postsService: PostsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PostModel[]> {
        return this.postsService.getPostList();
    }
}