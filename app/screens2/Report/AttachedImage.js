import React, { Component } from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import Strings from '../../constants/strings';
import ImageUtils from '../../utils/ImageUtils';
import { showInfoAlert, showAlertForRequestPermission } from '../../utils/UIUtils';

const ADD_ITEM = 'ADD';
const MAX_IMAGE = 6;

const ERR = {
  PERMISSION: 'PERMISSION',
  OVER_MAX: 'OVER_MAX',
};

class AttachedImage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageList: [],
    };
  }

  onAddImagePress = async () => {
    try {
      const imageURIs = await ImageUtils.pickImage('photo', '', true, 'photo');
      if (imageURIs === false) throw ERR.PERMISSION;
      this.addAttachedImages(imageURIs);
    }
    catch (err) { this.displayError(err); }
  }

  onRemoveImagePress(index) {
    const remaindingImage = this.state.imageList;
    remaindingImage.splice(index, 1);
    this.setState({
      imageList: [...remaindingImage],
    });
    this.didAttachedImageChanged();
  }

  getAttachedData() {
    let data = this.state.imageList; 
    if (data.length < MAX_IMAGE) { data = [...data, ADD_ITEM]; }
    return data;
  }

  displayError(err = ERR.PERMISSION) {
    if (err === ERR.PERMISSION) {
      showAlertForRequestPermission(Platform.OS === 'ios' ?
        Strings.camera_access_error :
        Strings.camera_access_error_android);
    }
    else if (err === ERR.OVER_MAX) {
      showInfoAlert('Đính kèm tối đa 6 hình');
    }
  }

  didAttachedImageChanged() {
    if (this.props.attachedImageChanged) {
      this.props.attachedImageChanged(this.state.imageList);
    }
  }

  addAttachedImages(imageURIs) {
    const remaindingCanAdd = MAX_IMAGE - this.state.imageList.length;
    this.setState({
      imageList: this.state.imageList.concat(imageURIs.slice(0, remaindingCanAdd)),
    });
    this.didAttachedImageChanged();
    if (remaindingCanAdd < imageURIs.length) {
      throw ERR.OVER_MAX;
    }
  }

  renderRemoveIcon() {
    return (
      <View
        style={{
          flex: 0,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          right: 0,
          top: 0,
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: '#fff',
        }}
      >
        <Icon
          style={{
            backgroundColor: '#0000',
          }}
          name="md-close-circle"
          size={18}
          color="#0099E0"
          backgroundColor="#0000"
        />
      </View>
    );
  }

  renderAddItem() {
    return (
      <View style={{
        marginLeft: 12,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <TouchableOpacity onPress={this.onAddImagePress}>
          <Image
            style={{ width: 50, height: 50, marginTop: 8, marginRight: 8 }}
            source={require('./img/add.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderImageItem(item, index) {
    return (
      <View style={{
        marginLeft: 12,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <TouchableOpacity onPress={() => { this.onRemoveImagePress(index); }}>
          <Image
            style={{ width: 50, height: 50, marginTop: 8, marginRight: 8 }}
            source={{ uri: item.uri }}
          />
          {this.renderRemoveIcon()}
        </TouchableOpacity>
      </View>
    );
  }

  renderItem(item, index) {
    return (
      item === ADD_ITEM ?
        this.renderAddItem()
        : this.renderImageItem(item, index)
    );
  }

  renderImageList() {
    const data = this.getAttachedData();
    return (
      <FlatList
        data={data}
        keyExtractor={item => item.uid}
        renderItem={(row) => {
          return this.renderItem(row.item, row.index);
        }}
        horizontal
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, height: 70, backgroundColor: '#fff' }}>
        {this.renderImageList()}
      </View>
    );
  }
}

export default AttachedImage;
