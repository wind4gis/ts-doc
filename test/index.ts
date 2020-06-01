/*
 * @Date: 2020-5-14 23:53:08
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-5-14 23:53:08
 * @Description:
 */
import { get } from "@/utils/fetch/index";
import { ICertificationRequestProps, ICertification } from "./type";
const urls = {
  certification: "/member-auth/v2/certification"
}

export const getCertification: (ICertificationRequestProps) => Promise<ICertification> = () => get(urls.certification)
  