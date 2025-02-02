import { CommentModel } from "../../shared/models/comment.model";

export interface PostModel {
    id: number;
    userId: number;
    title: string;
    createdDate: string;
    content: string;
    imageUrl: string;
    comments: CommentModel[];
}
