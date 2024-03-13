import { StyleSheet, Dimensions } from 'react-native';

const window = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    width: window.width,
    height: window.height,
  },
  logo: {
    position: 'absolute',
    width: 100,
    height: 50,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: window.height,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: window.height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  joinContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: window.height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  joinLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  joinName: {
    height: 50,
    width: 300,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    textAlign: 'center',
    color: 'white',
  },
  joinButton: {
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#337ab7',
    padding: 10,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
