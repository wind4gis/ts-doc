/*
 * @Date: 2020-6-12 13:53:37
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-6-12 13:53:37
 * @Description:
 */
import { post } from "@/utils/fetch/index";
import { IFrontWithdrawalRequestProps } from "./type"; //---------------------请求的url地址----------------------

const urls = {
  frontWithdrawal: "/erpapp/withDrawal/frontWithdrawal" // 支持亿联,财务公司(薪宝和云企蕙),支付宝的提现,根据不同业务处理不同

}; //---------------------发起请求的方法----------------------
// 支持亿联,财务公司(薪宝和云企蕙),支付宝的提现,根据不同业务处理不同

export const postFrontWithdrawal = () => post(urls.frontWithdrawal);