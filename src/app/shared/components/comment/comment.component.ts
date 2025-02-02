import { NgForOf, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconButton } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatList, MatListItem, MatListSubheaderCssMatStyler } from "@angular/material/list";
import { CommentModel } from "../../models/comment.model";
import { TimeAgoPipe } from "../../pipes/time-ago.pipe";

@Component({
    selector: 'app-comment',
    imports: [
        NgIf, NgForOf,
        MatList, MatListItem, MatListSubheaderCssMatStyler, MatFormField, MatInput, MatIconButton, MatIcon, ReactiveFormsModule, TimeAgoPipe
    ],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss'
})
export class CommentsComponent implements OnInit {

    @Input() comments!: CommentModel[];

    @Output() newCommentEvent = new EventEmitter<string>();

    commentCtrl!: FormControl;

    constructor(private readonly formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.commentCtrl = this.formBuilder.control('', [ Validators.required, Validators.minLength(10) ]);
    }

    onLeaveComment() {
        if (this.commentCtrl.valid) {
            this.newCommentEvent.emit(this.commentCtrl.value)
            this.commentCtrl.reset();
        }
    }
}