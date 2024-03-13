import {
  Image,
  LayoutAnimation,
  Linking,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Colors from '../../../theme/Color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import { useDispatch } from 'react-redux';
import { getDetailCustomerProject } from '../../../redux/actions/actionsV3/customerAction';
import { TAB_TYPE } from '../../Customer/Customer.constants';
import ViewStatus, { STATUS_ENUM } from '../../../common/ViewStatus';
import { formatNumber, isDeepLink } from '../../../utils/Utils';
import { getTimeBetween } from '../../../utils/dateHelper';
import moment from 'moment';
import HTMLView from '../../../componentV3/HTMLView/HTMLView';
import DashedHorizontal from '../../../componentV3/DashedHorizontal/DashedHorizontal';
import { SH } from '../../../constants/styles';

const ModalProject = memo(
  forwardRef((props, ref) => {
    const { navigation } = props;

    const dispatch = useDispatch();

    const [project, setProject] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const insets = useSafeAreaInsets();
    const bottomSheet = useRef();

    useImperativeHandle(ref, () => ({
      ...bottomSheet.current,
      open: (_project, _title) => {
        setProject(_project);
        bottomSheet?.current?.open(_title);
      },
    }));

    const onGetData = useCallback(() => {
      setIsLoading(true);
      const payload = {
        applicationID: project?.applicationID,
        category: project?.category,
      };
      dispatch(
        getDetailCustomerProject(payload, (isSuccess, result) => {
          if (isSuccess) {
            LayoutAnimation.configureNext(
              LayoutAnimation.create(
                100,
                LayoutAnimation.Types.easeInEaseOut,
                LayoutAnimation.Properties.opacity,
              ),
            );
            setErrorMessage('');
            setProject((prevState) => ({ ...prevState, ...result }));
          } else {
            setErrorMessage(result);
          }
          setIsLoading(false);
        }),
      );
    }, [dispatch, project?.applicationID, project?.category]);

    const onDetail = useCallback(() => {
      bottomSheet.current?.close();
      if (isDeepLink(project?.webviewURL)) {
        Linking.openURL(project?.webviewURL);
      } else {
        navigation?.navigate('WebView', {
          mode: 0,
          url: project?.webviewURL,
          title: `Chi tiết dự án`,
        });
      }
    }, [navigation, project?.webviewURL]);

    useEffect(() => {
      if (project?.ID) {
        onGetData();
      }
    }, [onGetData, project?.ID]);

    // useEffect(() => {
    //   bottomSheet.current.open(
    //     `${project?.projectName} - ${project?.projectDescription || project?.productName}`,
    //   );
    // }, [project?.productName, project?.projectDescription, project?.projectName]);

    return (
      <BottomActionSheet
        ref={bottomSheet}
        render={() => (
          <View style={[styles.container, { paddingBottom: insets.bottom || SH(20) }]}>
            {isLoading || errorMessage?.length ? (
              <ViewStatus
                status={isLoading ? STATUS_ENUM.LOADING : STATUS_ENUM.ERROR}
                title={isLoading ? 'Đang tải dữ liệu\nVui lòng không thoát lúc này' : errorMessage}
              />
            ) : (
              <>
                <View style={styles.boxContainer}>
                  {project?.category === TAB_TYPE.INSURANCE ? (
                    <ItemInsurance item={project} />
                  ) : project?.category === TAB_TYPE.DDA ||
                    project?.category === TAB_TYPE.CREDIT_CARD ? (
                    <ItemDAA item={project} />
                  ) : project?.category === TAB_TYPE.LOAN ? (
                    <ItemFinance item={project} />
                  ) : project?.category === TAB_TYPE.MPL ? (
                    <ItemMPL item={project} />
                  ) : null}
                </View>
                {project?.webviewURL ? (
                  <TouchableWithoutFeedback onPress={onDetail}>
                    <View style={[styles.rowCenter, { alignSelf: 'center', marginTop: 16 }]}>
                      <AppText style={styles.title3} medium>
                        Xem chi tiết
                      </AppText>
                      <Image
                        source={ICON_PATH.downArrow}
                        style={{
                          width: 28,
                          height: 28,
                          transform: [
                            {
                              rotate: '-90deg',
                            },
                          ],
                          marginLeft: 4,
                          tintColor: Colors.primary2,
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
              </>
            )}
          </View>
        )}
        canClose={true}
        avoidKeyboard
        haveCloseButton
      />
    );
  }),
);

export default ModalProject;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  boxContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    padding: 16,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 64,
    height: 40,
    resizeMode: 'contain',
    marginRight: 16,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
  },
  title2: {
    fontSize: 13,
    lineHeight: 18,
  },
  title3: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primary2,
  },
  lineHorizontal: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral5,
  },
  itemContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  imageItem: {
    height: 56,
    width: 56,
  },
  contentWraper: {
    flex: 1,
    paddingLeft: 12,
    alignItems: 'flex-start',
  },
  labelItem: {
    color: Colors.gray1,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 24,
  },
  subContentWraper: {
    flexDirection: 'row',
    paddingTop: 2,
    justifyContent: 'space-between',
    marginHorizontal: 0,
    width: '100%',
  },
  amountLable: {
    color: Colors.gray5,
    fontStyle: 'normal',
    fontSize: 13,
    lineHeight: 18,
  },
  amountValue: {
    textAlign: 'center',
    color: Colors.gray1,
    fontStyle: 'normal',
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 8,
  },
  dash: {
    marginBottom: 8,
    marginTop: 15,
    position: 'relative',
  },
  dashBottom: {
    position: 'relative',
  },
});

