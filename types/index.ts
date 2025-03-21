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
}
