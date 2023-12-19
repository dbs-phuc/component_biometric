#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Component, NSObject)

RCT_EXTERN_METHOD(multiply:
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
