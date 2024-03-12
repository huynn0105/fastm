// FlutterModule.java

package com.digipay.mfast;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import io.flutter.embedding.android.FlutterActivity;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import java.util.*;

public class FlutterModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public FlutterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "FlutterModule";
    }

    @ReactMethod
    public void startFlutterActivity(String eventName, String args, boolean isDebug, Callback callback) {
        if (FlutterModuleActivity.getInstance() != null) {
            new Timer().schedule(
                    new TimerTask() {
                        @Override
                        public void run() {
                            Log.d("deeplinkkkkkkkkkkkkkkkkkkkkk: ", eventName + ", args: " + args);
                            sendEvent("deeplink", args);
                        }
                    }, 600);
        } else {
            Activity currentActivity = reactContext.getCurrentActivity();
            // we can pass arguments to the Intent
            currentActivity.startActivity(
                    new FlutterActivity.NewEngineIntentBuilder(FlutterModuleActivity.class)
                            .build(currentActivity)
                            .putExtra(FlutterModuleActivity.INITIAL_EVENT, eventName)
                            .putExtra(FlutterModuleActivity.INITIAL_ARGS, args));
        }
        callback.invoke("Received eventName: " + eventName + ", args: " + args);
    }

    @ReactMethod
    public void sendEvent(String eventName, String args) {
        if (FlutterModuleActivity.getInstance() != null) {
            final String finalEventName = eventName;
            final String finalArgs = args;
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    Log.d("FlutterModuleRn", "asdashdkjahsdajsdhakjsd");
                    FlutterModuleActivity.getInstance().sendEventToFlutter(finalEventName, finalArgs);
                }
            });
        }

    }

    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls.
    }
}
