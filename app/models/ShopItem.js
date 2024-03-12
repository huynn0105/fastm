
export default class ShopItem {
  title = '';
  icon = '';
  url = '';

  static objectFromJSON(json) {
    const object = new ShopItem();

    object.title = json.title;
    object.icon = json.icon || json.image;
    object.url = json.url;

    return object;
  }

  static sampleData() {
    return {
      status: true,
      data: [
        {
          title: 'Mua thẻ cào',
          icon: 'https://is5-ssl.mzstatic.com/image/thumb/Purple124/v4/65/02/34/650234d5-4da5-a556-4a80-66063fff25bf/source/512x512bb.jpg',
          url: 'https://www.google.com/',
        },
        {
          title: 'Ri cafe',
          icon: 'https://is5-ssl.mzstatic.com/image/thumb/Purple124/v4/65/02/34/650234d5-4da5-a556-4a80-66063fff25bf/source/512x512bb.jpg',
          url: 'https://appay.vn/',
        },
        {
          title: 'Du lich',
          icon: 'https://appay.vn/wp-content/themes/twentyseventeen/images/value5.svg',
          url: '',
        },
        {
          title: 'Du lich',
          icon: 'https://appay.vn/wp-content/themes/twentyseventeen/images/value5.svg',
          url: '',
        },
        {
          title: 'Du lich',
          icon: 'https://appay.vn/wp-content/themes/twentyseventeen/images/value5.svg',
          url: '',
        },
        {
          title: 'Du lich',
          icon: 'https://appay.vn/wp-content/themes/twentyseventeen/images/value5.svg',
          url: '',
        },
        {
          title: 'vietlot',
          icon: 'https://appay.vn/wp-content/themes/twentyseventeen/images/value6.svg',
          url: 'https://play.google.com/store/apps/details?id=com.digipay.mfast&hl=en',
        },
        {
          title: 'vietlot',
          icon: 'https://appay.vn/wp-content/themes/twentyseventeen/images/value6.svg',
          url: 'https://play.google.com/store/apps/details?id=com.digipay.mfast&hl=en',
        },
        {
          title: 'vietlot',
          icon: 'https://appay.vn/wp-content/themes/twentyseventeen/images/value6.svg',
          url: 'https://play.google.com/store/apps/details?id=com.digipay.mfast&hl=en',
        },
        {
          title: 'vietlot',
          icon: 'https://appay.vn/wp-content/themes/twentyseventeen/images/value6.svg',
          url: 'https://play.google.com/store/apps/details?id=com.digipay.mfast&hl=en',
        },
        {
          title: 'vietlot',
          icon: 'https://appay.vn/wp-content/themes/twentyseventeen/images/value6.svg',
          url: 'https://play.google.com/store/apps/details?id=com.digipay.mfast&hl=en',
        },
        // {
        //   title: '',
        //   icon: '',
        //   url: '',
        // },
      ],
    };
  }
}
