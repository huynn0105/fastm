// FlutterModule.h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@import Flutter;
@import FlutterPluginRegistrant;

@interface FlutterModule : RCTEventEmitter <RCTBridgeModule>

@property (nonatomic,strong) FlutterEngine *flutterEngine;
@property (nonatomic,strong) FlutterMethodChannel *channel;
+ (void)initWithFlutterEngine:(FlutterEngine * _Nonnull)flutterEngine;

@end
