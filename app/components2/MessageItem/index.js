import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import _ from 'lodash';

import { MyMessage } from './MyMessage';
import { SenderMessage } from './SenderMessage';
import { ListImageMessage } from './ListImageMessage';

const MESSAGE_TYPE = {
  MY_MESSAGE: 'M',
  REPLY_MESSAGE: 'R',
};

class ListMessageItem extends PureComponent {
  renderMessageItem = ({ item, index }) => {
    switch (item.type) {
      case MESSAGE_TYPE.MY_MESSAGE: {
        return (
          <View>
            {index === 0 && (
              <MyMessage showTitle title={item.createdTimeString} message={item.topic} />
            )}
            <MyMessage message={item.message} />
            {!_.isEmpty(item.path) ? (
              <ListImageMessage alignItems="right" listImage={item.path} />
            ) : null}
          </View>
        );
      }
      case MESSAGE_TYPE.REPLY_MESSAGE:
        return (
          <View>
            <SenderMessage title={item.topic} message={item.message} />
            {!_.isEmpty(item.path) && <ListImageMessage alignItems="left" listImage={item.path} />}
          </View>
        );
      default:
        return null;
    }
  };

  render() {
    const { messages } = this.props;
    return (
      <View>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.threadID}
          renderItem={this.renderMessageItem}
        />
      </View>
    );
  }
}

export default ListMessageItem;
