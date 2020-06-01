/*
 * @Date: 2020-5-16 10:52:03
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-5-16 10:52:03
 * @Description:
 */
import { get } from "@/utils/fetch/index";
import { IGetOrdersByOrderSnRequestProps, IGetOrdersByOrderSn } from "./type";
const urls = {
  getOrdersByOrderSn: "/tkorder/getOrdersByOrderSn"
}

export const getGetOrdersByOrderSn: (IGetOrdersByOrderSnRequestProps) => Promise<IGetOrdersByOrderSn> = () => get(urls.getOrdersByOrderSn)
  