import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import IconUpDown from './IconUpDown';
import { ICON_PATH } from '../../../assets/path';
import { prettyNumberString } from '../../../utils/Utils';
import { TouchableWithoutFeedback } from 'react-native';

const formatNumber = (number) => prettyNumberString(number, true);

const ListDetailChart = memo((props) => {
  const { data, unit, onPressItem, type, disabledHightLight, showDescription, onPressName } = props;
  const [key, setKey] = useState();

  const renderItem = useCallback(
    (item, index, allData) => {
      const isBottomLine = allData?.length % 2 !== 0 && index === allData?.length - 2;

      const isEven = index % 2 === 0;
      const isActive = key === item?.key && !disabledHightLight;

      return (
        <TouchableWithoutFeedback
          onPress={() => {
            onPressItem?.(item);
            setKey(item?.key);
          }}
        >
          <View
            key={index}
            style={[
              styles.itemContainer,
              isEven ? { paddingRight: 12 } : { paddingLeft: 12 },
              isActive && { backgroundColor: Colors.blue6 },
            ]}
          >
            <View style={styles.rowContainer}>
              <View style={styles.row}>
                <Image
                  style={[styles.icon, { tintColor: item?.background }]}
                  source={ICON_PATH.pie}
                />
                <AppText style={styles.percent}>{item?.currentGrowth}%</AppText>
              </View>
              {item?.statusGrowth?.length ? (
                <IconUpDown up={item?.statusGrowth === 'up'} value={item?.salesGrowth} />
              ) : null}
            </View>
            <AppText medium style={styles.value}>
              {!isNaN(Number(item?.value))
                ? `${formatNumber(item?.value || 0)} ${unit}`
                : item?.value}
            </AppText>
            <AppText
              medium
              style={styles.name}
              onPress={
                onPressName
                  ? () => {
                      onPressName?.(item);
                    }
                  : null
              }
            >
              {item?.name}
            </AppText>
            {showDescription ? (
              <AppText medium style={styles.name}>
                {item?.name}
              </AppText>
            ) : null}

            {isEven ? <View style={styles.colLine} /> : null}
            {index > 1 ? (
              <View
                style={[
                  styles.rowLine,
                  {
                    top: -0.5,
                  },
                  isEven ? { marginRight: 12 } : { marginLeft: 12 },
                ]}
              />
            ) : null}
            {isBottomLine ? (
              <View
                style={[
                  styles.rowLine,
                  isEven ? { marginRight: 12 } : { marginLeft: 12 },
                  { bottom: -0.5 },
                ]}
              />
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [disabledHightLight, key, onPressItem, onPressName, showDescription, unit],
  );

  useEffect(() => {
    setKey();
  }, [type]);

  return <View style={styles.container}>{data?.map(renderItem)}</View>;
});

export default ListDetailChart;

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 4,
  },
  itemContainer: {
    width: '50%',
    paddingVertical: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 23,
    height: 16,
    resizeMode: 'contain',
  },
  percent: {
    fontSize: 14,
    color: Colors.gray5,
    lineHeight: 20,
    marginLeft: 8,
  },
  value: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray1,
    marginTop: 8,
  },
  name: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginTop: 2,
  },
  colLine: {
    width: 1,
    height: '100%',
    marginVertical: 8,
    backgroundColor: Colors.gray4,
    position: 'absolute',
    right: -0.5,
  },
  rowLine: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.gray4,
    position: 'absolute',
  },
});
