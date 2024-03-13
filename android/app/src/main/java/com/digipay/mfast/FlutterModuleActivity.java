package com.digipay.mfast;

import android.os.Bundle;

import androidx.annotation.NonNull;
import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugin.common.MethodChannel.MethodCallHandler;
import io.flutter.plugin.common.MethodChannel.Result;
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import android.os.PersistableBundle;
import androidx.annotation.Nullable;
import android.util.Log;

public class FlutterModuleActivity extends FlutterActivity {
    private static final String CHANNEL = "mfast/flutter";

    public static final String INITIAL_EVENT = "INITIAL_EVENT";
    public static final String INITIAL_ARGS = "INITIAL_ARGS";

    // React Native event emitter. Uset to send events to the host React Native app
    private DeviceEventManagerModule.RCTDeviceEventEmitter reactNativeEventEmitter = null;

    // Flutter channel
    private MethodChannel channel = null;

    static FlutterModuleActivity flutterModuleActivity;
    public static FlutterModuleActivity getInstance(){
        return flutterModuleActivity;
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        flutterModuleActivity = this;
    }

    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        super.configureFlutterEngine(flutterEngine);
        ReactApplication reactApplication = (ReactApplication) getApplication();

        ReactInstanceManager reactInstanceManager = reactApplication
                .getReactNativeHost()
                .getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

        if(reactContext != null) {
            reactNativeEventEmitter = reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        } else {
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(ReactContext context) {
                    reactNativeEventEmitter = context
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
                    reactInstanceManager.removeReactInstanceEventListener(this);
                }
            });
        }

        this.channel = new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), CHANNEL);
        channel.setMethodCallHandler(
                new MethodCallHandler() {
                    @Override
                    public void onMethodCall(MethodCall call, Result result) {
                        // This method is invoked on the main thread.
                        String data = call.arguments();
                        // pass events from Flutter channel to React Native
                        reactNativeEventEmitter.emit(call.method, data);
                        result.success(null);
                        if (call.method.equals("exit")) {
//                            flutterModuleActivity = null;
                            finish();
                        }
                    }
                }
        );
    }

    @Override
    public void onDestroy() {
        flutterModuleActivity = null;
        super.onDestroy();
    }

    @Override
    public void onFlutterUiDisplayed() {
        Bundle extras = this.getIntent().getExtras();
        String eventName = extras.getString(INITIAL_EVENT);
        String args = extras.getString(INITIAL_ARGS);
        sendEventToFlutter(eventName, args);
    }

    public void sendEventToFlutter(String eventName, String args) {
        channel.invokeMethod(eventName, args);
    }
}
