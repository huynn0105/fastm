import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import DeviceInfo from 'react-native-device-info';

import { Configs } from '../constants/configs';

// default config
// Reactotron
//   .configure() // controls connection & communication settings
//   .useReactNative() // add all built-in react native plugins
//   .connect(); // let's connect!

// DEV
// config with redux
if (Configs.enableLog) {
  if (DeviceInfo.isEmulator()) {
    // simulator
    Reactotron.configure({
      name: 'MFast',
    })
      .use(reactotronRedux())
      .connect();
  } else {
    // device
    Reactotron.configure({
      name: 'MFast',
      host: '192.168.0.90',
    })
      .use(reactotronRedux())
      .connect();
  }
  // const hijackConsole = (browserConsole) => {
  //   console.log = (...args) => {
  //     // if (isDebuggingInChrome) {
  //     //   browserConsole(...args);
  //     // }
  //     Reactotron.display({
  //       name: 'CONSOLE.LOG',
  //       value: args,
  //       preview: args.length > 1 ? JSON.stringify(args) : args[0],
  //     });
  //   };
  // };

  // hijackConsole(console.log);
}
