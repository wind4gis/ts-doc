/*
 * @Date: 2020-5-14 23:53:08
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-5-14 23:53:08
 * @Description:
 */
interface ICertificationRequestProps {

}


interface ICertification {
  idCardNum: string; // 身份证号码
  name: string; // 身份证对应的姓名
  expireTime: string; // 过期时间
  frontImage: string; // 身份证正面图
  backImage: string; // 身份证反面图
  status: number; // 状态0 实名认证已经失效1 通过身份证实名认证
}
  