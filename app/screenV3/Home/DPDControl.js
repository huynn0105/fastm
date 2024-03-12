import { connect } from 'react-redux';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import HTMLView from 'react-native-render-html';
import React from 'react';

import { SCREEN_WIDTH } from '../../utils/Utils';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import { icons } from '../../img';
import AppText from '../../componentV3/AppText';
import { ICON_PATH } from '../../assets/path';
class DPDControl extends React.PureComponent {
  static defaultProps = {};
  renderTitle = (title) => {
    return (
      <View style={{ marginTop: -SH(18), marginBottom: SH(12) }}>
        <HTMLView html={title} />
      </View>
    );
  };
  renderItem = ({ title, icon, value, color, unit, path, contest }, index) => {
    return (
      <TouchableOpacity
        key={`${title}${value}`}
        style={{
          width: SW(181),
          height: SH(54),
          borderTopRightRadius: index === 0 ? 6 : 0,
          borderBottomRightRadius: index === 0 ? 6 : 0,
          borderTopLeftRadius: index === 0 ? 0 : 6,
          borderBottomLeftRadius: index === 0 ? 0 : 6,
          paddingTop: SH(10),
          padding: SW(12),
          backgroundColor: 'white',
          borderRadius: 6,
          marginRight: index === 0 ? SW(6) : 0,
          marginLeft: index === 0 ? 0 : SW(6),
        }}
        onPress={() => {
          this.props.navigation.navigate('WebView', {
            mode: 0,
            title,
            url: path,
          });
        }}
      >
        {contest ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius: 6,
              zIndex: 999,
              backgroundColor: contest?.bgColor,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: SH(2),
                paddingHorizontal: SW(6),
              }}
            >
              <Image
                source={{ uri: contest?.icon }}
                style={{
                  width: SW(20),
                  height: SH(20),
                  resizeMode: 'contain',
                }}
              />
              <AppText
                style={{
                  fontSize: SH(14),
                  lineHeight: SH(20),
                  color: 'rgb(35,168,0)',
                  marginLeft: SW(4),
                }}
              >
                {contest?.number}
              </AppText>
            </View>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Image
              style={{ width: SW(24), height: SH(24), resizeMode: 'contain' }}
              source={{ uri: icon }}
            />
          </View>
          <View style={{ marginLeft: SW(8), flex: 4.5, justifyContent: 'center' }}>
            <AppText style={{ fontSize: SH(13), lineHeight: SH(16), color: Colors.primary4 }}>
              {title}
            </AppText>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: SH(2),
              }}
            >
              <AppText
                bold
                style={{
                  fontSize: SH(14),
                  lineHeight: SH(20),
                  color: index === 0 ? Colors.accent3 : Colors.accent2,
                  // fontWeight: 'bold',
                }}
              >
                {value}
              </AppText>
              <Image
                source={ICON_PATH.arrow_right}
                style={{ width: SW(14), height: SH(14), resizeMode: 'contain' }}
              />
            </View>
          </View>
        </View>
        {/* <View style={{ flexDirection: 'row', marginBottom: 10, backgroundColor: 'red' }}>
          <AppText
            style={{
              fontSize: 12,
              color: '#24253d',
              marginRight: 4,
            }}
          >
            {title}
          </AppText>
          <Image style={{ width: 16, height: 16 }} source={require('./img/ic_next.png')} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image style={{ width: 46, height: 46, marginRight: 12 }} source={{ uri: icon }} />
          <View>
            <AppText
              style={{
                fontSize: 18,
                color,
                fontWeight: '600',
                marginBottom: 6,
              }}
            >
              {value}
            </AppText>
            <AppText
              style={{
                fontSize: 14,
                opacity: 0.8,
                color: '#24253d',
              }}
            >
              {unit}
            </AppText>
          </View>
        </View> */}
      </TouchableOpacity>
    );
  };
  render() {
    const DPD = this.props.DPD;
    // const DPD = {
    //   title: 'Hồ sơ <b>tài chính</b> trả nợ chậm và thu nhập tạm giữ',
    //   items: [
    //     {
    //       icon: 'https://appay-rc.cloudcms.vn/assets/img/mfast/dpd/debt.svg',
    //       value: '3 HS',
    //       color: '#bc0f23',
    //       unit: '30 %',
    //       title: 'HS trả nợ chậm',
    //       path: 'https://appay-rc.cloudcms.vn/mfast_app/DPD/index',
    //     },
    //     {
    //       icon: 'https://appay-rc.cloudcms.vn/assets/img/mfast/dpd/debt.svg',
    //       value: '1,300,000',
    //       color: '#d66100',
    //       unit: 'vnđ',
    //       title: 'Thu nhập tạm giữ',
    //       path: 'https://appay-rc.cloudcms.vn/mfast_app/DPD/index',
    //     },
    //   ],
    // };
    if (!DPD || !DPD.title) {
      return null;
    }

    return (
      <View style={{ marginBottom: SH(16) }}>
        <View style={{ flexDirection: 'row' }}>{DPD?.items?.map(this.renderItem)}</View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  DPD: state.DPD,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DPDControl);
