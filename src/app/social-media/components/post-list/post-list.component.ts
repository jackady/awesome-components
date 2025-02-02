import { AsyncPipe, NgForOf } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from "@angular/router";

import { map, Observable } from "rxjs";
import { PostModel } from "../../models/post.model";
import { PostsService } from "../../services/post.service";
import { CommentedPostEvent } from "../events/commented-post.event";
import { PostListItemComponent } from "../post-list-item/post-list-item.component";

@Component({
    selector: 'app-post-list',
    imports: [
        PostListItemComponent,
        NgForOf,
        AsyncPipe
    ],
    templateUrl: './post-list.component.html',
    styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {

    posts$!: Observable<PostModel[]>;

    constructor(private readonly postsService: PostsService, private readonly route: ActivatedRoute) { }

    ngOnInit(): void {
        this.posts$ = this.route.data.pipe(
            map((data: Data) => data['posts'])
        );
    }

    addComment(commentedPostEvent: CommentedPostEvent) {
        this.postsService.addComment(commentedPostEvent);
    }
}
