import moment from 'moment';

export const getToday = ({ format } = { format: 'DD/MM/YYYY ' }) => {
  return moment().format(format);
};

export const getWeekdayName = () => {
  const _weekday = moment().weekday();
  return _weekday >= 7 ? 'Chủ nhật' : `Thứ ${_weekday + 1}`;
};

export const getCountDownString = (countdown) => {
  var days = Math.floor(countdown / 24 / 60 / 60);
  var hoursLeft = Math.floor(countdown - days * 86400);
  var hours = Math.floor(hoursLeft / 3600);
  var minutesLeft = Math.floor(hoursLeft - hours * 3600);
  var minutes = Math.floor(minutesLeft / 60);
  var remainingSeconds = countdown % 60;

  function pad(n) {
    return n < 10 ? `0${n}` : n;
  }

  const result = [
    days > 0 ? `${pad(days)} ngày` : '',
    hours > 0 ? `${pad(hours)} giờ` : '',
    minutes > 0 ? `${pad(minutes)} phút` : '',
    pad(remainingSeconds) + ' giây',
  ].filter((e) => !(e.trim().length === 0));

  return result.join(' ');
};

export const isValidBetween = (start, end) => {
  const startTime = start ? moment(start, 'YYYY/MM/DD HH:mm:sss') : null;
  const endTime = end ? moment(end, 'YYYY/MM/DD HH:mm:sss') : null;
  return moment().isBetween(startTime, endTime);
};

export const getRemainSeconds = (dt) => {
  return Number(`${moment(dt).diff(moment(), 'second')}`) || 0;
};
