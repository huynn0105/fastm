import { StyleSheet } from 'react-native';
import Colors from '../../theme/Color';

const styles = StyleSheet.create({
  safaView: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  titleText: {
    color: Colors.gray1,
    fontStyle: 'normal',
    fontSize: 18,
    marginHorizontal: 16,
    marginTop: 16,
    lineHeight: 26,
  },
  discriptionText: {
    color: Colors.gray5,
    fontStyle: 'normal',
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 4,
    lineHeight: 20,
  },
  dash: {
    marginVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  attributeWrapper: {
    paddingHorizontal: 16,
  },
  attributeItemWrapper: {
    flexDirection: 'row',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
    marginHorizontal: 16,
  },
  attributeTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
    flex: 1,
    marginTop: 15,
  },
  listAttributeValueWrapper: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attributeItemValueWrapper: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    left: 12,
    right: 0,
    backgroundColor: Colors.primary5,
    borderRadius: 8,
  },
  attributeValue: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
  },
  costWrapper: {
    flexDirection: 'row',
    backgroundColor: '#c6fbec',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    justifyContent: 'space-between',
  },
  priceWrapper: {
    flex: 1,
  },
  commissionWrapper: {
    flex: 1,
  },
  columnDivider: {
    width: 1,
    marginVertical: 2,
    marginHorizontal: 18,
    backgroundColor: Colors.primary5,
  },
  infoTitle: {
    color: Colors.gray5,
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 20,
  },
  priceValue: {
    color: Colors.sixRed,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 2,
  },
  originalPrice: {
    color: Colors.gray5,
    fontStyle: 'normal',
    textDecorationLine: 'line-through',
    fontSize: 13,
    lineHeight: 18,
  },
  commissionValue: {
    color: '#00b886',
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 24,
  },
  paylaterWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 6,
  },
  paylaterTimeWrapper: {
    flex: 1,
    backgroundColor: '#d0e0fb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  interestRateWrapper: {
    flex: 1,
    backgroundColor: '#fae2c7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  paylaterTimeValue: {
    color: Colors.blue3,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 24,
  },
  interestRateValue: {
    color: Colors.sixOrange,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonWrapper: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 17,
    backgroundColor: Colors.blue3,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  buttonPayNow: {
    borderRadius: 20,
    borderColor: '#e0e6ff',
    borderWidth: 1,
    height: 40,
    backgroundColor: Colors.blue3,
  },
  buttonPayLater: {
    borderRadius: 20,
    height: 40,
    backgroundColor: Colors.action,
  },
  buttonPayNowLabel: {
    color: Colors.primary5,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonPayLaterLabel: {
    color: Colors.primary5,
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 24,
  },
  disable: {
    opacity: 0.4,
  },
});

export default styles;
