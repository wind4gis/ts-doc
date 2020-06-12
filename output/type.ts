/*
 * @Date: 2020-6-12 21:32:23
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-12 23:05:07
 * @Description:
 */
import { IResponseType } from "@/utils/fetch/type";

//---------------------展示用户提现明细----------------------
export interface IQueryWithDrawDetailRequestProps
{
    businessCode?: string; // 提现订单编号
}

export interface IQueryWithDrawDetailProps
{
    amount?: number; // 提现金额 (分)
    bankAccountName?: string; // 账户名
    bankAccountNo?: string; // 银行卡号
    createTime?: number; // 创建提现时间
    fullBankName?: string; // 开户行全称（带支行）  id?: number; // 主键id
    memberId?: number; // 用户id
    platformCode?: string; // 平台编号(1000,小程序 ;2000,探市APP; 3000,经纪公司)
    sellerNum?: string; // 商家编号
    status?: number; // 状态 0:待处理；1：已提交；3：提现成功； 4:提现失败
    successTime?: string; // 提现成功时间
    withdrawOrderSn?: string; // 提现订单编号
    withdrawType?: number; // 提现类型 1：商家，2：支付宝,3;薪宝,4:云企惠
    approveTime?: string; // 审批时间(通过或失败)
    withDrawFailReason?: string; // 提现失败原因
}//---------------------C端获取售后列表----------------------
export interface IListRefundRequestProps
{
    currentPage: number // 当前页
    pageSize: number // 页量大小
    sourceType: number // 4 APP商家，5 APP用户，6 小程序用户，7 H5用户
}
export interface IListRefundProps
{
    errorCode?: number // 错误码，0 成功
    errorMsg?: string // 错误描述
    result?: IResultProps // null
    success?: boolean // null
}
export interface IResultProps
{
    data?: Array<IDataProps> // 数据集
    totalCount?: number // 总记录数
    totalPage?: number // 总页数
}
export interface IDataProps
{
    refundSn?: string // 售后单号
    orderSn?: string // 订单号
    id?: number // 售后ID
    createTime?: number // 创建时间
    refundStatusStr?: string // 售后状态描述：如 待回寄、待收货、待审核等
    refundNumber?: number // 售后数量
    orderProduct?: IOrderProductProps // 网单信息
    refundMoney?: number // 售后金额
    refundTypeStr?: string // 售后类型描述：如仅退款、退货退款
    refundLogisticsMoney?: number // 退还的运费金额
}
export interface IOrderProductProps
{
    productName?: string // 商品名称
    productId?: number // 商品ID
    specInfo?: string // 商品规格
    masterImg?: string // 商品图片URL
    singlePayMoney?: number // 网单单个商品商品金额
    uid?: string // 网单uid
    productNum?: string // 商品数量
}
export interface IListRefundResponseProps extends IResponseType { result?: IListRefundProps; }
//---------------------C端获取售后列表----------------------
export interface IListRefundRequestProps
{
    currentPage: number // 当前页
    pageSize: number // 页量大小
    sourceType: number // 4 APP商家，5 APP用户，6 小程序用户，7 H5用户
}
export interface IListRefundProps
{
    errorCode?: number // 错误码，0 成功
    errorMsg?: string // 错误描述
    result?: IResultProps // null
    success?: boolean // null
}
export interface IResultProps
{
    data?: Array<IDataProps> // 数据集
    totalCount?: number // 总记录数
    totalPage?: number // 总页数
}
export interface IDataProps
{
    refundSn?: string // 售后单号
    orderSn?: string // 订单号
    id?: number // 售后ID
    createTime?: number // 创建时间
    refundStatusStr?: string // 售后状态描述：如 待回寄、待收货、待审核等
    refundNumber?: number // 售后数量
    orderProduct?: IOrderProductProps // 网单信息
    refundMoney?: number // 售后金额
    refundTypeStr?: string // 售后类型描述：如仅退款、退货退款
    refundLogisticsMoney?: number // 退还的运费金额
}
export interface IOrderProductProps
{
    productName?: string // 商品名称
    productId?: number // 商品ID
    specInfo?: string // 商品规格
    masterImg?: string // 商品图片URL
    singlePayMoney?: number // 网单单个商品商品金额
    uid?: string // 网单uid
    productNum?: string // 商品数量
}
export interface IListRefundResponseProps extends IResponseType { result?: IListRefundProps; }


