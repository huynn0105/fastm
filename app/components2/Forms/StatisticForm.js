
/* eslint-disable camelcase */
import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import AppText from '../../componentV3/AppText';

import colors from '../../constants/colors';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(36, 37, 61, 0.6)',
    paddingBottom: 16
  },
  normalTxt: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(36, 37, 61, 0.8)'
  },
  boldTxt: {
    fontWeight: 'bold',
    color: 'rgba(36, 37, 61, 1)',
  },
  boldTxtPer: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: 'rgba(36, 37, 61, 1)',
  }
});

class IncomeChartSection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowIndicator: false
    }
  }

  renderInfoRow = ({ color, valueString, title, grow }) => {
    return (
      <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'center' }}>
        <View
          style={{
            width: 8,
            aspectRatio: 1,
            borderRadius: 4,
            backgroundColor: color,
            marginRight: 10,
          }}
        />
        <AppText
          style={{
            fontSize: 14,
            fontWeight: '500',
            color,
            marginRight: 6,
          }}
        >
          {valueString}
        </AppText>
        <AppText style={{ fontSize: 12, color: '#24253d', marginRight: 8 }}>{`-  ${title}`}</AppText>
        {this.renderPercentage(grow)}
      </View>
    );
  };
  renderDirectInfo = (data = {}, loading) => {
    const { parts = [] } = data;
    return (
      <View style={{ justifyContent: 'center' }}>
        {!loading && (
        <AppText
          style={{
            
            fontSize: 12,
            fontWeight: 'normal',
            fontStyle: 'normal',
            letterSpacing: 0,
            color: 'rgba(36, 37, 61, 0.6)',
            marginBottom: 6,
          }}
        >
          Thu nhập
          <AppText style={{ fontWeight: 'bold', color: 'rgba(36, 37, 61, 1)' }}>
            {' trực tiếp '}
          </AppText>
          trong tháng:
        </AppText>)
        }
        {!loading ? (
          <Animatable.View animation={'fadeIn'} duration={500}>
            {parts.map(this.renderInfoRow)}
          </Animatable.View>
        ) : (
          <View style={{ height: 72, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator
              style={{ opacity: 0.5 }}
              animating
              size={'large'}
              color={'#0082e0'}
            />
            <AppText
              style={{
                marginTop: 6,
                fontSize: 12,
                color: 'rgba(36, 37, 61, 0.6)',
              }}
            >
              {'Đang cập nhật dữ liệu'}
            </AppText>
          </View>
        )}
      </View>
    );
  };

  renderInDirectInfo = (data = {}) => {
    const { parts, CTV } = data;
    return (
      <View style={{ justifyContent: 'center' }}>
        <AppText
          style={{
            
            fontSize: 12,
            fontWeight: 'normal',
            fontStyle: 'normal',
            letterSpacing: 0,
            color: 'rgba(36, 37, 61, 0.6)',
            marginBottom: 6,
          }}
        >
          {'Thu nhập '}
          <AppText style={{ fontWeight: 'bold', color: 'rgba(36, 37, 61, 1)' }}>gián tiếp</AppText>
          {' từ '}
          <AppText style={{ fontWeight: 'bold', color: 'rgba(36, 37, 61, 1)' }}>{CTV}</AppText> CTV:
        </AppText>
        {parts.map(this.renderInfoRow)}
      </View>
    );
  };

  renderPercentage = (grow) => {
    if (grow === 0 || grow === '0') return null;
    return (
      <View style={{ flexDirection: 'row' }}>
        {grow !== 0 && grow !== '0' ? (
          <Image
            style={{ width: 10, height: 14, marginRight: 3 }}
            source={grow > 0 ? require('./img/ic_up.png') : require('./img/ic_down.png')}
            resizeMode={'contain'}
          />
        ) : null}
        <AppText
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            color: grow > 0 ? '#00863d' : '#bc0f23',
          }}
        >
          {`${Math.abs(grow)}%`}
        </AppText>
      </View>
    );
  };

  renderLoadingChart = () => {
    return (
      <View
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: 0.3 }}
        key={1}
      >
        <Progress.Circle
          size={100}
          strokeCap={'round'}
          borderWidth={14}
          endAngle={0.4}
          indeterminate
          useNativeDriver
        />
      </View>
    );
  };

  renderChart = (data = {}, loading) => {
    const { parts = [], total_income, grow } = data;
    let pieData = [];
    if (loading) {
      pieData = [{ value: 1, color: '#e5f2fa' }].map((item, index) => ({
        value: item.value,
        svg: { fill: item.color },
        key: `${index}`,
      }));
    } else {
      pieData = parts.map((item, index) => ({
        value: item.value,
        svg: { fill: item.color },
        key: `${index}`,
      }));
    }
    return (
      <View
        style={{
          width: 100,
          aspectRatio: 1,
        }}
      >
        <View>
          <PieChart style={{ height: 100 }} padAngle={0} innerRadius={'70%'} data={pieData} />
          {loading ? this.renderLoadingChart() : null}
        </View>
        {!loading ? (
          <Animatable.View
            style={{
              position: 'absolute',
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            animation={'fadeIn'}
            duration={500}
          >
            <AppText
              style={{
                opacity: 0.6,
                fontSize: 11,
                color: '#24253d',
              }}
            >
              {'tổng'}
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ width: 8, height: 6 }} source={require('./img/ic_nearly.png')} />
              <AppText
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  lineHeight: 24,
                  textAlign: 'center',
                  color: '#24253d',
                  marginLeft: 2,
                }}
              >
                {total_income}
              </AppText>
            </View>
            {this.renderPercentage(grow)}
          </Animatable.View>
        ) : null}
      </View>
    );
  };

  renderIndirectIncome = (indirectData, loading) => {
    if (loading || (!loading && !indirectData)) return null;
    return (
      <Animatable.View
        style={{
          flexDirection: 'row',
          marginVertical: 16,
          justifyContent: 'space-between',
        }}
        animation={'fadeIn'}
        duration={700}
      >
        {this.renderInDirectInfo(indirectData)}
        <View style={{ width: 20 }} />
        {this.renderChart(indirectData, loading)}
      </Animatable.View>
    );
  };

  renderDirectIncome = (directData, loading) => {
    if (!loading && !directData) return null;
    return (
      <View style={{ flexDirection: 'row', marginVertical: 16, justifyContent: 'space-between' }}>
        {this.renderChart(directData, loading)}
        <View style={{ width: 20 }} />
        {this.renderDirectInfo(directData, loading)}
      </View>
    );
  };

  renderHeader = (data, loading) => {
    const { update_time = '' } = data;
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 14,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={{ width: 16, height: 16, marginRight: 6 }}
            source={require('./img/ic_update.png')}
          />
          <AppText
            style={{
              opacity: 0.6,
              
              fontSize: 12,
              letterSpacing: 0,
              color: '#24253d',
            }}
          >
            {loading ? 'Đang tải' : `Cập nhật - ${update_time}`}
          </AppText>
        </View>
        {!loading && 
          (<TouchableOpacity style={{ flexDirection: 'row' }} onPress={this.onInfoPress}>
            <AppText
              style={{
                opacity: 0.6,
                
                fontSize: 12,
                letterSpacing: 0,
                color: '#24253d',
              }}
            >
              {'Chú thích'}
            </AppText>
            <Image
              style={{ width: 16, height: 16, marginLeft: 6 }}
              source={require('./img/ic_info.png')}
            />
          </TouchableOpacity>)
        }
      </View>
    );
  };

  renderDivider = () => (
    <View 
      style={{
        width: '100%',
        height: 1,
        borderStyle: "solid",
        backgroundColor: 'rgb(207, 211, 214)'
      }}
    />
  )
  onInfoPress = () => {
    this.setState({ isShowIndicator: true });
  }

  onPressCloseModal = () => {
    this.setState({ isShowIndicator: false });
  }

  renderModalDetail = () => {
    const { isShowIndicator } = this.state;
    return (
      <View>
      <Modal isVisible={isShowIndicator} animationIn="fadeIn" animationOut="fadeOut">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, width: '100%' }}>
            <View style={{ padding: 16, alignItems: 'center' }}>
              <AppText style={styles.title}>Chú thích thống kê</AppText>
              <AppText style={styles.normalTxt}>Thu nhập <AppText style={styles.boldTxt}>trực tiếp</AppText> trong tháng: là thu nhập tới từ việc bạn giới thiệu, bán thành công các sản phẩm tài chính, bảo hiểm, … trên MFast.</AppText>
              <View style={{ height: 16 }} />
              <AppText style={styles.normalTxt}>Thu nhập <AppText style={styles.boldTxt}>gián tiếp</AppText> từ <AppText style={styles.boldTxt}>X / Y</AppText> CTV: là thu nhập tới từ các cộng tác việc của bạn. Trong đó <AppText style={styles.boldTxt}>X</AppText> là số CTV có thu nhập, <AppText style={styles.boldTxt}>Y</AppText> là tổng CTV</AppText>
              <View />
              <View style={{ height: 16 }} />
              <View style={styles.row}>
                <View style={{ marginRight: 16 }}>
                  <View style={styles.row}>
                    <Image
                      style={{ width: 13, height: 18, marginRight: 3 }}
                      source={require('./img/ic_up.png')}
                      resizeMode={'contain'}
                    />
                    <AppText style={[styles.boldTxtPer, { color: 'rgb(0, 134, 61)'}]}>A%</AppText>
                  </View>
                  <View style={{ height: 6 }}/>
                  <View style={styles.row}>
                    <Image
                      style={{ width: 13, height: 18, marginRight: 3 }}
                      source={require('./img/ic_down.png')}
                      resizeMode={'contain'}
                    />
                    <AppText style={[styles.boldTxtPer, { color: 'rgb(188, 15, 35)'}]}>B%</AppText>
                  </View>
                </View>
                <AppText style={[styles.normalTxt, { flex: 1 }]}>là % chỉ số tăng trưởng thu nhập so với <AppText style={styles.boldTxtPer}>cùng kì tháng trước.</AppText></AppText>
              </View>
            </View>
            <View style={{ height: 12 }} />
            <TouchableOpacity onPress={this.onPressCloseModal}>
              <View style={{ width: '100%', height: 52, backgroundColor: 'rgb(242, 242, 242)', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                <AppText style={{ fontSize: 16, color: 'rgb(57, 184, 24)' }}>Đã hiểu</AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    )
  }

  render() {
    const { containerStyle, financeInfo, loading } = this.props;
    if (!financeInfo || (!financeInfo.direct && !financeInfo.indirect && !loading)) return null;
    return (
      <View
        style={{
          ...containerStyle,
        }}
      >
        <View
          style={{
            width: '100%',
            backgroundColor: colors.background_home2,
            borderRadius: 6,
          }}
        >
          <View
            style={{
              padding: 12,
              backgroundColor: 'white',
              borderRadius: 6,
            }}
          >
            {this.renderHeader(financeInfo, loading)}
            {this.renderDirectIncome(financeInfo.direct, loading)}
            {!loading && this.renderDivider()}
            {this.renderIndirectIncome(financeInfo.indirect, loading)}
          </View>
        </View>
        {this.renderModalDetail()}
      </View>
    );
  }
}

