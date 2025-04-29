import { nanoid } from "nanoid";
import type { MessageListItem, StoreObj } from "~/types";
import LZString from "lz-string";
/**
 * 检查存储空间 和 已使用空间
 * @returns {useage:已使用,maxSpace:最大空间,percent:已使用百分比,isFull:是否已满}
 */
export const checkStore = () => {
  let useage = 0;
  const maxSpace = 4.5 * 1024 * 1024;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key);
      useage += key.length + value!.length; // 计算键和值的总长度
    }
  }
  return {
    useage, // 已使用
    maxSpace, // 最大空间
    percent: +((useage / maxSpace) * 100).toFixed(2), // 已使用百分比
    isFull: useage >= maxSpace, // 是否已满 留0.5M空间
  };
};

/**
 * 获取nanoid
 * @returns nanoid
 */
export const getNanoid = () => nanoid();

/**
 *
 * @returns 是否为火狐 boolean
 */
export const isFirefox = () => {
  return (
    navigator.userAgent.includes("Firefox") ||
    navigator.userAgent.includes("Gecko/")
  );
};

/**
 *
 * @returns 是否是IE boolean
 */
export const isIE = () => {
  return (
    navigator.userAgent.includes("MSIE") ||
    navigator.userAgent.includes("Trident/")
  );
};

/**
 *  存储时压缩 HTML 内容
 */
export const compressedArr = (arr: MessageListItem[]) => {
  return arr.map((item) => ({
    ...item,
    lzstring: item.answer.length > 500,
    answer:
      item.answer.length > 500
        ? isFirefox() || isIE()
          ? LZString.compressToUTF16(item.answer)
          : LZString.compress(item.answer)
        : item.answer,
  }));
};
/**
 * 恢复压缩
 */
export const uncompressedArr = (arr: MessageListItem[]) => {
  return arr.map((item) => {
    let decompressed = item.answer;
    if (item.lzstring) {
      try {
        decompressed =
          isFirefox() || isIE()
            ? LZString.decompressFromUTF16(item.answer)
            : LZString.decompress(item.answer);
        // 如果解压失败则保持原样
        if (decompressed === null) decompressed = item.answer;
      } catch (e) {
        console.log("err", e);
        decompressed = item.answer;
      }
    }
    return {
      ...item,
      answer: decompressed,
    };
  });
};

/**
 * 存储数据
 * @param key
 * @param value
 */
const STORAGE_KEY = "skunk";
export const setStorage = (currentKey: string, value: MessageListItem[]) => {
  const obj = getStorage();
  for (const key in obj) {
    if (key === currentKey) continue;
    obj[key] = compressedArr(obj[key]);
  }
  obj[currentKey] = compressedArr(value);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
};

/**
 * 获取数据
 * @param key
 * @returns Array<MessageListItem>
 */
export const getStorage = (): StoreObj => {
  const obj: StoreObj = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  for (const key in obj) {
    if (!Array.isArray(obj[key])) {
      obj[key] = [];
    } else {
      obj[key] = uncompressedArr(obj[key]);
    }
  }
  return obj;
};

/**
 * 删除数据
 * @param key
 */
export const removeStorage = (
  currentKey: string,
  endIndex: number = 0,
  all: boolean = false
) => {
  const obj = getStorage();
  if (all) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  if (endIndex <= 0) {
    delete obj[currentKey];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } else {
    obj[currentKey].splice(0, endIndex);
    setStorage(currentKey, obj[currentKey]);
  }
};

/**
 * 转换为纯文本
 * @param str
 * @returns
 */
export const domParserText = (str: string) => {
  return (
    new DOMParser().parseFromString(str, "text/html").body.textContent || ""
  );
};

export const copyToClipboard = (str: string) => {
  return new Promise((resolve) => {
    // 转换为纯文本 去除html标签
    const text = domParserText(str);
    // 检查是否支持 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // 使用 Clipboard API
      navigator.clipboard
        .writeText(text)
        .then(function () {
          ElMessage.success("复制成功");
        })
        .catch(function (err) {
          ElMessage.error(`复制失败,${err}`);
        })
        .finally(() => {
          resolve(true);
        });
    } else {
      // 使用旧的 execCommand 方法作为回退
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // 防止页面滚动
      document.body.appendChild(textarea);
      textarea.select();
      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "复制成功" : "复制失败";
        ElMessage.success(msg);
      } catch (err) {
        ElMessage.error(`复制失败!,${err}`);
      } finally {
        document.body.removeChild(textarea);
        resolve(true);
      }
    }
  });
};

/**
 * 获取年月日时分秒
 * @param time
 * @returns
 */
export const getDateTime = (time: number | string = Date.now()) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return {
    fulltime: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
    datetime: `${year}-${month}-${day}`,
    year,
    month,
    day,
    hour,
    minute,
    second,
  };
};

export const getTimeFromNow = (time: string | number) => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  if (years > 0) {
    return `${years}年前`; // 1年前
  } else if (months > 0) {
    return `${months}月前`; // 1月前  11月前
  } else if (days < 1) {
    return `今天`;
  } else if (days < 2) {
    return `昨天`;
  } else if (days < 7) {
    return `${days}天前`; // 1天前
  } else if (days >= 7) {
    return `7天前`; // 1天前  11天前
  } else {
    return getDateTime(time).datetime;
  }
};
/**
 * 发送消息前判断当前缓存的日期是否是今天
 * @param time
 * @returns true
 */

const DIALOGKEY = "shunk-dialog-key";
/**
 * 缓存当前对话key
 * @param key
 */
export const setDialogKey = (value: string = getDateTime().fulltime) => {
  localStorage.setItem(DIALOGKEY, value);
};

/**
 * 获取当前对话key
 * @returns
 */
export const getDialogKey = () => {
  return localStorage.getItem(DIALOGKEY) || getDateTime().fulltime;
};
/**
 * 删除当前对话key
 */
export const removeDialogKey = () => {
  localStorage.removeItem(DIALOGKEY);
};

export const isToday = () => {
  const time = getDialogKey();
  const date = new Date(time);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

// 设置是否需要进行指引
export const setGuide = (value: boolean) => {
  localStorage.setItem("guide", JSON.stringify(value));
};
// 获取是否需要进行指引
export const getGuide = () => {
  return JSON.parse(localStorage.getItem("guide") || "true");
};
