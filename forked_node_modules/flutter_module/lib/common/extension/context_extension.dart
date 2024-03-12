import 'package:flutter/cupertino.dart';

extension ExBuildContext on BuildContext {
  MediaQueryData get mediaQuery => MediaQuery.of(this);
}