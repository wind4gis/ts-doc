import { get, post, postJson } from "undefined";
import { ICommentLikesRequestProps, ICommentLikesResponseProps } from "./type";

//---------------------请求的url地址----------------------
const urls = {
	commentLikes: "api/product-restructure/comment/commentLikes?commentId={0}", // 评论点赞
};

//---------------------发起请求的方法----------------------
// 评论点赞
export const getCommentLikes: (ICommentLikesRequestProps) => Promise<ICommentLikesResponseProps> = (params) =>
	get(urls.commentLikes, params);
