/*
 * @Date: 2020-5-16 10:52:03
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-5-16 10:52:03
 * @Description:
 */
interface IGetOrdersByOrderSnRequestProps {
  orderPsn: string; // 
}


interface IGetOrdersByOrderSn {
  errorCode?: number; // 
  errorMsg?: string; // 
  result?: Array<IGetOrdersByOrderSnResult> []; // 
  success?: boolean; // 
}

interface IGetOrdersByOrderSnResult {
  orderSn?: string; // 淘宝子订单号
  itemTitle?: string; // 商品名称
  payPrice?: string; // 支付金额
  orderType?: string; // 订单类型
}
  