const ItemFinance = memo(({ item }) => {
  const renderTitleContent = ({ title, content, subContent, color, ...rest }) => {
    return (
      <View style={{ flex: 1 }}>
        <AppText style={[styles.title2, { color: Colors.gray5 }]}>{title}</AppText>
        <AppText style={[styles.title, { color: color || Colors.gray1, marginTop: 2 }]} {...rest}>
          {content}
        </AppText>
      </View>
    );
  };
  const renderHorizontalTitleContent = ({
    title,
    content,
    subContent,
    color,
    ratio = 0.7,
    style,
    ...rest
  }) => {
    return (
      <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }, style]}>
        <AppText style={[styles.title2, { color: Colors.gray5, flex: 1 - ratio }]}>{title}</AppText>
        <AppText style={[styles.title, { color: color || Colors.gray1, flex: ratio }]} {...rest}>
          {content}
        </AppText>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.rowCenter}>
        <Image style={styles.itemImage} source={{ uri: item?.iconURL }} />
        <View>
          <AppText
            style={[
              styles.title,
              {
                color: Colors.gray5,
              },
            ]}
          >
            Sản phẩm
          </AppText>
          <AppText
            style={[
              styles.title,
              {
                color: Colors.gray1,
              },
            ]}
          >
            {item?.projectName}
          </AppText>
        </View>
      </View>
      <View style={[styles.lineHorizontal, { marginTop: 12 }]} />
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        {renderTitleContent({
          title: 'Khoản vay đề nghị',
          content: (
            <AppText style={[styles.title, { color: Colors.gray1 }]} bold>
              {item?.uwRequestAmount ? formatNumber(item?.uwRequestAmount) : '---'}
              {/* {`\n`}
              <AppText style={[styles.title, { color: Colors.gray1 }]}>(có bảo hiểm)</AppText> */}
            </AppText>
          ),
        })}
        {renderTitleContent({
          title: 'Khoản vay chấp nhận',
          content: item?.uwApproveAmount ? formatNumber(item?.uwApproveAmount) : '---',
          bold: true,
        })}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        {renderTitleContent({
          title: 'Số tháng vay đề nghị',
          content: item?.uwTenureRequested || '---',
          bold: true,
        })}
        {renderTitleContent({
          title: 'Số tháng vay chấp nhận',
          content: item?.uwTermApproved || '---',
          bold: true,
        })}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        {renderTitleContent({
          title: 'Mã hợp đồng vay',
          content: item?.uwContractNumber || '---',
        })}
        {renderTitleContent({
          title: 'Sale Code',
          content: item?.saleCode || '---',
          bold: true,
          color: item?.saleCode ? Colors.sixRed : Colors.gray1,
        })}
      </View>
      <View style={[styles.lineHorizontal, { marginTop: 12 }]} />
      {renderHorizontalTitleContent({
        title: 'Tạo bởi',
        content: item?.initFullName,
        style: { marginTop: 8 },
      })}
      {renderHorizontalTitleContent({
        title: 'Trạng thái',
        content: item?.status_text,
        bold: true,
        color:
          item?.status === '1'
            ? Colors.thirdGreen
            : item?.status === '0'
            ? Colors.fiveOrange
            : item?.status === '2'
            ? Colors.fiveRed
            : Colors.primary2,
        style: { marginTop: 8 },
      })}
      {renderHorizontalTitleContent({
        title: 'Cập nhật cuối',
        content: item?.lastProcessText || '---',
        style: { marginTop: 8 },
      })}
      {renderHorizontalTitleContent({
        title: 'Pega ID',
        content: item?.applicationID || '---',
        style: { marginTop: 8 },
      })}
      {renderHorizontalTitleContent({
        title: 'Vào lúc',
        content: getTimeBetween(moment(item?.updatedDate).valueOf()),
        style: { marginTop: 8 },
      })}
    </View>
  );
});

