import { StyleSheet } from 'react-native';
import { SH, SW } from '../../constants/styles';

import Colors from '../../theme/Color';
import { SCREEN_WIDTH } from '../../utils/Utils';

export default StyleSheet.create({
  safaView: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  imgSelfie: {
    width: SW(343),
    height: SH(343),
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  importSelfieContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  indicatorWaring: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.gray5,
    marginTop: 8,
  },
  txtSample: {
    fontSize: 14,
    letterSpacing: 0,
    color: Colors.primary2,
    marginTop: 2,
    marginBottom: 10,
  },
  importInforBank: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  textFieldContainerStyle: {
    flex: 0,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 64,
    shadowOpacity: 1,
    elevation: 2,
    marginBottom: 24,
  },
  indicatorLk: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.sixOrange,
  },
  raw: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtNote: {
    fontSize: 14,
    opacity: 0.6,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary4,
    marginRight: 4,
  },
  icDeleteWrapper: {
    position: 'absolute',
    right: -8,
    top: -8,
  },
  note: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: Colors.primary5,
    borderWidth: 1,
    borderColor: Colors.neutral4,
    height: 65,
    textAlignVertical: 'top',
    padding: 12,
  },
  btnWrapper: {
    marginBottom: 240,
    paddingHorizontal: 16,
  },
  imgUrlSelfie: {
    width: SCREEN_WIDTH - 32,
    height: ((SCREEN_WIDTH - 32) * 4) / 3.2,
    borderRadius: 10,
  },
  boxErrorContainer: {
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
    backgroundColor: '#ffe1e5',
  },
  headerBoxError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtTitle: {
    opacity: 0.6,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  txtStatus: {
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.accent3,
    marginLeft: 4,
  },
  desc: {
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.accent3,
    paddingVertical: 4,
  },
});
