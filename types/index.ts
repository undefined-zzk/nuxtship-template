import type { AsyncDataRequestStatus } from "#app";

export interface Data<T> {
  data: T;
  status: AsyncDataRequestStatus;
  refresh: Function;
  [key: string]: any;
}
