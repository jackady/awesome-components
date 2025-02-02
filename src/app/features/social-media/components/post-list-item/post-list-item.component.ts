import { NgIf, TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";
import { CommentsComponent } from "../../../../shared/components/comment/comment.component";
import { HighlightDirective } from "../../../../shared/directives/highlight.directive";
import { ShortenPipe } from "../../../../shared/pipes/shorten.pipe";
import { TimeAgoPipe } from "../../../../shared/pipes/time-ago.pipe";
import { CommentedPostEvent } from "../../events/commented-post.event";
import { PostModel } from "../../models/post.model";

@Component({
    selector: 'app-post-list-item',
    imports: [
        NgIf,
        TitleCasePipe, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardImage,
        CommentsComponent, ShortenPipe, TimeAgoPipe, HighlightDirective
    ],
    templateUrl: './post-list-item.component.html',
    styleUrl: './post-list-item.component.scss'
})
export class PostListItemComponent {

    @Input() post!: PostModel;

    @Output() commentedPostEvent: EventEmitter<CommentedPostEvent> = new EventEmitter<CommentedPostEvent>();

    addComment(comment: string) {
        this.commentedPostEvent.emit({ postId: this.post.id, comment });
    }
}
