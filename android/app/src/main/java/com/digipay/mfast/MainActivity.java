package com.digipay.mfast;

import com.facebook.react.ReactActivity;
import android.content.Intent;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import android.os.Bundle;
import android.os.Build;
import android.content.res.Configuration;
import org.devio.rn.splashscreen.SplashScreen;
import android.app.NotificationChannel;
import android.app.NotificationManager; //

import io.branch.rnbranch.*; // <-- add this
import android.content.Intent; // <-- and this
import io.flutter.embedding.android.FlutterActivity;
import android.util.Log;


// import com.zing.zalo.zalosdk.oauth.ZaloSDK;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "mfast";
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    // ZaloSDK.Instance.onActivityResult(this, requestCode, resultCode, data);
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  // Override onStart, onNewIntent:
  @Override
  protected void onStart() {
    super.onStart();
    RNBranchModule.initSession(getIntent().getData(), this);
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
//      if (FlutterModuleActivity.getInstance() != null && intent != null &&
//             intent.getData() != null && (intent.getData().toString().contains("view=MTrade") || intent.getData().toString().contains("view=Flutter"))) {
//       startActivity(
//               new FlutterActivity
//                       .NewEngineIntentBuilder(FlutterModuleActivity.class)
//                       .build(this)
//                       .putExtra(FlutterModuleActivity.INITIAL_EVENT, "")
//                       .putExtra(FlutterModuleActivity.INITIAL_ARGS, "")
//       );
//       return;
//     }
    if (intent != null &&
        intent.hasExtra("branch_force_new_session") &&
        intent.getBooleanExtra("branch_force_new_session", false)) {
        RNBranchModule.onNewIntent(intent);
    }
    // if (intent.getData().toString().contains("view=Flutter")) {
    //   startActivity(
    //           new FlutterActivity
    //                   .NewEngineIntentBuilder(FlutterModuleActivity.class)
    //                   .build(this)
    //                   .putExtra(FlutterModuleActivity.INITIAL_EVENT, "")
    //                   .putExtra(FlutterModuleActivity.INITIAL_ARGS, "")
    //   );
    // } else {
    //   if (intent != null &&
    //     intent.hasExtra("branch_force_new_session") &&
    //     intent.getBooleanExtra("branch_force_new_session", false)) {
    //     RNBranchModule.onNewIntent(intent);
    //   }
    // }
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    setTheme(R.style.AppTheme); // Now set the theme from Splash to App before setContentView
    setContentView(R.layout.launch_screen); // Then inflate the new view
    SplashScreen.show(this); // Now show the splash screen. Hide it later in JS
    super.onCreate(savedInstanceState);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel notificationChannel = new NotificationChannel("mFast", "mFast", NotificationManager.IMPORTANCE_HIGH);
            // notificationChannel.setShowBadge(true);
            // notificationChannel.setDescription("Test Notifications");
            // notificationChannel.enableVibration(true);
            // notificationChannel.enableLights(true);
            // notificationChannel.setVibrationPattern(new long[]{400, 200, 400});
            //notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            
            
            NotificationManager manager = getSystemService(NotificationManager.class);

            manager.createNotificationChannel(notificationChannel);
        }

  }

  // Workaround appcompat-1.1.0 bug https://issuetracker.google.com/issues/141132133
  @Override
  public void applyOverrideConfiguration(Configuration overrideConfiguration) {
      if (Build.VERSION.SDK_INT >= 21 && Build.VERSION.SDK_INT <= 25) {
          return;
      }
      super.applyOverrideConfiguration(overrideConfiguration);
  }
}
