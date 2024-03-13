import React, { PureComponent } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SenderMessage } from '../../components/MessageItem/SenderMessage';
import RoundedTagButton from '../../components/RoundedTagButton';
import Colors from '../../theme/Color';
import { SCREEN_WIDTH } from '../../utils/Utils';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import { ICON_PATH } from '../../assets/path';
import moment, { now } from 'moment';
export class WelcomeFeedback extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clientMessageLocal: this.props.clientMessageLocal || '',
      mFastMessageLocal: this.props.mFastMessageLocal || '',
      timeStartStep2: '',
      showStep2ItemNoDesc: false,
    };
  }
  renderTopicsDetail = (topic, time) => {
    const listDescription = topic?.description.split('-');
    const _listDescription = listDescription?.filter((desc) => desc !== '');
    if (!topic) {
      return;
    }
    if (_listDescription?.length === 0) {
      // () => {
      // this.props.onStartFeedback(topic?.topic_name?.replace(/(\r\n|\n|\r|\\n)/gm, ''));
      // };
      return (
        <View style={{ marginTop: SH(12) }}>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText style={{ color: Colors.gray3, fontSize: SH(12), lineHeight: SH(14) }}>
              {time}
            </AppText>
            <View
              style={{
                backgroundColor: Colors.primary2,
                borderRadius: 16,
                paddingHorizontal: SW(12),
                paddingVertical: SH(10),
                marginTop: SH(4),
              }}
            >
              <AppText
                style={{ color: Colors.primary5, fontSize: SH(13), lineHeight: SH(18) }}
              >{`${topic?.topic_name}`}</AppText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', width: '80%' }}>
            <SenderMessage />
            <View
              style={{
                marginTop: SH(12),
              }}
            >
              <View style={{}}>
                <View style={{ marginBottom: SH(4) }}>
                  <AppText style={{ color: Colors.gray3, fontSize: SH(12), lineHeight: SH(14) }}>
                    {time}
                  </AppText>
                </View>
                <View
                  style={{
                    backgroundColor: Colors.primary5,
                    borderRadius: 16,
                    borderTopLeftRadius: 0,
                  }}
                >
                  <View style={{ paddingHorizontal: SW(12), paddingVertical: SH(10) }}>
                    <View
                      style={
                        {
                          // paddingBottom: SH(8),
                        }
                      }
                    >
                      <AppText
                        style={{ fontSize: SH(13), lineHeight: SH(18), color: Colors.gray1 }}
                      >
                        Vui lòng nhập nội dung về vấn đề mà bạn cần hỗ trợ
                      </AppText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          marginTop: SH(12),
          borderRadius: 16,
        }}
      >
        <View style={{ alignItems: 'flex-end' }}>
          <AppText style={{ color: Colors.gray3, fontSize: SH(12), lineHeight: SH(14) }}>
            {time}
          </AppText>
          <View
            style={{
              backgroundColor: Colors.primary2,
              borderRadius: 16,
              paddingHorizontal: SW(12),
              paddingVertical: SH(10),
              marginTop: SH(4),
            }}
          >
            <AppText
              style={{ color: Colors.primary5, fontSize: SH(13), lineHeight: SH(18) }}
            >{`${topic?.topic_name}`}</AppText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '80%' }}>
          <SenderMessage />
          <View
            style={{
              marginTop: SH(12),
            }}
          >
            <View style={{}}>
              <View style={{ marginBottom: SH(4) }}>
                <AppText style={{ color: Colors.gray3, fontSize: SH(12), lineHeight: SH(14) }}>
                  {time}
                </AppText>
              </View>
              <View
                style={{
                  backgroundColor: Colors.primary5,
                  borderRadius: 16,
                  borderTopLeftRadius: 0,
                }}
              >
                <View style={{ paddingHorizontal: SW(12), paddingVertical: SH(10) }}>
                  <View
                    style={{
                      borderBottomColor: Colors.actionBackground,
                      borderBottomWidth: 1,
                      paddingBottom: SH(8),
                    }}
                  >
                    <AppText
                      style={{ fontSize: SH(13), lineHeight: SH(18), color: Colors.gray2 }}
                    >{`Chọn chủ đề liên quan đến - ${topic?.topic_name}`}</AppText>
                  </View>
                  {_listDescription?.length > 0
                    ? _listDescription?.map((desc, index) => {
                        return (
                          <View>
                            <TouchableOpacity
                              disabled={this.props.disableSelect}
                              style={{
                                paddingTop: SH(12),
                                paddingBottom: SH(2),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                              onPress={() => {
                                this.setState(
                                  {
                                    clientMessageLocal: desc?.replace(/(\r\n|\n|\r|\\n)/gm, ''),
                                    mFastMessageLocal:
                                      'Vui lòng nhập nội dung về vấn đề mà bạn cần hỗ trợ',
                                    timeStartStep2: moment().format('hh:mm a'),
                                    showStep2ItemNoDesc: false,
                                  },
                                  () => {
                                    this.props.onStartFeedback(
                                      desc?.replace(/(\r\n|\n|\r|\\n)/gm, ''),
                                    );
                                  },
                                );
                              }}
                            >
                              <AppText
                                style={{
                                  color: Colors.gray1,
                                  fontSize: SH(13),
                                  lineHeight: SH(16),
                                  paddingRight: SW(6),
                                }}
                              >
                                {desc?.replace(/(\r\n|\n|\r|\\n)/gm, '').trim()}
                              </AppText>
                              <Image
                                source={ICON_PATH.arrow_right}
                                style={{
                                  width: SW(18),
                                  height: SH(18),
                                  resizeMode: 'contain',
                                }}
                              />
                            </TouchableOpacity>
                            {index < _listDescription?.length - 1 ? (
                              <View
                                style={{
                                  height: 1,
                                  backgroundColor: Colors.actionBackground,
                                  width: '100%',
                                  // marginHorizontal: SW(12),
                                }}
                              ></View>
                            ) : null}
                          </View>
                        );
                      })
                    : null}
                </View>
              </View>
            </View>
          </View>
        </View>
        {this.state.clientMessageLocal.length > 0 ? this.renderClientLocalStep2() : null}
        {this.state.mFastMessageLocal.length > 0 ? this.renderMFastLocalMessageStep2() : null}
      </View>
    );
  };

  renderClientLocalStep2 = () => {
    const { clientMessageLocal } = this.state;
    return (
      <View style={{ alignItems: 'flex-end', marginTop: SH(12) }}>
        <AppText style={{ color: Colors.gray3, fontSize: SH(12), lineHeight: SH(14) }}>
          {this.state.timeStartStep2}
        </AppText>
        <View
          style={{
            backgroundColor: Colors.primary2,
            borderRadius: 16,
            paddingHorizontal: SW(12),
            paddingVertical: SH(10),
            marginTop: SH(4),
          }}
        >
          <AppText
            style={{ color: Colors.primary5, fontSize: SH(13), lineHeight: SH(18) }}
          >{`${clientMessageLocal}`}</AppText>
        </View>
      </View>
    );
  };

  renderMFastLocalMessageStep2 = () => {
    return (
      <View style={{ flexDirection: 'row', width: '80%' }}>
        <SenderMessage />
        <View
          style={{
            marginTop: SH(12),
          }}
        >
          <View style={{}}>
            <View style={{ marginBottom: SH(4) }}>
              <AppText style={{ color: Colors.gray3, fontSize: SH(12), lineHeight: SH(14) }}>
                {this.state.timeStartStep2}
              </AppText>
            </View>
            <View
              style={{
                backgroundColor: Colors.primary5,
                borderRadius: 16,
                borderTopLeftRadius: 0,
              }}
            >
              <View style={{ paddingHorizontal: SW(12), paddingVertical: SH(10) }}>
                <View
                  style={
                    {
                      // paddingBottom: SH(8),
                    }
                  }
                >
                  <AppText style={{ fontSize: SH(13), lineHeight: SH(18), color: Colors.gray1 }}>
                    {this.state.mFastMessageLocal}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderListFeedBackItem = ({ item, index }) => {
    const { disableSelect } = this.props;
    const { topic_name, status } = item;
    return (
      <TouchableOpacity
        disabled={disableSelect}
        onPress={() => {
          this.props.onFeedbackTypeItemPress(item, index);
          if (!item?.description || !item?.description?.length === 0) {
            this.props.onStartFeedback('');
          }
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: SW(12),
            // borderBottomWidth:
          }}
        >
          <AppText
            medium
            style={{
              fontSize: SH(13),
              lineHeight: SH(18),
              color: Colors.gray1,
              paddingRight: SW(6),
            }}
          >
            {topic_name}
          </AppText>
          <Image
            source={ICON_PATH.arrow_right}
            style={{ width: SW(18), height: SH(18), resizeMode: 'contain' }}
          />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: Colors.actionBackground,
            width: '100%',
            marginHorizontal: SW(12),
          }}
        ></View>
      </TouchableOpacity>
    );
  };

  renderListHeader = () => {
    return (
      <View
        style={{
          paddingTop: SH(10),
          paddingHorizontal: SW(12),
        }}
      >
        <AppText
          style={{
            fontSize: SH(13),
            lineHeight: SH(18),
            color: Colors.gray2,
          }}
        >
          Để MFast hỗ trợ nhanh chóng, vui lòng chọn vấn đề bạn đang gặp phải:
        </AppText>
        <View
          style={{
            height: 1,
            backgroundColor: Colors.actionBackground,
            width: '100%',
            paddingHorizontal: SW(12),
            marginTop: SH(10),
          }}
        ></View>
      </View>
    );
  };

  renderViewSupport = () => {
    return (
      <View>
        <View
          style={{
            backgroundColor: Colors.primary5,
            marginLeft: SW(44),
            borderRadius: 16,
            borderTopLeftRadius: 0,
            marginTop: SH(8),
            width: '80%',
          }}
        >
          {/* {feedbackTypes.map((item, index) => {
            return this.renderListFeedBackItem(item, index);
          })} */}
          <FlatList
            data={this.props.feedbackTypes}
            renderItem={this.renderListFeedBackItem}
            ListHeaderComponent={this.renderListHeader()}
            key={(item) => `${item.topic_id}`}
          />
        </View>
      </View>
    );
  };

  render() {
    const {
      containerStyle,
      messageTitle,
      message,
      feedbackTypes,
      selectedTopic,
      onFeedbackTypeItemPress,
    } = this.props;

    return (
      <View style={containerStyle}>
        <SenderMessage showTitle title={messageTitle} message={message} />
        {this.renderViewSupport()}
        {this.renderTopicsDetail(selectedTopic, moment().format('hh:mm a'))}
      </View>
    );
  }
}

export default WelcomeFeedback;
