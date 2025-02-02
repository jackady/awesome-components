import {
    animate,
    animateChild,
    group,
    query,
    stagger,
    state,
    style,
    transition,
    trigger,
    useAnimation
} from "@angular/animations";
import { NgForOf, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconButton } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatList, MatListItem, MatListSubheaderCssMatStyler } from "@angular/material/list";
import { flashAnimation } from "../../animations/flash.animation";
import { slideAndFadeAnimation } from "../../animations/slide-and-fade.animation";
import { CommentModel } from "../../models/comment.model";
import { TimeAgoPipe } from "../../pipes/time-ago.pipe";

@Component({
    selector: 'app-comment',
    imports: [
        NgIf, NgForOf,
        MatList, MatListItem, MatListSubheaderCssMatStyler, MatFormField, MatInput, MatIconButton, MatIcon, ReactiveFormsModule, TimeAgoPipe
    ],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.scss',
    animations: [
        trigger('list', [
            transition(':enter', [
                query('@listItem', [
                    stagger(100, [
                        animateChild()
                    ])
                ])
            ])
        ]),
        trigger('listItem', [
            state('default', style({
                transform: 'scale(1)',
                'background-color': 'white',
                'z-index': 1
            })),
            state('active', style({
                transform: 'scale(1.05)',
                'background-color': 'lightgreen',
                'z-index': 2
            })),
            transition('default => active', [
                animate('100ms ease-in-out')
            ]),
            transition('active => default', [
                animate('500ms ease-in-out')
            ]),
            transition(':enter', [
                query('.comment-text, .comment-date', [
                    style({
                        opacity: 0
                    })
                ]),
                useAnimation(slideAndFadeAnimation, {
                    params: {
                        time: '500ms',
                        startColor: 'rgb(201, 157, 242)'
                    }
                }),
                group([
                    useAnimation(flashAnimation, {
                        params: {
                            time: '250ms',
                            flashColor: 'rgb(249,179,111)'
                        }
                    }),
                    query('.comment-text', [
                        animate('250ms', style({
                            opacity: 1
                        }))
                    ]),
                    query('.comment-date', [
                        animate('500ms', style({
                            opacity: 1
                        }))
                    ])
                ])
            ])
        ])
    ]
})
export class CommentsComponent implements OnInit {

    @Input() comments!: CommentModel[];

    @Output() newCommentEvent = new EventEmitter<string>();

    commentCtrl!: FormControl;
    animationStates: { [key: number]: 'default' | 'active' } = {};
    listItemAnimState: 'default' | 'active' = 'default';

    constructor(private readonly formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.commentCtrl = this.formBuilder.control('', [ Validators.required, Validators.minLength(10) ]);

        for (let index in this.comments) {
            this.animationStates[index] = 'default';
        }
    }

    onLeaveComment() {
        if (this.commentCtrl.valid) {
            const maxId = Math.max(...this.comments.map(comment => comment.id));
            this.comments.unshift({
                id: maxId + 1,
                comment: this.commentCtrl.value,
                createdDate: new Date().toISOString(),
                userId: 1
            });

            this.newCommentEvent.emit(this.commentCtrl.value)
            this.commentCtrl.reset();
        }
    }

    onListItemMouseEnter(index: number) {
        this.animationStates[index] = 'active';
    }

    onListItemMouseLeave(index: number) {
        this.animationStates[index] = 'default';
    }
}