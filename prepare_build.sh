#!/bin/bash

if [ -d ./node_modules/react-native ]
then
    # https://github.com/invertase/react-native-firebase/issues/3709
    tar -xvf ./zip/RCTUIImageViewAnimated.m.zip -C ./node_modules/react-native/Libraries/Image/
    # https://github.com/invertase/react-native-firebase/issues/3944#issuecomment-699658370
    # https://github.com/react-native-webview/react-native-webview/pull/1689
    # tar -xvf ./zip/RNCWebViewModule.java.zip -C ./node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/

else
	echo "You need to run yarn update first"
fi