const ItemMPL = memo(({ item }) => {
  const renderProductCart = useCallback((it, idx, data) => {
    const length = data?.length;
    return (
      <View style={styles.itemContainer}>
        <Image style={styles.imageItem} source={{ uri: it?.image }} />
        <View style={styles.contentWraper}>
          <AppText medium numberOfLines={1} style={styles.labelItem}>
            {it?.productName}
          </AppText>
          <View style={styles.subContentWraper}>
            <AppText medium style={styles.amountLable}>
              {formatNumber(it?.amount)} đ
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText style={styles.amountLable}>Số lượng:</AppText>
              <AppText style={styles.amountValue}>{it?.quantity}</AppText>
            </View>
          </View>
          {length - 1 !== idx && (
            <DashedHorizontal size={3} color={Colors.gray4} style={styles.dash} />
          )}
        </View>
      </View>
    );
  }, []);

  const renderHorizontalTitleContent = ({
    title,
    content,
    subContent,
    color,
    ratio = 0.7,
    style,
    ...rest
  }) => {
    return (
      <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }, style]}>
        <AppText style={[styles.title2, { color: Colors.gray5, flex: 1 - ratio }]}>{title}</AppText>
        <AppText style={[styles.title, { color: color || Colors.gray1, flex: ratio }]} {...rest}>
          {content}
        </AppText>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.rowCenter}>
        <Image style={styles.itemImage} source={{ uri: item?.iconURL }} />
        <View>
          <AppText
            style={[
              styles.title,
              {
                color: Colors.gray5,
              },
            ]}
          >
            Sản phẩm
          </AppText>
          <AppText
            style={[
              styles.title,
              {
                color: Colors.gray1,
              },
            ]}
          >
            {item?.projectName}
          </AppText>
        </View>
      </View>
      <DashedHorizontal
        size={3}
        color={Colors.gray4}
        style={[styles.dashBottom, { marginTop: 12 }]}
      />
      {item?.items?.map(renderProductCart)}
      <DashedHorizontal
        size={3}
        color={Colors.gray4}
        style={[styles.dashBottom, { marginTop: 12 }]}
      />
      <View
        style={[styles.subContentWraper, { paddingTop: 0, alignItems: 'center', marginTop: 12 }]}
      >
        <AppText medium style={styles.amountLable}>
          Tổng {item?.total_quantity} sản phẩm
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppText style={styles.amountLable}>Thành tiền:</AppText>
          <AppText style={[styles.amountValue, { color: Colors.sixRed }]} semiBold>
            {formatNumber(item?.amountAfterTax)}đ
          </AppText>
        </View>
      </View>
      <DashedHorizontal
        size={3}
        color={Colors.gray4}
        style={[styles.dashBottom, { marginTop: 10 }]}
      />

      {renderHorizontalTitleContent({
        title: 'Trạng thái',
        content: item?.status_text,
        bold: true,
        color:
          item?.status === '1'
            ? Colors.thirdGreen
            : item?.status === '0'
            ? Colors.fiveOrange
            : item?.status === '2'
            ? Colors.fiveRed
            : Colors.primary2,
        style: { marginTop: 8 },
      })}
      {renderHorizontalTitleContent({
        title: 'Ghi chú',
        content: item?.lastProcessText || '---',
        style: { marginTop: 8 },
      })}
      {renderHorizontalTitleContent({
        title: 'Vào lúc',
        content: getTimeBetween(moment(item?.updatedDate).valueOf()),
        style: { marginTop: 8 },
      })}
    </View>
  );
});

