import { StyleSheet } from 'react-native';
import { SH } from '../../../constants/styles';
import Colors from '../../../theme/Color';

export default StyleSheet.create({
  formWrapper: {
    margin: 16,
    padding: 16,
    borderRadius: 6,
    backgroundColor: Colors.neutral5,
  },
  identifyCardContainer: {
    marginTop: SH(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label1: {
    fontSize: SH(14),
    lineHeight: SH(17),
    letterSpacing: 0,
    color: Colors.gray1,
  },
  bold: {
    fontWeight: 'bold',
  },
  label: {
    opacity: 0.8,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
    marginTop: 12,
  },
  indicatorSuccess: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  indicatorError: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    lineHeight: 18,
    marginLeft: 6,
    color: Colors.accent3,
  },
  indicatorBottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  wraningIndicator: {
    fontSize: SH(14),

    fontStyle: 'normal',
    lineHeight: SH(17),
    letterSpacing: 0,
    color: Colors.accent3,
    marginRight: 10,
  },
  descWraningIndicator: {
    flex: 1,
    opacity: 0.8,
    fontSize: SH(14),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(20),
    letterSpacing: 0,
    color: Colors.gray1,
  },
  buttonWrapper: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 300,
  },
});
