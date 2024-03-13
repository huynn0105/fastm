import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { FILTER_LIST } from '../RegisterReferral.constants';
import DigitelClient from '../../../network/DigitelClient';
import { useSelector } from 'react-redux';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import WheelPickAndSearch from './WheelPickAndSearch';

const FilterSupporter = memo((props) => {
  const { onChangeFilter, onReadyCallApi } = props;

  const address = useSelector((state) => state?.userMetaData?.data?.district?.toLowerCase?.());

  const [filterID, setFilterID] = useState(
    FILTER_LIST?.[Math.floor(Math.random() * FILTER_LIST?.length)]?.id,
  );

  const [provinceID, setProvinceID] = useState();

  const [districtID, setDistrictID] = useState();

  const [listProvince, setListProvince] = useState([]);

  const [listDistrict, setListDistrict] = useState([]);

  const bottomSheetRef = useRef();

  const dataBottomSheet = useRef();

  const idSelected = useRef();

  const titleFilter = useMemo(() => {
    let title = FILTER_LIST?.find((item) => item?.id === filterID)?.title;
    // if (title) {
    //   title = `Top 20 dẫn dắt ${title.charAt(0).toLowerCase() + title.slice(1)}`;
    // }
    return title;
  }, [filterID]);
  const titleProvince = useMemo(() => {
    return listProvince?.find((item) => item?.id === provinceID)?.title;
  }, [listProvince, provinceID]);
  const titleDistrict = useMemo(() => {
    if (!provinceID) {
      setDistrictID();
      return;
    }
    return listDistrict?.find((item) => item?.id === districtID)?.title;
  }, [districtID, listDistrict, provinceID]);

  const setDefaultProvince = useCallback(
    (data) => {
      const province = data?.find((item) => {
        return address?.includes(item?.title?.toLowerCase?.());
      });
      setProvinceID(province?.id);
    },
    [address],
  );

  const formatData = useCallback((data) => {
    if (!data?.length) {
      return [];
    }
    return data?.map((item, index) => ({
      id: index + 1,
      title: item,
    }));
  }, []);

  const getListProvince = useCallback(
    async (code) => {
      try {
        const res = await DigitelClient.fetchProvince();
        const data = formatData(res) || [];
        setDefaultProvince(data);
        setListProvince(data);
      } catch (err) {
      } finally {
        onReadyCallApi();
      }
    },
    [formatData, onReadyCallApi, setDefaultProvince],
  );

  const getListDistrict = useCallback(async () => {
    if (!provinceID) return;
    const res = await DigitelClient.mfGetListDistrict({ provinceID });
    const data = Object.keys(res)?.map((key) => ({
      id: key,
      title: res[key]?.split('-')[0],
    }));
    setListDistrict(data);
  }, [provinceID]);

  useEffect(() => {
    getListProvince();
  }, []);

  useEffect(() => {
    getListDistrict();
  }, [getListDistrict]);

  useEffect(() => {
    onChangeFilter?.({
      districtID,
      provinceID,
      group: filterID,
    });
  }, [districtID, filterID, onChangeFilter, provinceID]);

  //!----------------------------------

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef?.current?.close();
  }, []);
  const openBottomSheetFilter = useCallback(() => {
    dataBottomSheet.current = {
      type: 'filter',
      data: FILTER_LIST,
      idSelected: filterID,
    };
    bottomSheetRef?.current?.open('Lọc TOP 20 dẫn dắt');
  }, [filterID]);

  const openBottomSheetProvince = useCallback(() => {
    dataBottomSheet.current = {
      type: 'province',
      data: listProvince,
      idSelected: provinceID || listProvince?.[0]?.id,
    };
    bottomSheetRef?.current?.open('Chọn tỉnh/thành phố');
  }, [listProvince, provinceID]);
  const openBottomSheetDistrict = useCallback(() => {
    if (!provinceID) return;
    dataBottomSheet.current = {
      type: 'district',
      data: listDistrict,
      idSelected: districtID || listDistrict?.[0]?.id,
    };
    bottomSheetRef?.current?.open('Chọn quận/huyện');
  }, [districtID, listDistrict, provinceID]);

  const onPressDone = useCallback(() => {
    closeBottomSheet();
    switch (dataBottomSheet?.current?.type) {
      case 'filter':
        setFilterID(idSelected.current);
        break;
      case 'province':
        setProvinceID(idSelected.current);
        break;
      case 'district':
        setDistrictID(idSelected.current);
        break;
    }
  }, [closeBottomSheet]);

  const onSelected = useCallback((id) => {
    idSelected.current = id;
  }, []);
  const onPressSelected = useCallback(
    (id) => {
      idSelected.current = id;
      onPressDone();
    },
    [onPressDone],
  );

  return (
    <>
      <AppText style={styles.header}>Đề xuất cho bạn</AppText>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={openBottomSheetFilter}>
          <View
            style={[
              styles.row,
              { height: 40, borderBottomWidth: 1, borderBottomColor: Colors.neutral5 },
            ]}
          >
            <Image source={ICON_PATH.sort} style={styles.iconFilter} />
            <AppText medium style={[styles.titleFilter, { flex: 1 }]} numberOfLines={1}>
              {titleFilter}
            </AppText>
          </View>
        </TouchableWithoutFeedback>
        <View style={[styles.row, { height: 40 }]}>
          <TouchableWithoutFeedback onPress={openBottomSheetProvince}>
            <View
              style={[
                styles.row,
                { flex: 1, borderRightWidth: 1, borderRightColor: Colors.neutral5 },
              ]}
            >
              <Image source={ICON_PATH.marker} style={styles.iconFilter} />
              <AppText
                medium
                style={[
                  styles.titleFilter,
                  { flex: 1, color: titleProvince ? Colors.gray1 : Colors.gray5 },
                ]}
                numberOfLines={1}
              >
                {titleProvince || 'Tỉnh/Thành phố'}
              </AppText>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={openBottomSheetDistrict}>
            <View style={{ flex: 1, paddingLeft: 12 }}>
              <AppText
                medium
                style={[styles.titleFilter, { color: titleDistrict ? Colors.gray1 : Colors.gray5 }]}
                numberOfLines={1}
              >
                {titleDistrict || 'Quận/Huyện'}
              </AppText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <WheelPickAndSearch
            data={dataBottomSheet.current.data}
            onSelected={onSelected}
            onPressSelected={onPressSelected}
            initIdSelected={dataBottomSheet.current?.idSelected}
            textColorActive={Colors.primary2}
          />
        )}
        canClose={true}
        haveCloseButton={true}
        onPressDone={onPressDone}
        avoidKeyboard
      />
    </>
  );
});

export default FilterSupporter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray4,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray5,
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconFilter: {
    width: 20,
    height: 20,
    tintColor: Colors.gray5,
    marginRight: 12,
  },
  titleFilter: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
});
