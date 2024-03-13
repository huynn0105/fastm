import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CustomLineChart from './CustomLineChart';
import HeaderSection from '../../Collaborator/common/HeaderSection';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { formatNumber } from '../../../utils/Utils';
import IconUpDown from '../../Collaborator/common/IconUpDown';
import { ButtonFilter } from '../../Collaborator/common/FilterCollaborator';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import ListCheckBox from '../common/ListCheckBox';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { getStatisticCustomerByDate } from '../../../redux/actions/actionsV3/customerAction';
import Indicator from '../../../componentV3/Indicator/Indicator';

const CustomerByTimeContent = (props) => {
  const dispatch = useDispatch();

  const [data, setData] = useState({});
  const [time, setTime] = useState(moment());
  const [idSelected, setIdSelected] = useState('year');
  const [isLoading, setIsLoading] = useState(false);

  const bottomSheetRef = useRef();
  const dataSelect = useRef();
  const idTempSelected = useRef();

  const onOpenBottomSheet = useCallback(
    (key) => {
      dataSelect.current = {
        key,
        data: [
          { id: 'year', title: 'Thống kê theo tháng trong năm' },
          { id: 'month', title: 'Thống kê theo ngày trong tháng' },
        ],
        idSelected: idSelected,
      };

      bottomSheetRef.current.open('Lọc');
    },
    [idSelected],
  );
  const onCheckboxSelected = useCallback((ids) => {
    idTempSelected.current = ids?.[0];
  }, []);
  const onConfirmSelected = useCallback(() => {
    if (idTempSelected.current) {
      setIdSelected(idTempSelected.current);
    }
    bottomSheetRef.current.close();
  }, []);

  const onGetData = useCallback(() => {
    const payload = {
      month: idSelected === 'year' ? '-1' : time.format('M'),
      year: time.format('YYYY'),
      // month: '-1',
      // year: '2023',
    };
    setIsLoading(true);
    dispatch(
      getStatisticCustomerByDate(payload, (isSuccess, result) => {
        if (isSuccess) {
          setData(result);
        }
        setIsLoading(false);
      }),
    );
  }, [dispatch, idSelected, time]);

  useEffect(() => {
    onGetData();
  }, [onGetData]);

  useEffect(() => {
    if (!props?.isRefreshing) return;
    onGetData();
  }, [onGetData, props?.isRefreshing]);

  return (
    <>
      <HeaderSection title={'Khách hàng theo thời gian'} style={{ marginTop: 12 }} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View>
            <AppText style={styles.textSmall}>Khách hàng được tạo mới</AppText>
            <View style={styles.row}>
              <AppText style={styles.textLarge} semiBold>
                {formatNumber(data?.total)} người
              </AppText>
              {data?.percent && data?.percent !== 0 ? (
                <IconUpDown
                  style={{ marginLeft: 8 }}
                  up={data?.percent >= 0}
                  value={Math.abs(data?.percent || 0)}
                />
              ) : null}
            </View>
          </View>
          <ButtonFilter
            keyData={'level'}
            style={{ flex: 0, backgroundColor: Colors.neutral5, borderWidth: 0 }}
            textStyle={{ flex: 0 }}
            placeholder={
              idSelected === 'year' ? `Năm ${time.format('YYYY')}` : `Tháng ${time.format('MM')}`
            }
            onPress={onOpenBottomSheet}
          />
        </View>
        <CustomLineChart
          data={data?.data?.map((it) => it?.count)}
          dataLabel={data?.data?.map((it) => it?.day || it?.month_year)}
        />
        {isLoading ? (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Indicator />
          </View>
        ) : null}
        <BottomActionSheet
          ref={bottomSheetRef}
          render={() => (
            <ListCheckBox
              data={dataSelect.current.data}
              onCheckboxSelected={onCheckboxSelected}
              hideButtonAll
              initIdsSelected={idSelected}
              vertical
              isCheckBox
            />
          )}
          canClose={true}
          haveCloseButton={true}
          onPressDone={onConfirmSelected}
        />
      </View>
    </>
  );
};

export default CustomerByTimeContent;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: Colors.primary5,
    paddingTop: 16,
    paddingBottom: 12,
    paddingRight: 8,
    marginBottom: 32,
    marginTop: 8,
  },
  textSmall: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  textLarge: {
    fontSize: 18,
    lineHeight: 26,
    color: Colors.gray1,
  },
  headerContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
