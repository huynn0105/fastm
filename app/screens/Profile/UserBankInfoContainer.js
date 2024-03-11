import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import {
  requestUserBankList,
} from '../../redux/actions';

import { BANK_STATUS_TYPE } from '../../models/Bank';
import colors from '../../constants/colors';

const _ = require('lodash');

// --------------------------------------------------
// UserBankInfoContainer
// --------------------------------------------------

const MAX_BANK = 1;

class UserBankInfoContainer extends Component {

  componentDidMount() {
    this.reloadData();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  reloadData() {
    if (this.props.isGetUserBankList === false) {
      this.props.getUserBankList();
    }
  }

  renderLoadingRow = () => {
    // return (
    // <LoadMoreView isLoading title={'Đang tải'} />
    // );
  }

  renderContent(banks, onAddBankPress, addBankURL, onBankPress) {
    return (
      <View>
        {
          this.renderListBankRows(banks, onBankPress)
        }
        {
          banks.length < MAX_BANK &&
          this.renderAddBankRow(banks, onAddBankPress, addBankURL)
        }
      </View>
    );
  }

  renderBankRow = (bank, onBankPress, index) => {
    let icStatus = require('./img/pending.png');
    let statusColor = '#000';
    let statusTitle = '';
    switch (bank.status) {
      case BANK_STATUS_TYPE.pending:
        icStatus = require('./img/pending.png');
        statusColor = '#dd9115';
        statusTitle = 'Chờ duyệt';
        break;
      case BANK_STATUS_TYPE.failed:
        icStatus = require('./img/fail.png');
        statusColor = '#d0021b';
        statusTitle = 'Không hợp lệ';
        break;
      case BANK_STATUS_TYPE.success:
        icStatus = require('./img/success.png');
        statusColor = '#4dae46';
        statusTitle = 'Đã duyệt';
        break;
      default:
        break;
    }

    return (
      <TouchableOpacity
        testID={`test_bank_row_${index}`}
        activeOpacity={0.7}
        onPress={() => onBankPress(bank.detailURL)}
      >
        <View style={styles.bankRowContainer} >
          <View
            style={{
              flex: 1,
              justifyContent: 'space-around',
            }}
          >
            <View
              style={[styles.bankRowLine, {
                marginBottom: 12,
              }]}
            >
              <Text
                style={[styles.valueText, {
                  marginRight: 24,
                }]}
              >
                {bank.holderName}
              </Text>
              <Image
                source={icStatus}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 4,
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: statusColor,
                }}
              >
                {statusTitle}
              </Text>
            </View>
            <View style={styles.bankRowLine}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#5557',
                  marginRight: 4,
                }}
              >
                Số TK:
              </Text>
              <Text
                style={[styles.valueText, {
                  marginRight: 14,
                }]}
              >
                {bank.accountNumber}
              </Text>
              <Text style={styles.titleText}>
                Ngân hàng:
              </Text>
              <Text style={styles.valueText}>
                {bank.bankName}
              </Text>
            </View>
          </View>
          <View>
            <Image
              source={require('./img/arrow_right.png')}
              style={{
                width: 10,
                height: 16,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderListBankRows(banks) {
    const {
      onBankPress,
    } = this.props;
    return (
      <View
        style={{
          flex: 0,
        }}
      >
        <FlatList
          style={{
            flex: 0,
          }}
          data={banks}
          extraData={banks}
          keyExtractor={item => item.accountNumber + item.status}
          ItemSeparatorComponent={() => {
            return this.renderSeparatorLine();
          }
          }
          renderItem={(row) => {
            return this.renderBankRow(row.item, onBankPress, row.index);
          }}
        />
      </View>
    );
  }

  renderSeparatorLine = () => {
    return (
      <View
        style={{
          height: 1.0,
          backgroundColor: '#fff',
        }}
      >
        <View style={styles.separatorLine} />
      </View>
    );
  }

  renderAddBankRow = (banks, onAddBankPress, addUrl) => {
    return (
      <TouchableOpacity
        testID="test_add_bank_row"
        activeOpacity={0.7}
        onPress={() => onAddBankPress(addUrl)}
      >
        <View>
          {
            (banks.length !== 0) &&
            this.renderSeparatorLine()
          }
          <View style={styles.addBank}>
            <Image
              source={require('./img/add_bank.png')}
              style={styles.icAddBank}
            />
            <Text
              style={{
                fontSize: 14,
                color: '#626262',
              }}
            >
              Thêm tài khoản ngân hàng liên kết
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      onAddBankPress,
      appInfo,
      isGetUserBankList,
      userBankList,
    } = this.props;

    return (
      <View
        style={{
          flex: 0,
        }}
      >
        {
          isGetUserBankList
        }
        {
          this.renderContent(userBankList, onAddBankPress, appInfo.addBankURL)

        }
      </View>
    );
  }
}

UserBankInfoContainer.propTypes = {
};

UserBankInfoContainer.defaultProps = {
};

const mapState = (state) => ({
  appInfo: state.appInfo,
  isGetUserBankList: state.isGetUserBankList,
  userBankList: state.userBankList,
});

const mapDispatch = (dispatch) => ({
  getUserBankList: () => dispatch(requestUserBankList()),
});

export default connect(mapState, mapDispatch)(UserBankInfoContainer);

const styles = StyleSheet.create({
  addBank: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: 64,
    backgroundColor: colors.navigation_bg,
    paddingLeft: 20,
  },
  icAddBank: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10,
  },
  separatorLine: {
    marginLeft: 16,
    marginRight: 16,
    height: 1.0,
    backgroundColor: '#E2E2E2',
  },
  bankRowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    paddingLeft: 20,
    paddingRight: 20,
  },
  bankRowLine: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  valueText: {
    fontSize: 14,
    color: '#555',
  },
  titleText: {
    fontSize: 12,
    color: '#5557',
    marginRight: 4,
  },
});
