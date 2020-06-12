/*
 * @Date: 2020-6-12 13:53:37
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-12 16:37:11
 * @Description:
 */
import { IResponseType } from "@/utils/fetch/type";

//---------------------支持亿联,财务公司(薪宝和云企蕙),支付宝的提现,根据不同业务处理不同----------------------
export interface IFrontWithdrawalRequestProps {
	withDrawType?: number; // 提现端类型(1：商家，2：支付宝,3财务公司(薪宝,云企惠))
	sellerNum?: number; // 商家sellerNum（商家和薪宝提现必传,薪宝指商户流水号,唯一）
	amount?: number; // 提现金额
	bankAccountName?: string; // 开户名(亿联和薪宝公司必填,薪宝公司为代发账户名)
	bankNo?: string; // 银行账号(亿联和薪宝公司必填,薪宝公司为代发账号，云企蕙银行卡号)
	fullBankName?: string; // 开户行全称
	outBizNo?: string; // 支付商户端的唯一,订单号，对于同一笔转账请求，商户需保证该订单号唯一,必填
	identity?: string; // 支付宝收款方的唯一标识,必填
	identityType?: number; // 收款方的标识类型1.支付宝的会员ID , 2.支付宝登录号，支持邮箱和手机号格式,必填
	name?: string; // 支付宝收款方真实姓名,可选,云企蕙,必填
	cardNo?: string; // 薪宝，云企蕙提现的身份证号码(必填)
	mobile?: string; // 云企蕙银行预留手机号(必填)
	account?: string; // 云企蕙签署者(必填)
	remark?: string; // 打款备注,所有渠道可选
	userId?: number; // 用户id(除亿联提现外,必传)
}

export interface IFrontWithdrawalProps {}

export interface IFrontWithdrawalResponseProps extends IResponseType {
	result?: IFrontWithdrawalProps;
}
