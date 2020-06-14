import { IResponseType } from "undefined";

//---------------------评论点赞----------------------
export interface ICommentLikesRequestProps {}

export interface ICommentLikesResponseProps extends IResponseType {
	result?: boolean;
}
