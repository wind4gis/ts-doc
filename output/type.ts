import { IResponseType } from "@/utils/fetch/type";

//---------------------移动端拒收----------------------
export interface IRefuseReceiveRequestProps {
	refundSn: string; // 售后单号
	orderSn: string; // 订单号
	sourceType: number; // 4  APP商家，5  APP用户，6  小程序用户，7  H5用户
}

export interface IRefuseReceiveResponseProps extends IResponseType {
	result?: boolean;
}

//---------------------展示用户提现明细----------------------
export interface IQueryWithDrawDetailRequestProps {
	businessCode?: string; // 提现订单编号
}

export interface IQueryWithDrawDetailProps {
	amount?: number; // 提现金额 (分)
	bankAccountName?: string; // 账户名
	bankAccountNo?: string; // 银行卡号
	createTime?: number; // 创建提现时间
	fullBankName?: string; // 开户行全称（带支行）
	id?: number; // 主键id
	memberId?: number; // 用户id
	platformCode?: string; // 平台编号(1000,小程序 ;2000,探市APP; 3000,经纪公司)
	sellerNum?: string; // 商家编号
	status?: number; // 状态 0:待处理；1：已提交；3：提现成功； 4:提现失败
	successTime?: string; // 提现成功时间
	withdrawOrderSn?: string; // 提现订单编号
	withdrawType?: number; // 提现类型 1：商家，2：支付宝,3;薪宝,4:云企惠
	approveTime?: string; // 审批时间(通过或失败)
	withDrawFailReason?: string; // 提现失败原因
}

export interface IQueryWithDrawDetailResponseProps extends IResponseType {
	result?: IQueryWithDrawDetailProps;
}
