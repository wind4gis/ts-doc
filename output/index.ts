/**
 * @Date: 2020-6-14 2:18:52
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-6-14 2:18:52
 * @Description:
 **/
import { get, post, postJson } from "@/utils/fetch/index";
import { IRefuseReceiveRequestProps, IRefuseReceiveResponseProps } from "./type";

//---------------------请求的url地址----------------------
const urls = {
	refuseReceive: "/returns/refund/app/flow/refuseReceive", // 移动端拒收
};

//---------------------发起请求的方法----------------------
// 移动端拒收
export const postRefuseReceive: (IRefuseReceiveRequestProps) => Promise<IRefuseReceiveResponseProps> = (
	params
) => post(urls.refuseReceive, params);
