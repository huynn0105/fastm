import 'platform_stub_registry.dart'
if (dart.library.io) 'platform_mobile_registry.dart'
if (dart.library.html) 'platform_web_registry.dart';


abstract class PlatformRegistry {
  factory PlatformRegistry() => getInstance();

  String initFrame(String url, {String? key});

  void hideSplashScreen();
}