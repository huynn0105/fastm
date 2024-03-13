import _ from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import { IMAGE_PATH } from '../../assets/path';
import { FeedbackItem } from '../../components/FeedbackItem';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import { updateTimeAgoString } from '../../utils/Utils';

const EmptyListFeedback = ({}) => (
  <View
    style={{
      flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SW(31.5),
      marginTop: SH(45),
    }}
  >
    <Image
      source={IMAGE_PATH.osSupportEmptyBanner}
      style={{ width: SW(160), height: SH(121), resizeMode: 'contain' }}
    />
    <AppText style={{ marginTop: SH(14), fontSize: SH(14), lineHeight: SH(20), color: '#777' }}>
      {'Hiện tại chưa có yêu cầu hỗ trợ nào'}
    </AppText>
    <AppText
      style={{
        marginTop: SH(36),
        fontSize: SH(14),
        lineHeight: SH(20),
        color: '#777',
        textAlign: 'center',
      }}
    >
      {`Nếu có bất kỳ câu hỏi, bấm tạo yêu cầu \nMFast sẽ sớm phản hồi thắc mắc của bạn tại đây`}
    </AppText>
  </View>
);

export class ListFeedback extends React.Component {
  // workaround for pulling footer after load more
  loadingMore = false;

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onAllFeedbackRefresh = () => {
    this.props.onListFeedbackRefresh();
  };

  onLoadMorePress = () => {
    this.props.onLoadMorePress(this.props.type);
    this.loadingMore = true;
    setTimeout(() => {
      this.loadingMore = false;
    }, 500);
  };

  renderFeedbackItem = ({ item, index }) => {
    const { onFeedbackItemPress, myUser } = this.props;

    const timeAgoString = `Tạo ${updateTimeAgoString(item.created * 1000)}`;
    const createdDate = updateTimeAgoString(item.lastMessage_date * 1000);
    const replyBy = `Bởi : ${item?.poster?.length > 0 ? item.poster : myUser?.fullName}`;
    const subTitle = item?.selectedFeedbackDetails?.length ? item?.selectedFeedbackDetails : '';

    return (
      <FeedbackItem
        containerStyle={{ marginTop: index === 0 ? 0 : SH(16) }}
        title={item.ticket_object}
        subTitle={subTitle}
        replyLabel={item.numberOfReplies}
        description={item.lastMessage}
        poster={replyBy}
        createdDate={createdDate}
        onPress={() => {
          onFeedbackItemPress(item, index);
        }}
        iconPath={item?.iconPath}
      />
    );
  };

  renderFooter = () => {
    const { feedbacks, isRefreshing } = this.props;

    if (feedbacks.length === 0 || feedbacks.length % 10 !== 0) {
      return (
        <View style={{ height: 64, justifyContent: 'center', alignItems: 'center' }}>
          {!isRefreshing ? (
            <AppText style={{ color: '#888' }}>{'Đã tải tất cả phản hồi'}</AppText>
          ) : null}
        </View>
      );
    }

    return (
      <View style={{ height: 64, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'center' }}
          hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
          onPress={this.onLoadMorePress}
        >
          {isRefreshing ? (
            <ActivityIndicator color={Colors.primary2} animating />
          ) : (
            <AppText style={{ color: Colors.primary2 }}>{'Tải thêm'}</AppText>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  renderActionButton = () => {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => this.props.onPressCreateRequest()}
      >
        <ImageBackground source={IMAGE_PATH.backgroundButtonTicket} style={{ marginRight: SW(6) }}>
          <AppText
            medium
            style={{
              fontSize: SH(14),
              lineHeight: SH(16),
              color: Colors.primary5,
              paddingLeft: SW(12),
              paddingRight: SW(16),
              paddingVertical: SH(8),
            }}
          >
            Tạo yêu cầu hỗ trợ
          </AppText>
        </ImageBackground>
        <Image
          style={{ width: SW(52), height: SH(52), resizeMode: 'contain' }}
          source={IMAGE_PATH.actionButton}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { feedbacks, isRefreshing } = this.props;

    const dumbFeedback = feedbacks;

    const _feedbacks = dumbFeedback.map((item) => {
      return {
        ...item,
        iconPath:
          item?.ticket_object === 'Kiến thức nghiệp vụ'
            ? `ICON_1`
            : item?.ticket_object === 'Hỗ trợ đối soát, thanh toán thu nhập'
            ? `ICON_2`
            : item?.ticket_object === 'Hỗ trợ cấp code, công cụ làm việc'
            ? `ICON_3`
            : `ICON_DEFAULT`,
      };
    });

    return (
      <View style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        {!_.isEmpty(feedbacks) || isRefreshing ? (
          <FlatList
            data={_feedbacks}
            renderItem={this.renderFeedbackItem}
            keyExtractor={(item) => item.ticket_id}
            refreshControl={
              <RefreshControl
                style={{ backgroundColor: 'trasparent' }}
                refreshing={isRefreshing && !this.loadingMore}
                onRefresh={this.onAllFeedbackRefresh}
                tintColor={Colors.neutral4}
              />
            }
            ListFooterComponent={this.renderFooter}
            style={{ paddingHorizontal: SW(16) }}
          />
        ) : (
          // this.renderActionButton()
          <EmptyListFeedback onPressCreateRequest={this.props.onPressCreateRequest} />
        )}
        <View style={{ position: 'absolute', right: SW(16), bottom: SH(46) }}>
          {this.renderActionButton()}
        </View>
      </View>
    );
  }
}

export default ListFeedback;
