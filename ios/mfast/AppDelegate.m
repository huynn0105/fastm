/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <ReactNativeMoEngage/MoEngageInitializer.h>
#import <MoEngageSDK/MoEngageSDK.h>

#import "RNSplashScreen.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
//#import <ZaloSDK/ZaloSDK.h>
#import <CallAppSDK/CallAppInterface.h>

#import "RNSplashScreen.h"
#import <CodePush/CodePush.h>
#import <RNBranch/RNBranch.h>
#import <AppsFlyerLib/AppsFlyerLib.h>
#import "GoogleMaps/GoogleMaps.h"
#import <Firebase.h>
#import "RNFBMessagingModule.h"

NSString * deeplinkScheme = @"mfastmobiledev://";
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;

  if([FIRApp defaultApp] == nil){
    [FIRApp configure];
  }
  [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
  [FBSDKApplicationDelegate.sharedInstance initializeSDK];
  [GMSServices provideAPIKey:@"AIzaSyDnuJjwZlDYChN57Lit45mh_heGUU-ozZQ"];
  //  [FBSDKSettings setAutoInitEnabled:YES];
  //  [[ZaloSDK sharedInstance] initializeWithAppId:@"3061511678273864526"];

  NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"Info" ofType:@"plist"];
  NSDictionary *plistData = [NSDictionary dictionaryWithContentsOfFile:plistPath];
  NSDictionary *moEngageDict = plistData[@"MoEngage"];
  NSString *moEngageAppID = moEngageDict[@"MoEngage_APP_ID"];

  MoEngageSDKConfig *config = [[MoEngageSDKConfig alloc] initWithAppId:[NSString stringWithFormat:@"%@", moEngageAppID] dataCenter: MoEngageDataCenterData_center_01];
  [[MoEngageInitializer sharedInstance] initializeDefaultSDKConfig:config andLaunchOptions:launchOptions];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"mfast"
                                            initialProperties:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen showSplash:@"LaunchScreen" inRootView:rootView];
  [CallAppInterface setHomeViewController:self.window.rootViewController];

  return YES;
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{

}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  //  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 2 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
  //    [[FIRDatabase database] goOnline];
  //  });
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  if([[FBSDKApplicationDelegate sharedInstance] application:application
                                                    openURL:url
                                          sourceApplication:sourceApplication
                                                 annotation:annotation]) {
    return YES;
  };

  if( [RCTLinkingManager application:application openURL:url
              sourceApplication     :sourceApplication annotation:annotation]){
    return YES;
  }


  // fix open deeplink with mfastmobile
  NSString* stringURL = [url absoluteString];
  if (([stringURL hasPrefix:deeplinkScheme] == YES) &&
      ([RCTLinkingManager application:application
                              openURL:url
                    sourceApplication:nil
                           annotation:nil] == YES)) {
    return YES;
  }

  return NO;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    [[MoEngageSDKMessaging sharedInstance] setPushToken:deviceToken];
  [[AppsFlyerLib shared] registerUninstall:deviceToken];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{

  [[MoEngageSDKMessaging sharedInstance] userNotificationCenter:center didReceive:response];
  completionHandler();
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  if (@available(iOS 14.0, *)) {
    completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionList | UNNotificationPresentationOptionBanner);
  } else {
    // Fallback on earlier versions
    completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
  }

}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  
  if ([RNBranch application:application openURL:url options:options])  {
         // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
    return YES;
  }

  if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
      NSLog(@"fetch app link %@", url);
    return YES;
  }
     
  
  
  //    [[ZDKApplicationDelegate sharedInstance] application:application openURL:url options:options];
  
  // fix open deeplink with mfastmobile
  NSString* stringURL = [url absoluteString];
  if (([stringURL hasPrefix:deeplinkScheme] == YES) &&
      ([RCTLinkingManager application:application openURL:url options:options])) {
    return YES;
  }
  
  return false;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  return [RNBranch continueUserActivity:userActivity];
}

@end
