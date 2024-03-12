// FlutterModule.m

@import Flutter;
@import UIKit;
#import "FlutterModule.h"

NSString* const CHANNEL = @"mfast/flutter";

static FlutterEngine *_flutterEngine = nil;
static BOOL init = NO;

@implementation FlutterModule
{
  bool hasListeners;
}

RCT_EXPORT_MODULE(FlutterModule)

+ (void)initWithFlutterEngine:(FlutterEngine * _Nonnull)flutterEngine {
    _flutterEngine = flutterEngine;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

// Remove this `init` function if you want to provide `flutterEngine` from host app's AppDelegate
- (instancetype)init {
    self = [super init];
    if (self) {
        // Init Flutter Engine
        self.flutterEngine = [[FlutterEngine alloc] initWithName:@"io.flutter" project:nil];
        [self.flutterEngine runWithEntrypoint:nil];
        [GeneratedPluginRegistrant registerWithRegistry:self.flutterEngine];
    }
    return self;
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"initArgs", @"exit", @"OPEN_VN_PAY", @"LOG_EVENT", @"TRACKING_EVENT", @"FLUTTER_EVENT"];
}

RCT_EXPORT_METHOD(startFlutterActivity:(NSString *)eventName args:(NSString *)args isDebug:(BOOL *)isDebug callback:(RCTResponseSenderBlock)callback)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.channel != nil) {
          [self sendEvent: @"deeplink" args: args];
          callback(@[[NSString stringWithFormat: @"Received eventName: %@, args: %@", eventName, args]]);
          return;
        }
        self.flutterEngine = [[FlutterEngine alloc] initWithName:@"mfast" project:nil];
        [self.flutterEngine runWithEntrypoint:nil];
        [GeneratedPluginRegistrant registerWithRegistry:self.flutterEngine];
        FlutterViewController *flutterViewController;
         if (self.flutterEngine == nil && _flutterEngine == nil) {
            // It is not recommended, but we can create a FlutterViewController with an implicit FlutterEngine
            // https://flutter.dev/docs/development/add-to-app/ios/add-flutter-screen?tab=engine-objective-c-tab#alternatively---create-a-flutterviewcontroller-with-an-implicit-flutterengine
            flutterViewController = [[FlutterViewController alloc] initWithProject:nil nibName:nil bundle:nil];
         } else {
            FlutterEngine *fe = self.flutterEngine == nil ? _flutterEngine : self.flutterEngine;
            // init FlutterViewController with engine provided by host app
            flutterViewController = [[FlutterViewController alloc] initWithEngine:fe nibName:nil bundle:nil];
         }
        // fix ui
        [flutterViewController setModalPresentationStyle:UIModalPresentationFullScreen];

        FlutterMethodChannel* channel = [FlutterMethodChannel
                                         methodChannelWithName: CHANNEL
                                         binaryMessenger: flutterViewController.binaryMessenger];
        self.channel = channel;

        [channel setMethodCallHandler:^(FlutterMethodCall* call, FlutterResult result) {
          if ([call.method isEqualToString:@"exit"]) {
            self.channel = nil;
            init = NO;
            UIViewController *rootController = UIApplication.sharedApplication.delegate.window.rootViewController;
            [rootController dismissModalViewControllerAnimated:YES];
          }
          // This method is invoked on the UI thread.
          if (self->hasListeners) { // Only send events if anyone is listening
            NSString* data = call.arguments;
            [self sendEventWithName:call.method body:data];
          }
          result(nil);
        }];

        void (^flutterViewDidRender)(void) = ^() {
          // set initial data
          init = YES;
          [self sendEvent: eventName args: args];
        };

        [flutterViewController setFlutterViewDidRenderCallback: flutterViewDidRender];

        UIViewController *rootController = UIApplication.sharedApplication.delegate.window.rootViewController;
        [rootController presentViewController:flutterViewController animated:YES completion:nil];
        callback(@[[NSString stringWithFormat: @"Received eventName: %@, args: %@", eventName, args]]);
        NSTimeInterval delayInSeconds = 0.8;
        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
        dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
            @try {
                if (init != YES) {
                    [rootController presentViewController:flutterViewController animated:YES completion:nil];
                }
             }
             @catch (NSException *exception) {
                NSLog(@"%@", exception.reason);
             }
             @finally {
                NSLog(@"Finally condition");
             }
        });
    });
}

RCT_EXPORT_METHOD(sendEvent:(NSString *)eventName args:(NSString *)args)
{
  if (self.channel != nil) {
    [self.channel invokeMethod: eventName arguments: args];
  }
}

@end
