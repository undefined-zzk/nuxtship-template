import type { AsyncDataRequestStatus } from "#app";

export interface Data<T> {
  data: T;
  status: AsyncDataRequestStatus;
  refresh: Function;
  [key: string]: any;
}
export type Role="function" | "user" | "assistant"
export interface MessageListItem {
  role: Role,
  content: string;
  name: string;
  id: string;
  answer:string
  startLoading: boolean,
  copySuccess:boolean,
  refresh:number,
  createtime:number
}

export interface StoreObj{
  [key:string]:MessageListItem[]
}

export interface AsideDataItem {
   time:string
   origin_time:string
   title:string
   data:MessageListItem[]
}

export interface AsideData {}