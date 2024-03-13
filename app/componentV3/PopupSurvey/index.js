import React, { useState, useEffect, useCallback } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import { fonts } from '../../constants/configs';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import { logCustomAttribute, removeVietnameseTones } from '../../tracking/Firebase';
import AppText from '../AppText';
import SelectionList from './SelectionList';

const PopupSurvey = ({
  isVisible,
  title,
  listAnswer,
  contentStep1,
  imageUri,
  onAnswer,
  onDismiss,
  dismissTitle,
  actionTitle,
  numberOfButtons,
  userMetaData,
  onAnswerStep2,
  contentStep2,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isEmptyStep2, setIsEmptyStep2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [step2Answer, setStep2Answer] = useState([]);

  const onChooseAnswer = (index) => {
    setSelectedIndex(index);
  };

  const onPressAnswerStep0 = () => {
    if (selectedIndex === -1) {
      setIsEmpty(true);

      return;
    }
    setIsLoading(true);

    if (!!userMetaData?.isCTVConfirmed) {
      const jsonData = [
        { id: contentStep1?.id, value: contentStep1?.options?.[selectedIndex]?.value },
      ];
      onAnswer(
        jsonData,
        () => {
          setIsLoading(false);
        },
        true,
      );
    } else {
      setIsLoading(false);

      setStep(1);
    }
  };

  useEffect(() => {
    if (selectedIndex !== -1) {
      setIsEmpty(false);
    }
  }, [selectedIndex]);

  const renderListAnswer = ({ item, index }) => {
    const { title, value } = item;
    const isSelected = selectedIndex === index;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SH(20) }}>
        <TouchableWithoutFeedback onPress={() => onChooseAnswer(index)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.answerBoxStyle,
                {
                  borderColor: isEmpty ? Colors.accent3 : !isSelected ? '#CFD3D6' : Colors.primary2,
                },
              ]}
            >
              {isSelected ? (
                <View
                  style={{
                    width: SW(16),
                    height: SW(16),
                    borderRadius: SW(8),
                    backgroundColor: Colors.primary2,
                  }}
                />
              ) : null}
            </View>
            <AppText
              style={[
                styles.smallTextStyle,
                { fontFamily: isSelected ? fonts.bold : fonts.medium },
              ]}
            >
              {title}
            </AppText>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const onPressAnswerStep2 = () => {
    if (Object.keys(step2Answer)?.length === contentStep2?.length) {
      const jsonData = [
        ...step2Answer,
        { id: contentStep1?.id, value: contentStep1?.options?.[selectedIndex]?.value },
      ];

      onAnswer(jsonData, () => setIsLoading(false), true);
      step2Answer.map((answer) => {
        logCustomAttribute(
          removeVietnameseTones(answer?.desc),
          removeVietnameseTones(answer?.title),
        );
      });

      // onDismiss();
    } else {
      // onDismiss();
      setIsEmptyStep2(true);

      return;
    }
  };

  const renderBottomButtonStep2 = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#e6ebff',
          height: SH(50),
          // borderRadius: 16,
        }}
      >
        <TouchableOpacity
          onPress={onPressAnswerStep2}
          disabled={isLoading}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          {!isLoading ? (
            <AppText bold style={[styles.textStyleButton, { color: 'rgb(0,95,255)' }]}>
              Hoàn tất
            </AppText>
          ) : (
            <ActivityIndicator color={Colors.primary2} size={'small'} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderBottomButton = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#e6ebff',
          height: SH(50),
          // borderRadius: 16,
        }}
      >
        {numberOfButtons === 2 ? (
          <View>
            <TouchableOpacity
              onPress={onDismiss}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <AppText medium style={[styles.textStyleButton, { color: Colors.primary3 }]}>
                {dismissTitle}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressAnswerStep0}
              disabled={isLoading}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              {!isLoading ? (
                <AppText bold style={[styles.textStyleButton, { color: 'rgb(0,95,255)' }]}>
                  {actionTitle}
                </AppText>
              ) : (
                <ActivityIndicator color={Colors.primary2} size={'small'} />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={onPressAnswerStep0}
            disabled={isLoading}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            {!isLoading ? (
              <AppText bold style={[styles.textStyleButton, { color: 'rgb(0,95,255)' }]}>
                {actionTitle}
              </AppText>
            ) : (
              <ActivityIndicator color={Colors.primary2} size={'small'} />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const onChangeFormSurvey = (id, value, title, desc) => {
    const findIndex = step2Answer?.findIndex((answer) => answer.id === id);
    if (findIndex === -1) {
      step2Answer.push({ id, value, title, desc });
      setStep2Answer([...step2Answer]);
    } else {
      step2Answer.map((answer) => {
        if (answer?.id === id) {
          answer.value = value;
        }
        return answer;
      });
      setStep2Answer([...step2Answer]);
    }
  };

  const renderItemQuestionStep2 = useCallback(
    (id, title, type, options, dataType) => {
      if (type === 'check_list') {
        const indexList = step2Answer.findIndex((step) => step?.id === id);

        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: SH(12),
            }}
          >
            <View style={{ flex: 0.4 }}>
              <AppText style={{ fontSize: SH(13), lineHeight: SH(18), color: Colors.gray1 }}>
                {title}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                flex: 1,
              }}
            >
              {options.map((option, index) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      onChangeFormSurvey(id, option.value, option?.title, title);
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={[styles.answerBoxStyle]}>
                        <View
                          style={{
                            width: SW(14),
                            height: SW(14),
                            borderRadius: SW(7),
                            backgroundColor:
                              step2Answer?.[indexList]?.value === option?.value
                                ? Colors.primary2
                                : 'transparent',
                          }}
                        />
                      </View>
                      <AppText style={{ marginLeft: SW(8) }}>{option.title}</AppText>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          </View>
        );
      } else if (type === 'selection_list') {
        const arrayOptionsRender = [];
        options.map((option) => {
          arrayOptionsRender.push({
            value: option.title,
            answer: option.value,
          });
          return option;
        });

        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flex: 0.4,
                justifyContent: 'center',
                // backgroundColor: 'red',
                // marginTop: SH(24),
              }}
            >
              <AppText style={{ fontSize: SH(13), lineHeight: SH(18), color: Colors.gray1 }}>
                {title}
              </AppText>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-around',
                flex: 1,
                marginBottom: SH(12),
                // backgroundColor: 'red',
              }}
            >
              {/* <Dropdown
                data={arrayOptionsRender}
                containerStyle={{ width: SW(160) }}
                onChangeText={(item, index, data) => onChangeFormSurvey(id, data[index].answer)}
                fontSize={SH(13)}
                dropdownOffset={{ top: 0 }}
              /> */}
              {/* {renderSelectionList(options, id)} */}
              <SelectionList
                data={options}
                id={id}
                step2Answer={step2Answer}
                onChangeFormSurvey={(id, value, desc) => onChangeFormSurvey(id, value, desc, title)}
              />
            </View>
          </View>
        );
      } else {
        return null;
      }
    },
    [step2Answer],
  );

  useEffect(() => {
    setIsEmptyStep2(false);
  }, [step2Answer]);

  const renderViewStep2 = () => {
    return (
      <View style={{ paddingTop: SH(16) }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',

            paddingHorizontal: SH(16),
          }}
        >
          <AppText bold style={styles.textStyle}>
            Một số thông tin thêm về bạn
          </AppText>
        </View>
        <View style={{ marginBottom: SH(20), alignSelf: 'center' }}>
          {isEmptyStep2 ? (
            <View style={{ paddingTop: SH(7), flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={ICON_PATH.warning}
                style={{ width: SW(16), height: SH(16), resizeMode: 'contain' }}
              />
              <AppText style={[styles.errorText, { marginLeft: SH(2) }]}>
                Vui lòng trả lời các câu hỏi dưới đây
              </AppText>
            </View>
          ) : null}
        </View>
        <View style={{ paddingHorizontal: SH(16) }}>
          {contentStep2.map((item) => {
            return renderItemQuestionStep2(
              item.id,
              item.title,
              item.type,
              item.options,
              item.dataType,
            );
          })}
        </View>
        <View style={{ marginTop: SH(16) }}>{renderBottomButtonStep2()}</View>
      </View>
    );
  };
  return (
    <Modal
      isVisible={isVisible}
      useNativeDriver
      animationIn="zoomIn"
      animationOut="zoomOut"
      // style={{ borderRadius: 16, overflow: 'hidden' }}
    >
      <View style={{ backgroundColor: Colors.primary5, overflow: 'hidden', borderRadius: 16 }}>
        {step === 0 ? (
          <View>
            <View style={{ paddingHorizontal: SH(16), paddingTop: SH(16) }}>
              <AppText medium style={styles.textStyle}>
                {contentStep1?.title}
              </AppText>
              {isEmpty ? (
                <View style={{ paddingTop: SH(7), flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={ICON_PATH.warning}
                    style={{ width: SW(16), height: SH(16), resizeMode: 'contain' }}
                  />
                  <AppText style={[styles.errorText, { marginLeft: SH(2) }]}>
                    Vui lòng chọn 1 trong 4 đáp án dưới đây
                  </AppText>
                </View>
              ) : null}
              <View>
                <FlatList
                  data={contentStep1?.options}
                  renderItem={renderListAnswer}
                  keyExtractor={(item) => `${item.id}`}
                  style={{ marginTop: SH(14) }}
                  scrollEnabled={false}
                />
                <Image
                  style={{
                    position: 'absolute',
                    right: SW(4),
                    width: SW(118),
                    height: SH(88),
                    resizeMode: 'contain',
                    top: SH(28),
                  }}
                  source={imageUri ? imageUri : IMAGE_PATH.surveyImage}
                />
              </View>
            </View>
            {renderBottomButton()}
          </View>
        ) : (
          renderViewStep2()
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.darkLight,
  },
  smallTextStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: 'rgb(11,11,54)',
    marginLeft: SW(12),
  },
  textStyleButton: {
    fontSize: SH(14),
    lineHeight: SH(20),
  },
  answerBoxStyle: {
    width: SW(24),
    height: SW(24),
    borderRadius: SW(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  errorText: {
    fontSize: SH(12),
    lineHeight: SH(14),
    color: '#bc0f23',
  },
});

export default PopupSurvey;
