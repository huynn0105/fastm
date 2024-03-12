import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
} from 'react-native';
import get from 'lodash/get';

import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';

const TYPE_LIST = {
  BANNER: 'BANNER',
  HEADER: 'HEADER',
  ITEM: 'ITEM',
};

// const DUMMYDATA = [
//   {
//     type: 'BANNER',
//     bannerUrl: 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg',
//     imageUrl: 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg',
//     title: 'Kiến thức về các sản phẩm vay',
//     extend: [
//       {
//         title: 'Tiền trên MFast dùng để làm gì?',
//         url: '',
//         more: [
//           {
//             title: 'Tiền trên MFast dùng để làm gì?',
//               url: '',
//           },
//           {
//             title: 'Tiền trên MFast dùng để làm gì?',
//               url: '',
//           },
//         ],
//       },
//       {
//         title: 'Cách liên hệ với MFast?',
//         url: '',
//       },
//     ],
//   }, 
//   {
//     type: 'BANNER',
//     bannerUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png',
//     imageUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png',
//     title: 'Kiến thức về các sản phẩm vay',
//   }, 
//   {
//     type: 'HEADER',
//     title: 'Kiến thức chung',
//   },
//   {
//     imageUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png',
//     ackUrl: '',
//     title: 'Dành cho người mới bắt đầu',
//     description: 'Dành cho người mới bắt đầu',
//     extend: [
//       {
//         title: 'Tiền trên MFast dùng để làm gì?',
//         url: '',
//         more: [
//           {
//             title: 'Tiền trên MFast dùng để làm gì?',
//               url: '',
//           },
//           {
//             title: 'Tiền trên MFast dùng để làm gì?',
//               url: '',
//           },
//         ],
//       },
//       {
//         title: 'Cách liên hệ với MFast?',
//         url: '',
//       },
//     ],
//   },
//   {
//     imageUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png',
//     ackUrl: 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png',
//     title: 'Kiến thức chung',
//     description: 'Dành cho người mới bắt đầu',
//   },
// ];
class Knowledges extends React.PureComponent {
  renderKnowledgeRow = ({ item, index }) => {
    const { knowledges } = this.props;
    switch (item.type) {
      case TYPE_LIST.BANNER: {
        const isLastBanner = get(knowledges, `${index + 1}.type`) !== TYPE_LIST.BANNER;
        if (index % 2 === 0) {
          return this.renderBannerLeft(item, isLastBanner);
        }
        return this.renderBannerRight(item, isLastBanner);
      }
      case TYPE_LIST.HEADER:
        return this.renderHeader(item);
      default:
        return this.renderItem(item);
    }
  };


  renderItem = (item) => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
        }}
        onPress={() => {
          this.props.onItemPress(item);
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: 16,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {item.imageUrl ?
              <Image source={{ uri: item.imageUrl }} style={{ width: 46, height: 46 }} /> :
              <View style={{ width: 46, height: 46 }} />
            }
            <AppText
              style={{
                flex: 1,
                marginHorizontal: 16,
                fontSize: 16,
                fontWeight: '500',
                color: Colors.primary4,
              }}
            >{item.title}
            </AppText>
            <Image source={require('./img/arrow_right.png')} style={{ with: 16, height: 16 }} />
          </View>
          {/* <ItemDetail onPress={this.onPress} details={item.ackDescription} /> */}
        </View>
      </TouchableOpacity>
    );
  }

  renderBannerLeft = (item, isLastBanner) => {
    return (
      <TouchableOpacity
        onPress={() => {
        this.props.onItemPress(item);
      }}
      >
        <View style={[
            styles.bannerContainer,
            { paddingTop: 16 },
            isLastBanner && styles.lastBanner,
          ]}
        >
          {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={{ width: '40%', height: 100 }} />}
          <AppText style={styles.bannerTitle}>{item.title}</AppText>
        </View>
      </TouchableOpacity>
    );
  }

  renderBannerRight = (item, isLastBanner) => {
    return (
      <TouchableOpacity
        onPress={() => {
        this.props.onItemPress(item);
      }}
      >
        <View style={[
          styles.bannerContainer,
          { paddingBottom: 16 },
          isLastBanner && styles.lastBanner,
        ]}
        >
          <AppText style={styles.bannerTitleRight}>{item.title}</AppText>
          {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={{ width: '40%', height: 100 }} />}
        </View>
      </TouchableOpacity>
    );
  }

  renderHeader = (item) => {
    return (
      <View style={styles.headerContainer}>
        <AppText style={styles.headerTitle}>{item.title || ''}</AppText>
      </View>
    );
  }

  render() {
    const { isRefreshing, onRefresh, knowledges } = this.props;
    return (
      <View
        style={{ flex: 1 }}  
      >
        <FlatList
          data={knowledges}
          initialNumToRender={5}
          renderItem={this.renderKnowledgeRow}
          keyExtractor={(item, index) => item.id || index.toString()}
          refreshControl={
            <RefreshControl
              style={{ backgroundColor: 'trasparent' }}
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={Colors.neutral4}
            />
          }
        />
      </View>
    );
  }
}

export default Knowledges;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginTop: 6,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  newsContainer: {},
  textLabel: {
    marginLeft: 16,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  bannerTitle: {
    flex: 1,
    color: Colors.primary1,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0,
    marginLeft: 16,
  },
  bannerTitleRight: {
    flex: 1,
    color: '#29ae06',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0,
    marginRight: 16,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 20,
  },
  headerTitle: {
    opacity: 0.6,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: Colors.primary4,
  },
  lastBanner: {
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
});
