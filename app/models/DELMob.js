// {
//   title: 'Chỉ số DEL30 MOB4:',
//   detail: 'Cập nhật cuối - 26/03/2019',
//   icon: image_url,
//   del30: '10',
//   del30_color: '#bc0f23',
//   url: webview_url
// }

export default class DELMob {

  title = '';
  detail = '';
  icon = '';
  del30 = '';
  del30Color = '';
  url = '';

  static objectFromJSON(json) {
    const object = new DELMob();

    object.title = json.title;
    object.detail = json.detail;
    object.icon = json.icon;
    object.del30 = json.del30;
    object.del30Detail = json.del30Detail;
    object.del30Color = json.del30Color || '#bc0f23';
    object.url = json.url;
    object.webviewTitle = json.webview_title;
    return object;
  }

  static fakeData() {
    const item = new DELMob();
    item.title = 'Chỉ số DEL30 MOB4:';
    item.detail = 'Cập nhật cuối - 26/03/2019';
    item.icon = 'https://appay-rc.cloudcms.vn/assets/img/contests/predsa.png';
    item.del30 = '100 HS';
    item.del30Color = '#bc0f23';
    item.url = 'https://appay-rc.cloudcms.vn';
    item.webviewTitle = 'https://appay-rc.cloudcms.vn';
    return item;
  }
}
