/**
 * 监听用户的网络状态
 * @returns isOnline(boolean)
 */
export const useOnline = () => {
  const isOnline = ref(true);
  const onOnline = () => {
    isOnline.value = true;
  };
  const onOffline = () => {
    isOnline.value = false;
  };
  onMounted(() => {
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  });
  return { isOnline };
};
