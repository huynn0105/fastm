import moment from 'moment';

export function getTimeBetween(time) {
  const date: number | undefined = time ? Number(time) : undefined;
  let string = '';
  if (time) {
    const diffDay = moment().diff(moment(date), 'day');
    if (diffDay > 3) {
      string = moment(date).format('DD/MM/YYYY');
    } else if (diffDay > 0) {
      string = `${diffDay} ngày trước`;
    } else {
      const diffHour = moment().diff(moment(date), 'hour');
      if (diffHour > 0) {
        string = `${diffHour} giờ trước`;
      } else {
        const diffMinute = moment().diff(moment(date), 'minute');
        if (diffMinute > 0) {
          string = `${diffMinute} phút trước`;
        } else {
          string = 'Vừa xong';
        }
      }
    }
  }
  return string;
}

export function getNumberDayBetween(time, isShowDay = true) {
  const date: number | undefined = time ? Number(time) : undefined;
  let string = '';
  if (time) {
    const diffDay = moment().diff(moment(date), 'day');
    if (diffDay > 0) {
      if (diffDay > 29) {
        const month = Math.floor(diffDay / 30);
        const day = Math.floor(diffDay % 30);
        string = `${
          month > 0 ? `${month} ${day > 0 && isShowDay ? 'tháng' : 'tháng trước'}` : ''
        } ${day > 0 && isShowDay ? `${day} ngày trước` : ''}`;
      } else {
        string = `${diffDay} ngày trước`;
      }
    } else {
      const diffHour = moment().diff(moment(date), 'hour');
      if (diffHour > 0) {
        string = `${diffHour} giờ trước`;
      } else {
        const diffMinute = moment().diff(moment(date), 'minute');
        if (diffMinute > 0) {
          string = `${diffMinute} phút trước`;
        } else {
          string = 'Vừa xong';
        }
      }
    }
  }
  return string;
}

export function dateToFromNowDaily(myDate) {
  const date = moment(myDate).format(moment().isSame(moment(), 'year') ? 'DD/MM' : 'DD/MM/YYYY');
  const time = moment(myDate).format('hh:mm');

  return moment(myDate).calendar(null, {
    lastDay: `[Hôm qua lúc ${time} ]`,
    sameDay: `[Hôm nay lúc ${time} ]`,
    nextDay: `[Ngày mai lúc ${time} ]`,
    lastWeek: `[Ngày ${date} lúc ${time} ]`,
    nextWeek: `[Ngày ${date} lúc ${time} ]`,
    sameElse: `[Ngày ${date} lúc ${time} ]`,
  });
}

export const secondsToHHMMSS = (secs) => {
  const secNum = parseInt(secs, 10);
  const hours = Math.floor(secNum / 3600) % 24;
  const minutes = Math.floor(secNum / 60) % 60;
  const seconds = secNum % 60;
  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? `0${v}` : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
};
