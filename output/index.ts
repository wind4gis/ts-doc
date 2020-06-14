import { get, post, postJson } from "@/utils/fetch/index";
import {
	IRefuseReceiveRequestProps,
	IRefuseReceiveResponseProps,
	IQueryWithDrawDetailRequestProps,
	IQueryWithDrawDetailResponseProps,
} from "./type";

//---------------------请求的url地址----------------------
const urls = {
	refuseReceive: "/returns/refund/app/flow/refuseReceive",
	queryWithDrawDetail: "/erpapp/withDrawal/queryWithDrawDetail",
};

// 展示用户提现明细
export const getQueryWithDrawDetail: (
	IQueryWithDrawDetailRequestProps
) => Promise<IQueryWithDrawDetailResponseProps> = (params) => get(urls.queryWithDrawDetail, params);
