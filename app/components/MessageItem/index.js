import _ from 'lodash';
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListImageMessage } from './ListImageMessage';
import { MyMessage } from './MyMessage';
import { SenderMessage } from './SenderMessage';

export const MESSAGE_TYPE = {
  MY_MESSAGE: 'M',
  REPLY_MESSAGE: 'R',
};

class ListMessageItem extends PureComponent {
  renderMessageItem = ({ item, index }) => {
    const { messages } = this.props;

    const prevMessage = index > 0 ? messages[index - 1] : {};
    const showTitle = !prevMessage || prevMessage.type !== item.type;

    switch (item.type) {
      case MESSAGE_TYPE.MY_MESSAGE: {
        return (
          <View>
            {/* {index === 0 && (
              <MyMessage showTitle title={item.createdTimeString} message={item.topic} />
            )} */}
            <MyMessage
              showTitle={showTitle}
              title={item.createdTimeString}
              message={item.message}
            />
            {!_.isEmpty(item.path) ? (
              <ListImageMessage
                alignItems="right"
                listImage={item.path}
                onImagePress={this.props.onImagePress}
              />
            ) : null}
          </View>
        );
      }
      case MESSAGE_TYPE.REPLY_MESSAGE:
        const { isSupportMessage, message } = this.props;
        const messageReview =
          '<p style="font-size:11px;">Để chúng tôi hỗ trợ bạn được tốt hơn, vui lòng dành 1 phút đánh giá về chất lượng hỗ trợ của đội ngũ MFast tại đây: <a style="font-size:10px;" href="https://docs.google.com/forms/d/e/1FAIpQLScFweITCFy9vHAQQj2VgGrr2lA-kQoxZlj5ZtYkZU2-pj-Waw/viewform">Bấm vào đây để đánh giá </a></p>';

        return (
          <View>
            <SenderMessage
              title={item.topic}
              message={`${item.message}${isSupportMessage ? messageReview : ''}`}
            />
            {!_.isEmpty(item.path) ? (
              <ListImageMessage
                style={{ marginLeft: 32 }}
                alignItems="left"
                listImage={item.path}
                onImagePress={this.props.onImagePress}
              />
            ) : null}
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
