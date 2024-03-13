import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import GridList from '../../componentV3/GridList';
import DPDControl from './DPDControl';
import HeaderSection from './HeaderSection';
import { SH, SW } from '../../constants/styles';
import { useSelector } from 'react-redux';
import AppText from '../../componentV3/AppText';
import Colors from '../../theme/Color';

const ContentSection = (props) => {
  const { onAllPress, onPress, item, navigation } = props;

  const [data, setData] = useState(item?.items || []);
  const [id, setId] = useState(null);

  // const DPD = useSelector((state) => state?.DPD?.[item?.cat_alias]);
  const DPD = useSelector((state) => state?.DPD);

  const myUser = useSelector((state) => state?.myUser);

  const isFinanceItems = item?.cat_alias === 'finance';

  const listSupGroup = useMemo(() => {
    const list = [];
    const listIdSupGroupItems = item?.items
      ?.filter((it) => it?.sup_group_id)
      ?.map((it) => it?.sup_group_id);

    item?.sup_group?.forEach((it) => {
      if (listIdSupGroupItems?.includes(it?.ID)) {
        list?.push(it);
      }
    });

    return list;
  }, [item]);

  return (
    <View key={`${item.cat_title}`} style={{ marginTop: 28 }}>
      <HeaderSection
        style={{
          marginHorizontal: SW(12),
          marginTop: 0,
          marginBottom: listSupGroup?.length ? 8 : 12,
        }}
        title={item.cat_title}
        onAllPress={onAllPress}
        note={item?.note}
        labelRight={item?.tools_title}
      />
      {/* {!!DPD?.items?.length > 0 && !myUser?.showLegacyList ? (
        <DPDControl navigation={navigation} data={DPD?.items} />
      ) : null} */}
      {isFinanceItems && !!DPD?.items?.length > 0 && !myUser?.showLegacyList ? (
        <DPDControl navigation={navigation} />
      ) : null}
      {listSupGroup?.length ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={listSupGroup}
          renderItem={({ item: it, index: idx }) => {
            const isActive = id === it?.ID;

            return (
              <TouchableOpacity
                onPress={() => {
                  setId((prev) => {
                    if (prev === it?.ID) {
                      setData(item?.items);
                      return null;
                    } else {
                      setData(item?.items?.filter((e) => e?.sup_group_id === it?.ID));
                      return it?.ID;
                    }
                  });
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: idx === 0 ? SW(12) : 0,
                  marginRight: SW(20),
                  paddingBottom: 12,
                }}
              >
                {isActive ? (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 8,
                      backgroundColor: Colors.primary5,
                      borderWidth: 2,
                      borderColor: Colors.primary2,
                      marginRight: SW(6),
                    }}
                  />
                ) : null}
                <AppText
                  style={{
                    color: isActive ? Colors.primary2 : Colors.gray5,
                    fontSize: 13,
                    lineHeight: 18,
                  }}
                >
                  {it?.name}
                </AppText>
              </TouchableOpacity>
            );
          }}
        />
      ) : null}
      <View style={{ backgroundColor: Colors.primary5 }}>
        <GridList
          items={item?.items}
          navigation={navigation}
          onPressItem={onPress}
          alias={item?.cat_alias}
          style={id?.length && { opacity: 0 }}
        />
        {id?.length ? (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 999,
            }}
          >
            <GridList
              items={data}
              navigation={navigation}
              onPressItem={onPress}
              alias={item?.cat_alias}
              style={{
                position: 'absolute',
                zIndex: 999,
              }}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default ContentSection;
