import React, { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ICON_PATH } from '../../../assets/path';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import AppText from '../../../componentV3/AppText';
import commonStyle, { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { LIST_STATUS_RSM, LIST_TYPE_RSM, STATUS_RSM, TOP_GVM } from '../RSMPushMessage.constant';
import { styles } from '../RSMPushMessage.style';

const FilterButton = ({ onSubmitCondition }) => {
  const [typeRSM, setTypeRSM] = useState(1);
  const [statusRSM, setStatusRSM] = useState(STATUS_RSM.ONLINE);
  const [topRSM, setTopRsm] = useState(0);
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    onSubmitCondition(typeRSM, statusRSM, topRSM);
  }, []);

  const renderFilterViewTypeRSM = () => {
    return (
      <View
        style={[
          styles.paddingView,
          {
            marginBottom: SH(12),
          },
        ]}
      >
        <View style={{ marginBottom: SH(8) }}>
          <AppText style={commonStyle.mediumText}>Theo loại cộng tác viên</AppText>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          bounces={false}
          contentContainerStyle={[{ flexWrap: 'wrap', width: SW(400) }]}
        >
          {LIST_TYPE_RSM.map((rsm, index) => {
            const isSelected = rsm.value === typeRSM;
            return (
              <TouchableOpacity
                key={rsm?.id}
                onPress={() => onSelectCondition('depth', rsm?.value)}
              >
                <View
                  style={[
                    styles.containerItemFilter,
                    {
                      backgroundColor: isSelected ? Colors.primary2 : Colors.actionBackground,
                      marginRight: SW(8),
                      marginBottom: SH(12),
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.textItemFilter,
                      { color: isSelected ? Colors.primary5 : Colors.gray1 },
                    ]}
                  >
                    {isSelected ? rsm.label : rsm.labelUnfocus}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderFilterViewTypeOnline = () => {
    return (
      <View
        style={[
          styles.paddingView,
          {
            marginBottom: SH(12),
            marginTop: 0,
          },
        ]}
      >
        <View style={{ marginBottom: SH(8) }}>
          <AppText style={commonStyle.mediumText}>Theo trạng thái</AppText>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          bounces={false}
          contentContainerStyle={[{ flexWrap: 'wrap', width: SW(400) }]}
        >
          {LIST_STATUS_RSM.map((rsm, index) => {
            const isSelected = rsm.value === statusRSM;
            return (
              <TouchableOpacity
                key={rsm?.id}
                onPress={() => onSelectCondition('status', rsm?.value)}
              >
                <View
                  style={[
                    styles.containerItemFilter,
                    {
                      backgroundColor: isSelected ? Colors.primary2 : Colors.actionBackground,
                      marginRight: SW(8),
                      marginBottom: SH(12),
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.textItemFilter,
                      { color: isSelected ? Colors.primary5 : Colors.gray1 },
                    ]}
                  >
                    {rsm?.label}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  const renderFilterTop = () => {
    return (
      <View
        style={[
          styles.paddingView,
          {
            marginBottom: SH(12),
            marginTop: 0,
          },
        ]}
      >
        <View style={{ marginBottom: SH(8) }}>
          <AppText style={commonStyle.mediumText}>Theo top doanh số</AppText>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          bounces={false}
          contentContainerStyle={[{ flexWrap: 'wrap', width: SW(400) }]}
        >
          {TOP_GVM.map((rsm, index) => {
            const isSelected = rsm.value === topRSM;
            return (
              <TouchableOpacity key={rsm?.id} onPress={() => onSelectCondition('top', rsm?.value)}>
                <View
                  style={[
                    styles.containerItemFilter,
                    {
                      backgroundColor: isSelected ? Colors.primary2 : Colors.actionBackground,
                      marginRight: SW(8),
                      marginBottom: SH(12),
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.textItemFilter,
                      { color: isSelected ? Colors.primary5 : Colors.gray1 },
                    ]}
                  >
                    {rsm?.label}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  const renderBottomSheetView = useCallback(() => {
    return (
      <View style={styles.paddingBottomSheet}>
        {renderFilterViewTypeRSM()}
        {renderFilterViewTypeOnline()}
        {renderFilterTop()}
        {renderConfirmButton()}
        {renderButtonRemoveFilter()}
      </View>
    );
  }, [typeRSM, statusRSM, topRSM, onSubmitCondition, removeFilter, submitFilterCondition]);

  const openActionSheet = () => {
    bottomSheetRef.current?.open();
  };

  const submitFilterCondition = useCallback(() => {
    bottomSheetRef?.current?.close();
    setTimeout(() => {
      onSubmitCondition(typeRSM, statusRSM, topRSM);
    }, 500);
  }, [typeRSM, statusRSM, topRSM, onSubmitCondition]);

  const renderConfirmButton = () => {
    return (
      <TouchableOpacity onPress={submitFilterCondition}>
        <View style={styles.confirmButtonView}>
          <AppText medium style={[commonStyle.mediumText, { color: Colors.primary5 }]}>
            Chọn đối tượng
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  const removeFilter = () => {
    // setCondition(DEFAULT_CONDITION);
    setTypeRSM('all');
    setStatusRSM(STATUS_RSM.ALL);
    setTopRsm(0);
  };

  const renderButtonRemoveFilter = () => {
    return (
      <TouchableOpacity onPress={removeFilter}>
        <View style={styles.removeFilterButton}>
          <AppText style={styles.bigText}>Bỏ bộ lọc</AppText>
        </View>
      </TouchableOpacity>
    );
  };

  const onSelectCondition = useCallback((fieldName, value) => {
    if (fieldName === 'depth') {
      setTypeRSM(value);
    } else if (fieldName === 'status') {
      setStatusRSM(value);
    } else {
      setTopRsm(value);
    }
  }, []);

  const getFilterNumber = useCallback(() => {
    let numberValue = 0;
    if (typeRSM > 0) {
      numberValue++;
    }
    if (statusRSM?.length > 0) {
      numberValue++;
    }
    if (topRSM > 0) {
      numberValue++;
    }

    return numberValue;
  }, [statusRSM, topRSM, typeRSM]);

  const onRemoveTypeRSM = useCallback(() => {
    setTypeRSM((prevState) => {
      const newState = '';
      onSubmitCondition(newState, statusRSM, topRSM);
      return newState;
    });
  }, [onSubmitCondition, statusRSM, topRSM]);

  const onRemoveStatusRSM = useCallback(() => {
    setStatusRSM((prevState) => {
      const newState = '';
      onSubmitCondition(typeRSM, newState, topRSM);
      return newState;
    });
  }, [onSubmitCondition, topRSM, typeRSM]);

  const onRemoveTopRSM = useCallback(() => {
    setTopRsm(0);
    onSubmitCondition(typeRSM, statusRSM, 0);
  }, [onSubmitCondition, statusRSM, typeRSM]);

  const renderFilteredItem = useCallback(() => {
    const labelTypeRsm = LIST_TYPE_RSM.find((rsm) => rsm?.value === typeRSM);
    const labelStatusRsm = LIST_STATUS_RSM.find((rsm) => rsm?.value === statusRSM);
    return (
      <View style={{ flexDirection: 'row' }}>
        {labelTypeRsm?.value ? (
          <View style={styles.containerItemFiltered}>
            <AppText style={styles.popupTextStyle}>{labelTypeRsm?.label}</AppText>
            <TouchableWithoutFeedback onPress={onRemoveTypeRSM}>
              <Image source={ICON_PATH.close1} style={styles.deleteIcon} />
            </TouchableWithoutFeedback>
          </View>
        ) : null}
        {labelStatusRsm?.value ? (
          <View style={styles.containerItemFiltered}>
            <AppText style={styles.popupTextStyle}>{labelStatusRsm?.label}</AppText>
            <TouchableWithoutFeedback onPress={onRemoveStatusRSM}>
              <Image source={ICON_PATH.close1} style={styles.deleteIcon} />
            </TouchableWithoutFeedback>
          </View>
        ) : null}
        {topRSM ? (
          <View style={styles.containerItemFiltered}>
            <AppText style={styles.popupTextStyle}>{topRSM ? `TOP${topRSM}` : ''}</AppText>
            <TouchableWithoutFeedback onPress={onRemoveTopRSM}>
              <Image source={ICON_PATH.close1} style={styles.deleteIcon} />
            </TouchableWithoutFeedback>
          </View>
        ) : null}
      </View>
    );
  }, [onRemoveTypeRSM, onRemoveStatusRSM, topRSM, onRemoveTopRSM, typeRSM, statusRSM]);

  return (
    <View>
      <TouchableOpacity onPress={openActionSheet}>
        <View style={styles.containerFilterButton}>
          <View style={styles.rowView}>
            <FastImage
              style={styles.iconStyle}
              source={ICON_PATH.iconFilter}
              resizeMode={FastImage.resizeMode.contain}
            />
            <AppText
              medium
              style={[commonStyle.mediumText, { color: Colors.gray1, marginLeft: SW(12) }]}
            >
              {`Đã lọc ${getFilterNumber()} nhóm đối tượng`}
            </AppText>
          </View>
          <View>
            <FastImage
              style={[styles.iconStyle, { tintColor: Colors.gray1 }]}
              source={ICON_PATH.dropdown_un}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={{ marginTop: SH(8) }}>{renderFilteredItem()}</View>

      <BottomActionSheet
        ref={(ref) => (bottomSheetRef.current = ref)}
        headerText={'Đối tượng muốn gửi'}
        haveCloseButton={true}
        render={renderBottomSheetView}
      />
    </View>
  );
};

export default memo(forwardRef(FilterButton));
