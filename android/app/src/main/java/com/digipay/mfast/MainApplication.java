package com.digipay.mfast;

import android.app.Application;
import android.content.Context;

import com.facebook.react.ReactApplication;
import com.moengage.react.MoEReactPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.PackageList;
import java.lang.reflect.InvocationTargetException;

// import com.zing.zalo.zalosdk.oauth.ZaloSDKApplication;

import com.moe.pushlibrary.MoEHelper;
import com.moengage.core.MoEngage;
import com.moengage.react.MoEInitializer;
import com.moengage.core.config.NotificationConfig;
import com.moengage.core.config.FcmConfig;
import com.moengage.core.DataCenter;
import com.moengage.core.LogLevel;
import com.moengage.core.config.LogConfig;
import com.facebook.react.ReactInstanceManager;
import com.microsoft.codepush.react.CodePush;

import java.util.Arrays;
import java.util.List;
import io.branch.rnbranch.RNBranchModule;


public class MainApplication extends Application implements ReactApplication {


private final ReactNativeHost mReactNativeHost =
    new ReactNativeHost(this) {
      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }

      @Override
      protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();
          // packages.add(new MoEReactPackage());

          packages.add(new FlutterModulePackage());
        // Packages that cannot be autolinked yet can be added manually here, for example:
        // packages.add(new MyReactNativePackage());
        return packages;
      }

      @Override
      protected String getJSMainModuleName() {
        return "index";
      }
      @Override
      protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
      }
    };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    RNBranchModule.getAutoInstance(this);
    SoLoader.init(this, /* native exopackage */ false);
    // ZaloSDKApplication.wrap(this);

    // Configure MoEngage SDK
    MoEngage.Builder moEngage = new MoEngage.Builder(this, "9QBXCRQ6ZYJBYYXZQMZAG3UM", DataCenter.DATA_CENTER_1)
        .configureLogs(new LogConfig(LogLevel.VERBOSE, false))
        .configureNotificationMetaData(
            new NotificationConfig(
                R.drawable.ic_notification, /* Small Icon */
                R.drawable.ic_notification, /* Large Icon */
                R.color.noti_color, /* Notification Color */
                true, /* True, to show multiple notification in notification drawer */
                true, /* True, to synthesize back-stack for the notification's click action */
                true /* True, to show notification large icon on Lollipop and above devices */
            ));
    MoEInitializer.INSTANCE.initializeDefaultInstance(getApplicationContext(), moEngage, false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }


  /**
    * Loads Flipper in React Native templates.
    *
    * @param context
    */
    private static void initializeFlipper(Context context,  ReactInstanceManager reactInstanceManager) {
      if (BuildConfig.DEBUG) {
        try {
          /*
            We use reflection here to pick up the class that initializes Flipper,
          since Flipper library is not available in release mode
          */
          Class<?> aClass = Class.forName("com.digipay.mfast.ReactNativeFlipper");
          aClass.getMethod("initializeFlipper", Context.class, ReactInstanceManager.class).invoke(null, context, reactInstanceManager);
        } catch (ClassNotFoundException e) {
          e.printStackTrace();
        } catch (NoSuchMethodException e) {
          e.printStackTrace();
        } catch (IllegalAccessException e) {
          e.printStackTrace();
        } catch (InvocationTargetException e) {
          e.printStackTrace();
        }
      }
    }

}
