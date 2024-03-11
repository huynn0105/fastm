/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import Colors from '../../theme/Color';

// {
//   "label": "Tài khoản ngân hàng",
//   "description": "Khai báo tài khoản ngân hàng để rút tiền thu nhập từ APPAY",
//   "url": "https://appay-rc.cloudcms.vn/fe_credit/banking/load/72?tab=info",
//   "status": "success", //not/pending/failed/success
//   "status_text": "TK NH hợp lệ"
// }

const STATUS_COLOR = {
  not: '#24253d',
  pending: '#e78800',
  failed: '#bc0f23',
  success: '#4dae46'
};
const STATUS_ICON = {
  not: undefined,
  pending: require('./img/ic_pending.png'),
  failed: require('./img/ic_fail.png'),
  success: require('./img/ic_success.png')
};

class WithdrawInfo extends PureComponent {
  onPressItem = (url, index, info) => {
    this.props.onPress(url, 'Thông tin rút tiền', index);
  };

  renderInfoRow = (info, index, hasSeperator, showErrorWithdrawInfo, onPress) => (
    <WithdrawInfoRow
      info={info}
      index={index}
      hasSeperator={hasSeperator}
      showErrorWithdrawInfo={showErrorWithdrawInfo && index !== 0}
      onPress={onPress}
    />
  );

  render() {
    const { infos, showErrorWithdrawInfo } = this.props;
    return infos.length > 0 ? (
      <View
        style={{
          borderRadius: 4,
          shadowOpacity: 0.2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
          backgroundColor: '#fff',
          padding: 2
        }}
      >
        {infos.map((info, index) =>
          this.renderInfoRow(
            info,
            index,
            index !== infos.length - 1,
            showErrorWithdrawInfo,
            this.onPressItem
          )
        )}
      </View>
    ) : null;
  }
}

export default WithdrawInfo;

class WithdrawInfoRow extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.info.url, this.props.index, this.props.info);
  };
  renderStatus = (status, title) => (
    <View style={{ flexDirection: 'row' }}>
      {STATUS_ICON[status] ? (
        <Image style={{ width: 16, height: 16, marginRight: 4 }} source={STATUS_ICON[status]} />
      ) : null}
      <Text
        style={{
          color: STATUS_COLOR[status],
          fontSize: 12,
          // opacity: this.props.showErrorWithdrawInfo ? 0.6 : 1
        }}
      >
        {title}
      </Text>
    </View>
  );

  renderDetailBtn = (url, onPress) => (
    <DetailButton
      url={url}
      showErrorWithdrawInfo={this.props.showErrorWithdrawInfo}
      onPress={onPress}
    />
  );

  renderTitle = (title) => (
    <Text
      style={{
        color: '#24253d',
        fontSize: 14,
        // opacity: this.props.showErrorWithdrawInfo ? 0.6 : 1
      }}
    >
      {title}
    </Text>
  );

  renderDetail = (detail) => (
    <Text
      style={{
        flex: 1,
        color: '#24253d99',
        marginRight: 40,
        fontSize: 12,
        fontStyle: 'italic',
        // opacity: this.props.showErrorWithdrawInfo ? 0.6 : 1
      }}
    >
      {detail}
    </Text>
  );

  renderErrorMessage = () => (
    <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
      <Image source={require('./img/ic_warning.png')} />
      <Text style={{ marginLeft: 6, color: Colors.accent3 }}>
        {'Bạn chưa thêm tài khoản ngân hàng '}
      </Text>
    </View>
  );

  render() {
    const { info, hasSeperator, showErrorWithdrawInfo } = this.props;
    return (
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.2} onPress={this.onPress}>
        <View style={{ margin: 12, flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {this.renderTitle(info.label)}
            {this.renderStatus(info.status, info.status_text)}
          </View>
          {/* {showErrorWithdrawInfo ? this.renderErrorMessage() : null} */}
          <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
            {this.renderDetail(info.description)}
            {this.renderDetailBtn(info.url, this.onPress)}
          </View>
        </View>
        {hasSeperator ? (
          <View style={{ height: 1, marginLeft: 12, marginRight: 12, backgroundColor: '#8882' }} />
        ) : null}
      </TouchableOpacity>
    );
  }
}

class DetailButton extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.url);
  };
  render() {
    return (
      <TouchableOpacity
        style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
        onPress={this.onPress}
      >
        <Text
          style={{
            fontSize: 12,
            color: this.props.showErrorWithdrawInfo ? Colors.primary1 : Colors.primary2,
            opacity: this.props.showErrorWithdrawInfo ? 0.6 : 1
          }}
        >
          {'Chi tiết'}
        </Text>
        <Image
          style={{
            width: 16,
            height: 16,
            tintColor: this.props.showErrorWithdrawInfo ? Colors.neutral4 : Colors.primary2
          }}
          source={require('./img/ic_detail.png')}
        />
      </TouchableOpacity>
    );
  }
}
