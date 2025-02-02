import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { CommentedPostEvent } from "../events/commented-post.event";
import { PostModel } from "../models/post.model";

@Injectable({ providedIn: 'root' })
export class PostsService {

    constructor(private readonly http: HttpClient) {}

    getPostList(): Observable<PostModel[]> {
        return this.http.get<PostModel[]>(`${ environment.apiUrl }/posts`);
    }

    addComment(commentedPostEvent: CommentedPostEvent) {
        console.log(commentedPostEvent);
    }

}