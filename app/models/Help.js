// @flow

// {
//   imageURL: "",                     // icon
//   title: "",                          // "tiện ích"
//   items: [                          // hiện có 2 items: CHECK-IN, LIÊN HỆ HOTLINE
//      {
//         type: "WEB",                // "WEB": mở webview, "SIP": call sip
//         imageURL: "",
//         title: "",                        // CHECK-IN, LIÊN HỆ HOTLINE
//         webviewURL: ""           // WEB: link webview, SIP: địa chỉ supoprt, hiện tại: 0899909789@voice.digitel.vn
//      },
//   ]
// }

export default class Help {

  title = '';
  imageURL = '';
  items = [];

  static objectFromJSON(json: {
    webviewURL: string,
    imageURL: string,
    items: Array,
  }) {
    const object = new Help();

    object.title = json.title;
    object.imageURL = json.imageURL;
    object.items = json.items || [];

    return object;
  }

  imageURI() {
    if (!this.imageURL || this.imageURL.length === 0) {
      return this.imagePlaceholder();
    }
    return { uri: this.imageURL };
  }

  imagePlaceholder() {
    return require('../img/app_icon.png');
  }

  static sampleData() {
    return JSON.parse(`{ 
      "status": true,
      "data": {
        "imageURL": "http://digitel.com.vn/wp-content/themes/digitel/images/khachhang2.png",                
        "title": "TIỆN ÍCH",                        
        "items": [                         
           {
              "type": "SIP",               
              "imageURL": "https://appay.vn/wp-content/themes/twentyseventeen/images/value2.svg",
              "title": "LIÊN HỆ TỔNG ĐÀI",                       
              "webviewURL": "0899909789"          
           },
           {
            "type": "WEB",               
            "imageURL": "http://digitel.com.vn/wp-content/themes/digitel/images/khachhang2.png",
            "title": "CHECK-IN",                       
            "webviewURL": "http://digitel.com.vn/"          
         }
        ]
      }
    }`);
  }
  static sampleDataEmpty() {
    return JSON.parse(`{ 
      "status": true,
      "data": {
        "imageURL": "http://digitel.com.vn/wp-content/themes/digitel/images/khachhang2.png",                
        "title": "TIỆN ÍCH",                        
        "items": [                         
           
        ]
      }
    }`);
  }
  static sampleDataFail() {
    return JSON.parse(`{ 
      "status": false,
      "data": {
        "imageURL": "http://digitel.com.vn/wp-content/themes/digitel/images/khachhang2.png",                
        "title": "TIỆN ÍCH",                        
        "items": [                         
           
        ]
      }
    }`);
  }
}
