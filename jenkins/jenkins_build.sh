set_lang() {
  export LC_ALL=en_US.UTF-8
  export LANG=en_US.UTF-8
}

setupEnv() {
  yarn install
  python 0-scripts/configure_env_android.py
  python 0-scripts/configure_env_ios.py 
  set_lang  
}

build_upload_android_beta() {
  cd android
  fastlane android beta release_notes:"`cat ../jenkins/release_note_android.txt`"
  cd ..
}

setup_ios_env() {
  cd ios
  xcodebuild -workspace Digitel.xcwordspace -scheme Digitel clean
  pod install
  cd ..
  cp -r ios/tmp/AirMaps.xcodeproj node_modules/react-native-maps/lib/ios/
  # security unlock-keychain -p "a@123456" /Users/Shared/Jenkins/Library/Keychains/login.keychain 
}

screenshot_ios() {
  cd ios
  fastlane scan
  send_telegram "`sed -n 2p fastlane/test_output/report.junit`"
  send_telegram "http://99.wediff.xyz:8080/job/Appay_beta/ws/ios/fastlane/test_output/report.html"

  fastlane snapshot
  send_telegram "http://99.wediff.xyz:8080/job/Appay_beta/ws/ios/fastlane/screenshots/screenshots.html"
  cd ..
}

build_upload_ios_beta() {
  cd ios
  fastlane ios beta release_notes:"`cat ../jenkins/release_note_ios.txt`"
  cd ..
}

send_telegram() {
  curl -X POST "https://api.telegram.org/bot564467928:AAGl1ZZMMufUFRP2cqwNyxNnvU7kUOgCdm0/sendMessage" -d "chat_id=-279124480&text=$1"
}

build_mode=$1
environment=`python jenkins/get_environment.py`

setupEnv

send_telegram ". "
send_telegram "Building $environment - - - - - - - - - - - - - -"

setup_ios_env
if [ "$build_mode" = "test" ]  || [ "$build_mode" = "all" ]; then
  echo "test"
  screenshot_ios
fi


if [ "$build_mode" = "build" ]  || [ "$build_mode" = "all" ]; then
  echo "build"
  build_upload_ios_beta
  build_upload_android_beta
fi

if [ "$build_mode" = "ios" ]; then
  echo "build"
  build_upload_ios_beta
fi

if [ "$build_mode" = "android" ]; then
  echo "build"
  build_upload_android_beta
fi