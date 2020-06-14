import { IResponseType } from "@/utils/fetch/type";

//---------------------C端获取售后列表----------------------
export interface IListRefundRequestProps {
	currentPage: number; // 当前页
	pageSize: number; // 页量大小
	sourceType: number; // 4 APP商家，5 APP用户，6 小程序用户，7 H5用户
}

export interface IListRefundProps {
	data?: Array<IListRefundDataProps>; // 数据集
	totalCount?: number; // 总记录数
	totalPage?: number; // 总页数
}

export interface IListRefundDataProps {
	refundSn?: string; // 售后单号
	orderSn?: string; // 订单号
	id?: number; // 售后ID
	createTime?: number; // 创建时间
	refundStatusStr?: string; // 售后状态描述：如 待回寄、待收货、待审核等
	refundNumber?: number; // 售后数量
	orderProduct?: IListRefundOrderProductProps; // 网单信息
	refundMoney?: number; // 售后金额
	refundTypeStr?: string; // 售后类型描述：如仅退款、退货退款
	refundLogisticsMoney?: number; // 退还的运费金额
}

export interface IListRefundOrderProductProps {
	productName?: string; // 商品名称
	productId?: number; // 商品ID
	specInfo?: string; // 商品规格
	masterImg?: string; // 商品图片URL
	singlePayMoney?: number; // 网单单个商品商品金额
	uid?: string; // 网单uid
	productNum?: string; // 商品数量
}

export interface IListRefundResponseProps extends IResponseType {
	result?: IListRefundProps;
}
