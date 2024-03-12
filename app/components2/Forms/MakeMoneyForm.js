import React, { PureComponent } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import HTML from 'react-native-render-html';
import AppText from '../../componentV3/AppText';
import Colors from '../../theme/Color';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 6,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 64,
    shadowOpacity: 1,
  },
  wrapperItem: {
    marginVertical: 16,
  },
  containerItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    letterSpacing: 0,
    fontWeight: '400',
  },
  titleBold: {
    fontSize: 16,
    letterSpacing: 0,
    fontWeight: '500',
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: Colors.primary4,
    opacity: 0.6,
  },
  iconLeft: {
    width: 32,
    height: 32,
  },
  iconRight: {
    width: 20,
    height: 20,
  },
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.6,
    backgroundColor: Colors.neutral4,
  },
  childrenContainer: {
    flex: 1,
    backgroundColor: '#e3ffdc',
    marginLeft: 48,
    borderRadius: 6,
    padding: 12,
  },
  dividerchildren: {
    height: 12,
  },
  logoParner: {
    width: 81,
    aspectRatio: 81 / 25,
  },
  rowChildren: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txtChoose: {
    fontSize: 14,
    letterSpacing: 0,
    textAlign: 'right',
    lineHeight: 26,
    color: Colors.primary2,
  },
  dividerChild: {
    width: '100%',
    height: 1,
    borderRadius: 0.5,
    backgroundColor: Colors.primary5,
  },
  logoInsurance: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  loadingContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: '#0002',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// const DUMMY_DATA = [
//     {
//         iconUrl: null,
//         titleHtml: '<p style="font-size: 12pt; color: #840000">Nhận ngay <span style="font-weight: bold;">40,000đ từ CIMB Bank</span></p>',
//         descHtml: '<p style="font-size: 10pt; color: rgba(36, 37, 61, 0.6) "><span style="font-weight: bold;">3 phút</span> để kích hoạt tài khoản ngân hàng liên kết và nhận ngay <span style="font-weight: bold;">40,000 vnđ</span></p>',
//         id: 'cimb',
//         mainUrl: '',
//     },
//     {
//         iconUrl: null,
//         titleHtml: '<p style="font-size: 12pt; color: rgba(35, 58, 149, 1)">Giới thiệu <span style="font-weight: bold;">KH có nhu cầu vay </span></p>',
//         descHtml: '<p style="font-size: 10pt; color: rgba(36, 37, 61, 0.6) ">Nhận lên tới <span style="font-weight: bold;">1,300,000</span> vnđ/ hồ sơ giải ngân được bạn giới thiệu</p>',
//         id: 'Tai_chinh',
//         mainUrl: '',
//         children: [
//             {
//                 logoUrl: null,
//                 titleHtml: '<p style="font-size: 12pt; color: #840000">Nhận ngay <span style="font-weight: bold;">40,000đ từ CIMB Bank</span></p>',
//                 descHtml: '<p style="line-height: 13pt; font-size: 10pt; color: rgba(36, 37, 61, 0.6); font-family: HelveticaNeue;">Nhận ít nhất <span style="font-weight: bold; color: rgb(214, 97, 0);">20%</span> tổng giá trị Hợp đồng Bảo hiểm bán được.</p>',
//                 url: 'mfastmobile://genLinkRefAndShare?projectID=19',
//                 actionType: 'DEEPLINK',
//                 id: 'TC_1',
//                 type: 'FINANCE'
//             },
//             {
//                 logoUrl: null,
//                 titleHtml: '<p style="font-size: 12pt; color: #840000">Nhận ngay <span style="font-weight: bold;">40,000đ từ CIMB Bank</span></p>',
//                 descHtml: '<p style="line-height: 13pt; font-size: 10pt; color: rgba(36, 37, 61, 0.6); font-family: HelveticaNeue;">Nhận ít nhất <span style="font-weight: bold; color: rgb(214, 97, 0);">20%</span> tổng giá trị Hợp đồng Bảo hiểm bán được.</p>',
//                 url: '',
//                 id: 'TC_2',
//                 type: 'FINANCE'
//             },
//             {
//                 type: 'MORE',
//                 titleHtml: '<p style="line-height: 13pt; font-size: 10pt; color: rgba(36, 37, 61, 0.6); font-family: HelveticaNeue;">Và nhiều sản phẩm vay khác</p>',
//                 url: '',
//                 id: 'more_tc'
//             }
//         ]
//     },
//     {
//         iconUrl: require('./img/globalCare.png'),
//         titleHtml: '<p style="font-size: 12pt; color: #7741c3">Giới thiệu các gói <span style="font-weight: bold;">bảo hiểm</span> cho KH</p>',
//         descHtml: '<p style="font-size: 10pt; color: rgba(36, 37, 61, 0.6) ">Nhận lên tới <span style="font-weight: bold;">75%</span> phí bảo hiểm ngay khi hoàn tất thanh toán, bán hàng</p>',
//         id: 'Bao_hiem',
//         mainUrl: '',
//         children: [
//             {
//                 logoUrl: null,
//                 titleHtml: '<p style="font-size: 12pt; color: #840000">Nhận ngay <span style="font-weight: bold;">40,000đ từ CIMB Bank</span></p>',
//                 descHtml: '<p style="line-height: 13pt; font-size: 10pt; color: rgba(36, 37, 61, 0.6); font-family: HelveticaNeue;">Nhận ít nhất <span style="font-weight: bold; color: rgb(214, 97, 0);">20%</span> tổng giá trị Hợp đồng Bảo hiểm bán được.</p>',
//                 url: '',
//                 id: 'BH_1',
//                 type: 'INSURANCE'
//             },
//             {
//                 type: 'MORE',
//                 titleHtml: '<p style="line-height: 13pt; font-size: 10pt; color: rgba(36, 37, 61, 0.6); font-family: HelveticaNeue;">Và nhiều sản phẩm bảo hiểm khác</p>',
//                 url: '',
//                 id: 'more_bh'
//             }
//         ]
//     }
// ];

