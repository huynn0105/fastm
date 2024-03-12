
// @flow

/**
Sample JSON:
{
            "name": "Dành cho POS",
            "webviewURL": "https://appay-rc.cloudcms.vn/contest/predsa",
            "imageURL": "https://appay-rc.cloudcms.vn/assets/img/contests/predsa.png predsa.png" 
        }
*/

export default class Contest {

  title = '';
  imageURL = '';
  items = [];

  static objectFromJSON(json: {
    webviewURL: string,
    imageURL: string,
    items: Array,
  }) {
    const object = new Contest();

    object.title = json.title;
    object.imageURL = json.imageURL;
    object.items = json.items || [];

    return object;
  }


  static sampleData() {
    return JSON.parse(`{ 
      "status": true,
      "data": {
        "imageURL": "http://digitel.com.vn/wp-content/themes/digitel/images/khachhang2.png",                
        "title": "THI ĐẤU",                        
        "items": [                         
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
      "data": {}
    }`);
  }
  static sampleDataFalse() {
    return JSON.parse(`{ 
      "status": false,
      "data": {}
    }`);
  }
}