const ItemInsurance = memo(({ item }) => {
  const renderHorizontalTitleContent = ({
    title,
    content,
    subContent,
    color,
    ratio = 0.65,
    style,
    ...rest
  }) => {
    return (
      <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }, style]}>
        <AppText style={[styles.title2, { color: Colors.gray5, flex: 1 - ratio }]}>{title}</AppText>
        <AppText style={[styles.title, { color: color || Colors.gray1, flex: ratio }]} {...rest}>
          {content}
        </AppText>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.rowCenter}>
        <Image style={styles.itemImage} source={{ uri: item?.iconURL }} />
        <View>
          <AppText
            style={[
              styles.title,
              {
                color: Colors.gray5,
              },
            ]}
          >
            Sản phẩm
          </AppText>
          <AppText
            style={[
              styles.title,
              {
                color: Colors.gray1,
              },
            ]}
          >
            {item?.projectName}
          </AppText>
        </View>
      </View>
      <View style={[styles.lineHorizontal, { marginTop: 12 }]} />
      {renderHorizontalTitleContent({
        title: 'Nhà bảo hiểm:',
        content: item?.partnerText,
        style: { marginTop: 8 },
        medium: true,
      })}
      {renderHorizontalTitleContent({
        title: 'Tên chương trình:',
        content: item?.projectName,
        style: { marginTop: 8 },
        medium: true,
      })}
      {item?.productType
        ? renderHorizontalTitleContent({
            title: 'Loại bảo hiểm:',
            content: item?.productType || '---',
            style: { marginTop: 8 },
            medium: true,
          })
        : null}
      {renderHorizontalTitleContent({
        title: 'Thời gian hiện lực:',
        content: (
          <AppText style={[styles.title, { color: Colors.gray1 }]}>
            Từ{' '}
            <AppText style={[styles.title, { color: Colors.sixRed }]} bold>
              {item?.startDate
                ? moment(item?.startDate, 'HH:mm DD/MM/YYYY')?.format('DD/MM/YYYY')
                : 'XX-YY-ZZZZ'}
            </AppText>{' '}
            đến{' '}
            <AppText style={[styles.title, { color: Colors.sixRed }]} bold>
              {item?.expiredDate
                ? moment(item?.expiredDate, 'HH:mm DD/MM/YYYY')?.format('DD/MM/YYYY')
                : 'XX-YY-ZZZZ'}
            </AppText>
          </AppText>
        ),
        style: { marginTop: 8 },
      })}
      {item?.insuranceAmount
        ? renderHorizontalTitleContent({
            title: 'Số tiền bảo hiểm tối đa:',
            content: item?.insuranceAmount || '---',
            style: { marginTop: 8 },
            color: '#00c28e',
            semiBold: true,
            ratio: 0.58,
          })
        : null}
      {renderHorizontalTitleContent({
        title: 'Quyền lợi nổi bật:',
        content: '',
        style: { marginTop: 8 },
      })}
      <HTMLView html={item?.desc} style={{ marginTop: 8 }} />
    </View>
  );
});
const ItemDAA = memo(({ item }) => {
  const renderHorizontalTitleContent = ({
    title,
    content,
    subContent,
    color,
    ratio = 0.75,
    style,
    ...rest
  }) => {
    return (
      <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }, style]}>
        <AppText style={[styles.title2, { color: Colors.gray5, flex: 1 - ratio }]}>{title}</AppText>
        <AppText style={[styles.title, { color: color || Colors.gray1, flex: ratio }]} {...rest}>
          {content}
        </AppText>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.rowCenter}>
        <Image style={styles.itemImage} source={{ uri: item?.iconURL }} />
        <View>
          <AppText
            style={[
              styles.title,
              {
                color: Colors.gray5,
              },
            ]}
          >
            Sản phẩm
          </AppText>
          <AppText
            style={[
              styles.title,
              {
                color: Colors.gray1,
              },
            ]}
          >
            {item?.uwProductname || item?.projectName}
          </AppText>
        </View>
      </View>
      <View style={[styles.lineHorizontal, { marginTop: 12 }]} />
      {renderHorizontalTitleContent({
        title: 'Trạng thái:',
        content: item?.status_text,
        color:
          item?.status === '1'
            ? Colors.thirdGreen
            : item?.status === '0'
            ? Colors.fiveOrange
            : item?.status === '2'
            ? Colors.fiveRed
            : Colors.primary2,
        style: { marginTop: 8 },
        bold: true,
      })}
      {renderHorizontalTitleContent({
        title: 'Ghi chú:',
        content: item?.processText || item?.lastProcessText,
        style: { marginTop: 8 },
      })}
      {renderHorizontalTitleContent({
        title: 'Vào lúc:',
        content: getTimeBetween(moment(item?.updatedDate)?.valueOf()),
        style: { marginTop: 8 },
        medium: true,
      })}
    </View>
  );
});
