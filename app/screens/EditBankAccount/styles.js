import {
  StyleSheet,
  Dimensions,
} from 'react-native';

const SCREEN_SIZE = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#f2f2f2',
  },
  inputsContainer: {
    marginTop: 4,
    paddingTop: 0,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },
  pickerList: {
    flex: 1,
    width: SCREEN_SIZE.width * 0.8,
    maxHeight: SCREEN_SIZE.height * 0.7,
    marginTop: 0,
    marginBottom: 12,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: '#fff',
    borderRadius: 4.0,
  },
  pickerOptionText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 15,
    color: '#202020',
  },
  pickerCancelButton: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: SCREEN_SIZE.width * 0.8,
    marginBottom: 8,
    backgroundColor: '#2696E0',
    borderRadius: 4.0,
  },
  pickerCancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRightButton: {
    width: 64,
    height: 44,
    paddingLeft: 0,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
  },
});
