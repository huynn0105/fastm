import { StyleSheet } from 'react-native';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import { SCREEN_WIDTH } from '../../utils/Utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    backgroundColor: Colors.neutral5,
    paddingTop: SH(20),
    paddingBottom: SH(10),
    paddingHorizontal: SW(50),
  },
  pageContainer: {
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  stepTitle: {
    fontSize: SH(13),
    lineHeight: SH(18),
    marginTop: SH(12),
    color: Colors.gray5,
    textAlign: 'center',
  },
  boxContainer: {
    paddingHorizontal: SW(16),
    width: '100%',
    marginTop: SH(16),
  },
  formTitle: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.thirdOrange,
  },
  formContainer: {
    borderRadius: SW(8),
    padding: SW(16),
    backgroundColor: Colors.neutral5,
    marginTop: SH(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
