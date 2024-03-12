JENKINS, FASTLANE, TELEGRAM SETUP FOR REACT NATIVE
=====
Setup Jenkins for React native with 5 sections:
1. Setup Jenkins in a local server.
2. Setup Android for React Native.
3. Setup iOS for React Native.
4. Build script
5. Send mess to Telegram

I. Jenkins
---
Follow the below tut, upto step 5. 

[Continuous Integration and Delivery for iOS with Jenkins and Fastlane (Part 1)](https://medium.com/@cherrmann.com/continuous-integration-and-delivery-for-ios-with-jenkins-and-fastlane-part-1-3b17f1901a73)

- Install Jenkins
- Create a job with free style, connect with bitbucket
- Setup trigger for job, e.g: webhook.
- Intall fastlane, we will use fastlane to auto build and upload to fabric  

II. Android
---
1. Install Android Studio
2. Open Android Studio, install Fabric plguin. then login to Fabric
3. Setup fastlane for Android

    https://docs.fastlane.tools/getting-started/android/setup/ 
4. Copy your keystore for export android apk

III. iOS
---
1. Install Xcode
2. Setup fastlane for iOS

https://docs.fastlane.tools/getting-started/ios/setup/

3. Setup certificate and provisioning.
4. Set `provisioningProfiles` in `Fastfile`
~~~
gym(scheme: 'Digitel', export_method: 'ad-hoc', include_bitcode: false,
    export_options: {
      provisioningProfiles: {
        "com.digitel.appaydev": "AppayDev_AhHoc.mobileprovision",
        "com.digitel.appay": "Appay_AdHoc.mobileprovision"
      }
    }
    )
~~~ 

IV. Build script
--

* Using bash script
* Invoke build iOS, Android, Unit Test, UITests, [fastlane snapshot](https://docs.fastlane.tools/getting-started/ios/screenshots/)
* Send mess to Telegram (section V)

V. Send mess to Telegram
--
https://medium.com/@xabaras/sending-a-message-to-a-telegram-channel-the-easy-way-eb0a0b32968

1. Create a Telegram bot.
2. Create a group, then add bot to the group.
3. Get `chat id` and send mess using http request
~~~
curl -X POST "https://api.telegram.org/bot564467928:AAGl1ZZMMufUFRP2cqwNyxNnvU7kUOgCdm0/sendMessage" -d "chat_id=-228104084&text=$1"
~~~