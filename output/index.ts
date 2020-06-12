/*
 * @Date: 2020-6-12 21:32:23
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-6-12 21:32:23
 * @Description:
 */
import { get } from "@/utils/fetch/index";
import { IQueryWithDrawDetailRequestProps, IQueryWithDrawDetailResponseProps } from "./type";
//---------------------请求的url地址----------------------
const urls = {
  queryWithDrawDetail: "/erpapp/withDrawal/queryWithDrawDetail", // 展示用户提现明细
}

//---------------------发起请求的方法----------------------
// 展示用户提现明细
export const getQueryWithDrawDetail: (IQueryWithDrawDetailRequestProps) => Promise<IQueryWithDrawDetailResponseProps> = () => get(urls.queryWithDrawDetail)
  