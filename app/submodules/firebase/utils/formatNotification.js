import moment from 'moment';

export const formatNotification = (data: any[]) => {
  if (!data?.length) {
    return [];
  }
  return data?.map((item, index) => {
    const prevItem = data?.[index - 1];
    const today = moment(item?.createTime * 1000).format('DD/MM/YYYY');
    const prevDay = moment(prevItem?.createTime * 1000).format('DD/MM/YYYY');

    const isFirstDay = !!(today !== prevDay || !prevItem);

    if (isFirstDay && item?.isFirstDay !== isFirstDay) {
      return {
        ...item,
        isFirstDay,
      };
    }
    return item;
  });
};
