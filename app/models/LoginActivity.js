/**
Sample JSON:
{
            "dateSlug": "2018-04-06",
            "dateTime": 1523001099,
            "deviceModel": "iPhone 5s",
            "os": "ios",
            "osVersion": "10.2.1",
            "lat": null,
            "lon": null
        }
*/

import moment from 'moment';

export default class LoginActivity {

  dateSlug = '';
  dateTime = 0;
  deviceModel = '';
  os = '';
  osVersion = '';
  lat = '';
  lon = '';

  formattedDateTime = '';
  formattedMonth = '';

  static objectFromJSON(json) {

    const object = new LoginActivity();

    object.dateSlug = json.dateSlug;
    object.deviceModel = json.deviceModel;
    object.dateTime = json.dateTime;
    object.os = json.os;
    object.osVersion = json.osVersion;
    object.lat = json.lat;
    object.lon = json.lat;

    object.formattedDateTime = moment.unix(json.dateTime).format('DD/MM/YYYY HH:mm:ss');
    object.formattedMonth = 'Tháng ' + moment.unix(json.dateTime).format('MM') +
                              ' năm ' + moment.unix(json.dateTime).format('YYYY');

    return object;
  }
}
