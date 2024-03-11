// @flow

export default class Promotion {

  name = '';
  webviewURL = '';
  imageURL = '';
  imageGifURL = '';

  static objectFromJSON(json: {
    name: string,
    webviewURL: string,
    imageURL: string,
    imageGifURL: string
  }) {
    const object = new Promotion();

    object.name = json.name;
    object.webviewURL = json.webviewURL;
    object.imageURL = json.imageURL;
    object.imageGifURL = json.imageGifURL;

    return object;
  }

  imageURI() {
    if (!this.imageURL || this.imageURL.length === 0) {
      return this.imagePlaceholder();
    }
    return { uri: this.imageURL };
  }

  imageGifURI() {
    if (!this.imageGifURL || this.imageGifURL.length === 0) {
      return this.imagePlaceholder();
    }
    return { uri: this.imageGifURL };
  }

  imagePlaceholder() {
    return require('../img/app_icon.png');
  }
}
