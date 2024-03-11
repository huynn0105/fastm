import { Image, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo } from 'react';
import Colors from '../../../theme/Color';
import { SW } from '../../../constants/styles';
import AppText from '../../../componentV3/AppText';
import { getNumberDayBetween } from '../../../utils/dateHelper';
import moment from 'moment';
import { ICON_PATH } from '../../../assets/path';

const ProjectWaitingItem = memo(({ item, index, isItemFirstList, isItemLastList, onPress }) => {
  return (
    <TouchableWithoutFeedback>
      <View>
        <TouchableOpacity disabled={!item?.url_detail} onPress={onPress}>
          {(item?.money && item?.term && item?.loan_bank?.length) || item?.demand_text ? (
            <View
              style={{
                marginHorizontal: SW(16),
                padding: 12,
                backgroundColor: Colors.blue3,
                borderRadius: 8,
                marginTop: isItemFirstList ? 0 : 12,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <AppText semiBold style={{ fontSize: 14, lineHeight: 20, color: '#f58c14' }}>
                  {item?.demand_type}
                </AppText>
                <View style={{ flexDirection: 'row', alignItems: 'center', opacity: 0.8 }}>
                  <AppText
                    style={{
                      fontSize: 12,
                      lineHeight: 16,
                      color: Colors.primary5,
                    }}
                  >
                    {getNumberDayBetween(moment(item?.updatedDate || item?.created_at).valueOf())}
                  </AppText>
                  {item?.url_detail ? (
                    <Image
                      source={ICON_PATH.arrow_right}
                      style={{
                        marginLeft: 6,
                        width: 16,
                        height: 16,
                        tintColor: Colors.primary5,
                      }}
                    />
                  ) : null}
                </View>
              </View>
              {item?.demand_text ? (
                <AppText
                  style={{ fontSize: 14, lineHeight: 20, color: Colors.primary5, marginTop: 4 }}
                >
                  {item?.demand_text}
                </AppText>
              ) : null}
              {item?.credits_suitable_text?.length ? (
                <>
                  <AppText
                    semiBold
                    style={{ fontSize: 14, lineHeight: 20, color: '#f58c14', marginTop: 8 }}
                  >
                    Hồ sơ có thể cung cấp:
                  </AppText>
                  <AppText
                    style={{ fontSize: 14, lineHeight: 20, color: Colors.primary5, marginTop: 2 }}
                  >
                    {item?.credits_suitable_text}
                  </AppText>
                </>
              ) : null}
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ProjectWaitingItem;
