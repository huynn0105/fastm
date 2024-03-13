## STEP TO RELEASE A NEW BUILD

1. Check `BundleID` (in ios/Digitel.workspace) for iOS & `applicationId` (in android/app/build.gradle) for Android
2. Run configure script to replace app name & firebase config
```
python 0-scripts/configure_env_ios.py
python 0-scripts/configure_env_android.py
```
3. Build through xcode or using fastlane, can choose `beta` or `appstore`
```
cd ios
fastlane ios beta
```
```
cd android
fastlane android appstore
```

***

## BUILD ENVIRONMENT

### IOS
#### Development (Ad-Hoc, Crashlytics)

- environment in configs.js: 'DEV'
- BunldeID: com.digitel.appaydev
- Firebase: Appay-DEV
- Backend: https://appaydev.cloudcms.vn/rest

#### Production (AppStore, Testflight)

- environment in configs.js: 'PROD'
- BunldeID: com.digitel.appay
- Firebase: Appay-PROD
- Backend: https://appay.cloudcms.vn/rest


### ANDROID
#### Development (Crashlytics)

- environment in configs.js: 'DEV'
- applicationId: com.digitel.appaydev
- Firebase: Appay-DEV
- Backend: https://appaydev.cloudcms.vn/rest


#### Production (PlayStore, Alpha, Beta)

- environment in configs.js: 'PROD'
- applicationId: com.digitel.appay
- Firebase: Appay-PROD
- Backend: https://appay.cloudcms.vn/rest

***