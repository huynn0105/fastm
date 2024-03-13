### INSTALL

```
yarn install
react-native link
yarn start
```

### LAYERS STRUCTURE
+ only the higher layer known about the lower
+ the lower cannot know higher
for example: actions might import DigitelClient & DatabaseManager but the vice versal cannot happen

```
LV 0: UI: App, Components
LV 1: Manager: NotificationManager
LV 2: Redux: actions, reducer, store
LV 3: Kits: DatabaseManager, DigitelClient
```

### PROJECT STRUCTURE
#### constants
+ all configs & constants
+ all strings using in the app
+ all colors using in the app

### PUSH NOTIFICATION STRUCTURE
+ check in ./docs/push_notification.md
+ client app will subscribe subscriptions as topic: role-<projectRoleID>

### BUILD RELEASE

*Thanks to Dave Hudson for the* [tutorial](https://medium.com/react-native-training/fastlane-for-react-native-ios-android-app-devops-8ca85bee614e)

#### Link version file before build
1. Get access to version file from Dropbox (contact developer)
2. Create symbol link from dropbox to project

```bash
# for ios
ln -s <dropbox_link>/ios_build_number.txt <project_dir>/ios/fastlane/build_number.txt

# for android
ln -s <dropbox_link>/android_version_code.properties <project_dir>/android/version_code.properties
```

#### iOS

Open your terminal:

**Crashlytics Beta**
```
$cd ios
$fastlane ios beta
```

**Apple Store (2 steps)**
1. submit the build to appstore
```
$cd ios
$fastlane ios production
```

2. goto Apple Developer Console and submit a new review

<b>Notes</b>
- `Automatically manager signing` in Xcode must be disabled
- build version will be auto increment from the value in Xcode/Build Settings/Versioning -> Current Project Version

#### Android

Open your terminal:

**Crashlytics Beta**
```
$cd android
$fastlane android beta
```

**Google Play Store (2 steps)**
1. Submit the build to alpha
```
$cd android
$fastlane android production
```

*you can also submit the beta, or production (not recommended) by passing track, for instance:*
```
$cd android
$fastlane android production track:"beta"
```

*after submit to alpha or beta, your app can be found at: *
[https://play.google.com/apps/testing/com.digipay.mfast](https://play.google.com/apps/testing/com.digipay.mfast)

2. Go to Google Play Console & promote to production (after you has tested)


**Notes**
- build version will be auto increment only on build release, from the value inside /android/version.properties

- make sure to run `configure_env_ios.py`, `configure_env_android.py` in 0-scripts before build release

- make sure `compileSdkVersion, buildToolsVersion, minSdkVersion, targetSdkVersion` in 0-scripts/configure_gradle are same at these values in android/app/build.gradle

- ISSUE: Requiring unknown module "undefined" for `react-native-maps`
  + use "react-native-maps": "https://github.com/react-community/react-native-maps.git" in package.json
  + more details: https://github.com/react-community/react-native-maps/issues/2051

- ISSUE: Not found GoogleMaps
  + remove reference dir AirGoogleMaps in AirMap project in Xcode since we don't use Google
  + tut to use GoogleMaps: https://github.com/react-community/react-native-maps/issues/1278

- ISSUE: ReamlJS download too long, build too slow
  + Download realm from https://static.realm.io/downloads/sync/realm-sync-cocoa-<version>.tar.gz, For example: https://static.realm.io/downloads/sync/realm-sync-cocoa-2.2.15.tar
  + Open `getconf DARWIN_USER_TEMP_DIR`
  + Copy the downloaded file to the tmp
- ENV FILE: openssl base64 -in .env.prod | pbcopy