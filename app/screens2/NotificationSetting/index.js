import React, { PureComponent } from 'react';
import { Text, View, FlatList, Alert } from 'react-native';

import { SafeAreaView } from 'react-navigation';

// styles
import styles from './styles';
import Colors from '../../theme/Color';

// components
import NotificationSettingItem from './NotificationSettingItem';
import { renderNavigation } from '../../components/Navigation';
import AppText from '../../componentV3/AppText';

import DigitelClient from '../../network/DigitelClient';

class NotificationSetting extends PureComponent {
  state = {
    data: [],
  };

  componentDidMount() {
    this.fetchListNotificationSetting();
  }

  fetchListNotificationSetting = () => {
    DigitelClient.apiGetListNotificationSetting()
      .then((results) => {
        if (Array.isArray(results) && results.length > 0) {
          this.setState({ data: results });
        }
      })
      .catch(() => {});
  };

  onToggleSettingNotification = (item) => () => {
    const { data } = this.state;
    const newData = data.map((i) => {
      if (item.ID === i.ID) return { ...i, subs_status: item.subs_status === '1' ? '0' : '1' };
      return i;
    });
    DigitelClient.apiSubscribeNotificationSetting({
      categoryID: item.ID,
      status: item.subs_status === '1' ? '0' : '1',
    })
      .then((results) => {
        if (!results.status) {
          Alert.alert(
            item.name,
            'Cập nhật trạng thái không thành công, vui lòng thử lại.',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.fetchListNotificationSetting();
                },
              },
            ],
            { cancelable: false },
          );
        }
      })
      .catch(() => {
        Alert.alert(
          item.name,
          'Cập nhật trạng thái không thành công, vui lòng thử lại.',
          [
            {
              text: 'OK',
              onPress: () => {
                this.fetchListNotificationSetting();
              },
            },
          ],
          { cancelable: false },
        );
      });
    this.setState({ data: newData });
  };


  keyExtractor = (item) => item.ID;

  onBackPress = () => {
    this.props.navigation.goBack();
  };

  renderNavigation = () => {
    return renderNavigation({
      onBackPress: this.onBackPress,
      title: 'Thiết lập thông báo',
      backgroundHeader: Colors.primary6,
    });
  };

  renderHeaderList = () => <AppText style={styles.titleH1}>Các loại thông báo trên Mfast</AppText>;

  renderItemNotificationSetting = ({ item }) => (
    <NotificationSettingItem
      id={item.ID}
      isActive={item.subs_status === '1'}
      title={item.name}
      description={item.description}
      onToggleSettingNotification={this.onToggleSettingNotification(item)}
    />
  );

  itemSeparatorComponent = () => <View style={styles.divider} />;

  render() {
    const { data } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        {/* {this.renderNavigation()} */}
        <View style={styles.container}>
          <FlatList
            data={data}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItemNotificationSetting}
            ItemSeparatorComponent={this.itemSeparatorComponent}
            ListHeaderComponent={this.renderHeaderList()}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

NotificationSetting.navigationOptions = () => {
  return {
    title: ' ',
    header: null,
  };
};

export default NotificationSetting;