export class MakeMoneyForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // expendIds: {},
      expendId: null,
      loading: false,
    };
  }

  onPressItem = (item) => {
    const { id, children, url, title, actionType, type } = item;

    if (children && children.length > 0) {
      // const { expendIds = {} } = this.state;
      // expendIds[`${id}`] =  !expendIds?.[`${id}`];
      // this.setState({ expendIds: {...expendIds} })
      const { expendId } = this.state;
      let exId = id;
      if (expendId === item.id) {
        exId = null;
      }
      this.setState({ expendId: exId });
    } else {
      if (actionType === 'TOPUP') {
        this.props.onPressTopup();
      } else if (actionType === 'OPEN_WALLET') {
        this.props.onPressWallet();
      } else if (actionType === 'DEEPLINK') {
        Linking.openURL(url);
      } else {
        this.props.navigation.navigate('WebView', { mode: 0, title, url });
      }
    }
  };

  onPressMoreItem = (item) => {
    const { url, title, actionType } = item;
    if (actionType === 'DEEPLINK') {
      this.onHandlerDeeplinkPress(url);
      return;
    }
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };

  onPressFinanceItem = (item) => {
    const { url, title, actionType } = item;
    if (actionType === 'DEEPLINK') {
      this.onHandlerDeeplinkPress(url);
      return;
    }
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };

  onPressInsuranceItem = (item) => {
    const { url, title, actionType } = item;
    if (actionType === 'DEEPLINK') {
      this.onHandlerDeeplinkPress(url);
      return;
    }
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };

  getsourceIconRight = (actived, isChildren) => {
    let iconRight = require('./img/icon_next.png');
    if (!isChildren) return iconRight;
    if (!actived) {
      iconRight = require('./img/ic_plus.png');
    } else {
      iconRight = require('./img/ic_collapse.png');
    }
    return iconRight;
  };

  onHandlerDeeplinkPress = (url) => {
    this.setState(
      {
        loading: true,
      },
      () => {
        Linking.openURL(url);
      },
    );
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  };

  renderItemChildren = ({ item }) => {
    if (item.type === 'MORE') {
      return (
        <TouchableOpacity onPress={() => this.onPressMoreItem(item)}>
          <View style={styles.childrenContainer}>
            <View style={styles.rowChildren}>
              <View style={{ width: '100%', flex: 1 }}>
                <HTML html={item.titleHtml} />
              </View>
              <View style={{ justifyContent: 'center', height: '100%' }}>
                <Image source={require('./img/ic_next1.png')} style={styles.iconRight} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    if (item.type === 'FINANCE') {
      return (
        <View style={styles.childrenContainer}>
          <View style={styles.rowChildren}>
            {item.logoUrl ? (
              <Image source={{ uri: item.logoUrl }} style={styles.logoParner} />
            ) : (
              <View style={styles.logoParner} />
            )}
            <TouchableOpacity onPress={() => this.onPressFinanceItem(item)}>
              <View style={[styles.rowChildren]}>
                <AppText style={styles.txtChoose}>Giới thiệu ngay</AppText>
                <Image source={require('./img/ic_next1.png')} style={styles.iconRight} />
              </View>
            </TouchableOpacity>
          </View>
          <HTML html={item.titleHtml} />
          <View style={styles.dividerChild} />
          <HTML html={item.descHtml} />
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={() => this.onPressInsuranceItem(item)}>
        <View style={styles.childrenContainer}>
          <View style={styles.rowChildren}>
            <View style={{ height: '100%' }}>
              {item.logoUrl ? (
                <Image source={{ uri: item.logoUrl }} style={styles.logoInsurance} />
              ) : (
                <View style={styles.logoInsurance} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <View style={[styles.rowChildren, { flex: 1 }]}>
                <View style={{ flex: 1 }}>
                  <HTML
                    html={item.titleHtml}
                    tagsStyles={{
                      b: { margin: 0 },
                      p: { margin: 0 },
                      h1: { margin: 0 },
                      h2: { margin: 0 },
                      h3: { margin: 0 },
                      h4: { margin: 0 },
                      h6: { margin: 0 },
                      span: { margin: 0 },
                    }}
                  />
                </View>
                <View style={[styles.rowChildren]}>
                  <AppText style={styles.txtChoose}> </AppText>
                  <Image source={require('./img/ic_next1.png')} style={styles.iconRight} />
                </View>
              </View>
            </View>
          </View>
          <HTML html={item?.descHtml} />
        </View>
      </TouchableOpacity>
    );
  };

  itemSeparatorChildrenComponent = () => <View style={styles.dividerchildren} />;

  renderItem = ({ item }) => {
    // const { expendIds } = this.state;
    // const actived = !!expendIds?.[`${item.id}`];
    const { expendId } = this.state;
    const actived = expendId === item.id;
    const { children } = item;
    const isChildren = !!(children && children.length > 0);
    const isShowChildren = actived && isChildren;
    return (
      <View style={[styles.wrapperItem, isShowChildren && { marginBottom: 0 }]}>
        <TouchableOpacity onPress={() => this.onPressItem(item)}>
          <View style={styles.containerItem}>
            {item.iconURL ? (
              <Image source={{ uri: item.iconURL }} style={styles.iconLeft} />
            ) : (
              <View style={styles.iconLeft} />
            )}
            <View style={{ flex: 1, marginHorizontal: 16 }}>
              <HTML
                html={item.titleHtml}
                tagsStyles={{
                  b: { margin: 0 },
                  p: { margin: 0 },
                  h1: { margin: 0 },
                  h2: { margin: 0 },
                  h3: { margin: 0 },
                  h4: { margin: 0 },
                  h6: { margin: 0 },
                  span: { margin: 0 },
                }}
              />
              <HTML
                html={item?.descHtml}
                tagsStyles={{
                  b: { margin: 0 },
                  p: { margin: 0 },
                  h1: { margin: 0 },
                  h2: { margin: 0 },
                  h3: { margin: 0 },
                  h4: { margin: 0 },
                  h6: { margin: 0 },
                  span: { margin: 0 },
                }}
              />
            </View>
            <View style={{ justifyContent: 'center', height: '100%' }}>
              <Image
                source={this.getsourceIconRight(actived, isChildren)}
                style={styles.iconRight}
              />
            </View>
          </View>
        </TouchableOpacity>
        {isShowChildren && (
          <FlatList
            data={children}
            style={{ paddingVertical: 12 }}
            renderItem={this.renderItemChildren}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={this.itemSeparatorChildrenComponent}
          />
        )}
      </View>
    );
  };

  itemSeparatorComponent = () => <View style={styles.divider} />;

  render() {
    const { data } = this.props;
    const { loading } = this.state;
    return (
      <View>
        <View style={styles.container}>
          <FlatList
            ref={(ref) => {
              this.flatListRef = ref;
            }}
            data={data}
            extraData={this.state}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={this.itemSeparatorComponent}
          />
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </View>
    );
  }
}

export default MakeMoneyForm;
