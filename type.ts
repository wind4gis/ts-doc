/*
 * @Date: 2020-5-9 11:49:53
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-5-9 11:49:53
 * @Description:
 */
interface IGetRefundProgressRequestProps {
  refundSn: string; // 售后单号
  orderSn: string; // 订单号
  sourceType: number; // 4 APP商家， 5 APP用户， 6 小程序用户， 7 H5用户
}


interface IGetRefundProgress {
  errorCode?: number; // 错误码，0 成功
  errorMsg?: string; // 错误描述
  success?: boolean; // true表示getResult--》不为空,如果为false,则调用errorCode/errorMsg来获取出错信息
  result?: IGetRefundProgressResult; // 
  }

interface IGetRefundProgressResult {
  orderSn?: string; // 订单号
  refundSn?: string; // 售后单号
  refundProgressList?: Array<IGetRefundProgressRefundProgressList> []; // 操作内容列表
  actionLayoutList?: Array<IGetRefundProgressActionLayoutList> []; // 动作按钮布局列表
  sellerId?: number; // 商家ID
  }

interface IGetRefundProgressActionLayoutList {
  code?: number; // 操作编号：200 撤销申请，201 拒收商品，202 寄回商品，203 订单详情，204 联系平台客服，205 复制地址，
  value?: string; // 按钮展示文本，如撤销申请 等
  title?: string; // 按钮的标题
  tips?: string; // 温馨提示语
  msg?: string; // 点击时弹出框提示语
  }

interface IGetRefundProgressRefundProgressList {
  refundFrontStatusStr?: string; // 售后前端状态描述，如买家发起退货退款，待买家寄回商品 等
  refundFrontExplain?: string; // 售后前端说明文案，如请将全套商品寄回一下地址 等
  operateTime?: number; // 操作时间
  contentList?: Array<IGetRefundProgressContentList> []; // 操作内容列表
  }

interface IGetRefundProgressContentList {
  type?: string; // text 文本类型， image 图片类型
  label?: string; // 标签，如“说明：”、“原因：”等，可能为空字符串
  content?: string; // 具体内容，当type=image 时，多张图片以英文半角逗号分隔
  }
  