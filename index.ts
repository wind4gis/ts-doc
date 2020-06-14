import { get, post, postJson } from "@/utils/fetch/index";
import { IListRefundRequestProps, IListRefundResponseProps } from "./type";

//---------------------请求的url地址----------------------
const urls = {
	listRefund: "/returns/refund/app/search/listRefund", // C端获取售后列表
};

//---------------------发起请求的方法----------------------
// C端获取售后列表
export const getListRefund: (IListRefundRequestProps) => Promise<IListRefundResponseProps> = (params) =>
	get(urls.listRefund, params);
