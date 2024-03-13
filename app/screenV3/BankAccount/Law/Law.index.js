import React, { useCallback, useState, useEffect } from 'react';
import {
  Alert,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import PopupDownloadTemp from '../../../componentV3/PopupDownloadTemp';
import SamplePhotoPreview from '../../../componentV3/SamplePhotoPreview';
import AppText from '../../../componentV3/AppText';
import withCameraPicker from '../../../componentV3/HOCs/withCameraPicker';
import CameraOptions from '../../../constants/cameraObjKeys';

import { useActions } from '../../../hooks/useActions';
import {
  dispatchSendTaxCommit,
  dispatchUpdateTaxCommittedPhoto,
} from '../../../redux/actions/actionsV3/tax';

import { STATE } from '../Tax/Tax.contants';

import styles from './Law.style';
import Colors from '../../../theme/Color';

import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import { logEvent } from '../../../tracking/Firebase';
import { STATUS_APPLY_TAX } from '../Tax/Tax.index';
import { SH, SW } from '../../../constants/styles';

const Law = ({
  cameraActionsProps,
  email,
  countryIdNumber,
  taxNumber,
  taxCommittedPhoto,
  onPressRegulationTax,
  previewImageProps,
  jumpTo,
  taxRegisterStatus,
  taxCommittedPhotoStatus,
  taxCommittedPhotoMessage,
  statusApplyTaxNumber,
}) => {
  const [isVisibleSample, setIsVisibleSample] = useState(false);
  const [isVisibleDownload, setIsVisibleDownload] = useState(false);
  const [pathImage, setPathImage] = useState(null);

  const actions = useActions({ dispatchSendTaxCommit, dispatchUpdateTaxCommittedPhoto });

  useEffect(() => {
    if (taxCommittedPhoto !== pathImage) {
      setPathImage(taxCommittedPhoto);
    }
  }, [taxCommittedPhoto]);

  const onSubmit = useCallback(() => {
    if (pathImage) {
      const callBack = (res) => {
        Alert.alert(
          'Cam kết thuế',
          `${res?.message || ''}`,
          [
            {
              text: 'Đóng',
              onPress: () => {},
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      };
      actions.dispatchUpdateTaxCommittedPhoto(pathImage, callBack);
    }
    //
  }, [actions, pathImage]);

  const onPressOpenPickerGalary = useCallback(() => {
    if (pathImage) {
      previewImageProps.setArrImagePreview([pathImage]);
      previewImageProps.onOpenPreviewImage();
      return;
    }
    cameraActionsProps.onOpenCamera(CameraOptions.law, (imgUrl) => {
      setPathImage(imgUrl);
    });
  }, [pathImage, cameraActionsProps, previewImageProps]);

  const onPressRemovePathImage = useCallback(() => {
    setPathImage(null);
  }, []);

  const onCloseDownloadModal = useCallback(() => {
    setIsVisibleDownload(false);
  }, []);

  const onPressDownloadTempleteTax = useCallback(() => {
    logEvent('press_download_tax_commitment');
    setIsVisibleDownload(true);
  }, [actions]);

  const onSendTaxCommit = useCallback(
    (email) => {
      // callback
      const callback = (res) => {
        Alert.alert(
          'Bản cam kết thuế',
          `${res?.message || ''}`,
          [
            {
              text: 'Đóng',
              onPress: () => {},
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      };
      actions.dispatchSendTaxCommit(email, callback);
      setIsVisibleDownload(false);
    },
    [actions],
  );

  const onPressViewTermTax = useCallback(() => {
    if (onPressRegulationTax) {
      onPressRegulationTax();
    }
    //
  }, [onPressRegulationTax]);

  const onSamplePress = useCallback(() => {
    setIsVisibleSample(!isVisibleSample);
  }, [isVisibleSample]);

  const renderResultTaxCommitted = useCallback(() => {
    if (taxCommittedPhotoStatus === 'PENDING') {
      return (
        <View style={styles.resultContainer}>
          <View style={styles.indicatorContainer}>
            <AppText style={styles.indicatorLabel}>Kết quả duyệt cam kết thuế</AppText>
            <View style={styles.raw}>
              <Image source={ICON_PATH.pending} style={styles.icPending} />
              <AppText bold style={styles.indicatorStatus}>
                Chờ duyệt
              </AppText>
            </View>
          </View>
          <AppText style={styles.indicatorDesc}>
            {taxCommittedPhotoMessage ||
              '- Yêu cầu của bạn đã được ghi nhận, MFast sẽ tiến hành kiểm tra và thông báo ngay khi có kết quả.'}
          </AppText>
        </View>
      );
    }
    if (taxCommittedPhotoStatus === 'FAILURE') {
      return (
        <View style={styles.resultContainerFailure}>
          <View style={styles.indicatorContainer}>
            <AppText style={styles.indicatorLabelFailure}>Kết quả duyệt cam kết thuế</AppText>
            <View style={styles.raw}>
              <Image source={ICON_PATH.failure} style={styles.icFailure} />
              <AppText style={styles.indicatorStatusFailure}>Thất bại</AppText>
            </View>
          </View>
          <AppText style={styles.indicatorDescFailure}>
            {taxCommittedPhotoMessage ||
              '- Vui lòng cập nhật lại thông tin cam kết thuế và chụp lại ảnh.'}
          </AppText>
        </View>
      );
    }
    if (taxCommittedPhotoStatus === 'SUCCESS') {
      return (
        <View style={styles.resultContainerSuccess}>
          <View style={styles.indicatorContainer}>
            <AppText style={styles.indicatorLabelFailure}>Kết quả duyệt cam kết thuế</AppText>
            <View style={styles.raw}>
              <Image source={ICON_PATH.check_success} style={styles.icFailure} />
              <AppText style={styles.indicatorStatusSuccess}>Thành công</AppText>
            </View>
          </View>
          <AppText style={styles.indicatorDescSuccess}>
            {taxCommittedPhotoMessage || '- Thành công'}
          </AppText>
        </View>
      );
    }
    return <View />;
  }, [taxCommittedPhotoStatus, taxCommittedPhotoMessage]);

  const onGetDisabled = useCallback(() => {
    if (!taxCommittedPhoto) {
      return !pathImage;
    }
    return taxCommittedPhoto === pathImage || !pathImage;
  }, [taxCommittedPhoto, pathImage]);

  const onGetLabel = useCallback(() => {
    if (!taxCommittedPhoto) {
      return 'Hoàn tất thông tin';
    }
    return 'Cập nhật';
  }, [taxCommittedPhoto, pathImage]);

  const onJumToTabTax = useCallback(() => {
    if (jumpTo) {
      jumpTo('tax');
    }
  }, [jumpTo]);
  const renderImpportLawCommitted = useCallback(() => {
    return (
      <View>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <AppText style={styles.topIndicatorLeft}>Hình chụp bản cam kết thuế</AppText>
          <AppText style={styles.topIndicatorRight} onPress={onSamplePress}>
            Xem mẫu
          </AppText>
        </View>
        <TouchableWithoutFeedback onPress={onPressOpenPickerGalary}>
          {pathImage ? (
            <View>
              <FastImage source={{ uri: pathImage }} style={styles.pathImage} />
              {pathImage &&
                taxCommittedPhotoStatus !== 'PENDING' &&
                taxCommittedPhotoStatus !== 'SUCCESS' && (
                  <TouchableOpacity style={styles.iconContainer} onPress={onPressRemovePathImage}>
                    <View>
                      <Image source={ICON_PATH.delete2} style={styles.icon} />
                    </View>
                  </TouchableOpacity>
                )}
            </View>
          ) : (
            <View style={styles.importImageContainer}>
              <Image source={ICON_PATH.add1} style={styles.icAdd} />
              <AppText style={styles.indicator}>Chọn hình</AppText>
            </View>
          )}
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onPressDownloadTempleteTax}>
          <View style={[styles.row, { marginVertical: 16 }]}>
            <AppText style={styles.txtDow}>Tải xuống mẫu cam kết thuế</AppText>
            <Image source={ICON_PATH.download} style={styles.icAdd} />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.btContainer}>
          <SubmitButton disabled={onGetDisabled()} label={onGetLabel()} onPress={onSubmit} />
        </View>
      </View>
    );
  }, [
    pathImage,
    onPressRemovePathImage,
    onGetDisabled,
    onGetLabel,
    onSubmit,
    taxCommittedPhotoStatus,
  ]);

  const renderMissingTaxNumber = useCallback(() => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={IMAGE_PATH.updateLaw} style={styles.updateImage} />
        <AppText style={styles.labelInput}>
          {`Vui lòng cập nhật Mã số thuế trước khi tải lên\n bản Cam kết thuế`}
        </AppText>
        <View style={styles.btContainer}>
          <SubmitButton
            disabled={taxRegisterStatus === STATE.PENDING}
            bgColor={Colors.primary2}
            label={'Về trang Mã số thuế'}
            onPress={onJumToTabTax}
            customStyle={{ width: SW(204), height: SH(48) }}
          />
        </View>
      </View>
    );
  }, [taxRegisterStatus, onJumToTabTax]);

  return (
    <View style={styles.wrapper}>
      <ScrollView>
        <View style={styles.container}>
          {renderResultTaxCommitted()}
          {!taxNumber || statusApplyTaxNumber === STATUS_APPLY_TAX.FAILURE
            ? renderMissingTaxNumber()
            : renderImpportLawCommitted()}
          <TouchableWithoutFeedback onPress={onPressViewTermTax}>
            <View style={styles.bottomBoxContainer}>
              <AppText style={styles.indicatorBottom}>
                Quy định khấu trừ và tạm giữ thuế Thu nhập cá nhân đối với thu nhập trên MFast
              </AppText>
              <Image source={ICON_PATH.arrow_right_green} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
      <PopupDownloadTemp
        isVisible={isVisibleDownload}
        onClose={onCloseDownloadModal}
        initValue={email}
        onSend={onSendTaxCommit}
      />
      <SamplePhotoPreview
        isVisible={isVisibleSample}
        onCloseAvatarSamplePress={onSamplePress}
        typeSample="TAX"
      />
    </View>
  );
};

export default withCameraPicker(Law);
