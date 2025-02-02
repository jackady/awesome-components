import { CommentModel } from "../../../shared/models/comment.model";

export class Post {

    constructor(
        readonly id: number,
        readonly userId: number,
        readonly title: string,
        readonly createdDate: Date,
        readonly content: string,
        readonly imageUrl: string,
        readonly comments: CommentModel[]
    ) {}

}