IncomeChartSection.defaultProps = {
  loading: false,
  financeInfo: null,
  // {
  //   update_time: '2h30p trước',
  //   info: 'Thu nhập trực tiếp trong tháng: là thu nhập...',
  //   direct: {
  //     total_income: '1010K', 
  //     grow: 7,
  //     parts: [
  //       {
  //         color: '#0082e0',
  //         valueString: '300.333 đ',
  //         value: 300333,
  //         title: 'tài chính',
  //         grow: 12
  //       },
  //       {
  //         color: 'rgb(214, 97, 0)',
  //         valueString: '300.333 đ',
  //         value: 300333,
  //         title: 'bảo hiểm',
  //         grow: -12
  //       }
  //     ] 
  //   },
  //   indirect: {
  //     total_income: '1010K',
  //     CTV: '30/50',
  //     grow: 7,
  //     parts: [
  //       {
  //         color: 'rgb(214, 97, 0)',
  //         valueString: '300.333 đ',
  //         value: 300333,
  //         title: 'tài chính',
  //         grow: 12
  //       },
  //       {
  //         color: 'rgb(189, 0, 114)',
  //         valueString: '300.333 đ',
  //         value: 300333,
  //         title: 'bảo hiểm',
  //         grow: -12
  //       },
  //       {
  //         color: 'rgb(35, 58, 149)',
  //         valueString: '300.333 đ',
  //         value: 300333,
  //         title: 'khác',
  //         grow: -12
  //       }
  //     ] 
  //   }
  // }
}

export default IncomeChartSection;
