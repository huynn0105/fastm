/**
Sample JSON:

            "ackID": "19",
            "ackTitle": "Slide 1",
            "ackDescription": "Test",
            "ackURL": "https://google.com",
            "ackImage": "https://appay-rc.cloudcms.vn/data/acknowledgement/image/19_20180423183114.jpeg",
            "createdDate": 1524483074,
            "sortPosition": "0",
            "isHighlight": "0"
*/

export default class NewsSlide {

  static objectFromJSON(json) {
    const object = new NewsSlide();
    object.ackID = json.ackID;
    object.ackTitle = json.ackTitle;
    object.ackDescription = json.ackDescription;
    object.ackURL = json.ackURL;
    object.ackImage = json.ackImage;
    object.sortPosition = json.sortPosition;
    object.isHighlight = json.isHighlight;

    object.createTime = json.createdDate;

    return object;
  }

  imageURI() {
    if (!this.ackImage || this.ackImage.length === 0) {
      return this.imagePlaceholder();
    }
    return { uri: this.ackImage };
  }

  imagePlaceholder() {
    return require('../img/placeholder.jpg');
  }

  detailURL() {
    return this.ackURL;
  }
}
