import React, { PureComponent } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
export default class IntroSwiper extends PureComponent {

  _renderIntroView = ({ title, desc, image }) => (
    <View style={styles.introView}>
      <Image style={styles.introImage} source={image} resizeMode="contain" />
      <View style={{ height: 16 }} />
      <AppText style={{ ...styles.title }}>{title}</AppText>
      <AppText style={{ ...styles.desc }}>{desc}</AppText>
      <View style={{ height: 40 }} />
    </View>
  );

  render() {
    const dataSources = [
      {
        title: 'Thu nhập cạnh tranh bậc nhất',
        desc: 'Hầu hết các sản phẩm, dịch vụ trên MFast đang có mức thu nhập cho người giới thiệu cao gần như nhất thị trường.',
        image: require('./img/intro_swiper_1.png'),
      },
      {
        title: 'Thanh toán thu nhập liền tay',
        desc: 'Nền tảng duy nhất thanh toán thu nhập cho bạn ngay lập tức sau khi khách hàng thực hiện giao dịch thành công.',
        image: require('./img/intro_swiper_2.png'),
      },
      {
        title: 'Đa dạng sản phẩm, dịch vụ',
        desc: "Các sản phẩm, dịch vụ có nhu cầu cao và 'hot' nhất thị trường đều có mặt trên MFast, đặc biệt là tài chính và bảo hiểm.",
        image: require('./img/intro_swiper_3.png'),
      },
      // {
      //   title: 'Hệ thống đa nền tảng, sử dụng trên mọi thiết bị',
      //   image: require('./img/intro_swiper_4.png'),
      // },
    ];

    const activeDot = (<View style={styles.activeDot} />);
    const dot = (<View style={styles.dot} />);

    return (
      <View style={{ ...styles.container, ...this.props.style }} >
        <Swiper
          autoplay
          autoplayTimeout={3}
          dot={dot}
          activeDot={activeDot}
          removeClippedSubviews={false}
        >
          {dataSources.map(this._renderIntroView)}
        </Swiper>
        <Image
          style={styles.bottomCurvedImage}
          source={require('./img/intro_swiper_rect.png')}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  introView: {
    flex: 1,
    alignItems: 'center',
  },
  introImage: {
    flex: 300,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: Colors.primary1,
  },
  desc: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: Colors.primary4,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  introText: {
    opacity: 0.85,
    fontSize: 14,
    textAlign: 'center',
    color: Colors.primary4,
  },
  activeDot: {
    backgroundColor: Colors.primary3,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginRight: 8,
  },
  dot: {
    backgroundColor: Colors.neutral4,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginRight: 8,
  },
  bottomCurvedImage: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
