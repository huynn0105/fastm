import 'dart:async';
import 'dart:ui';

class DebounceUtil {
  DebounceUtil({required this.milliseconds});

  final int milliseconds;
  Timer? _timer;

  run(VoidCallback action) {
    if (_timer != null) {
      _timer?.cancel();
    }
    _timer = Timer(Duration(milliseconds: milliseconds), action);
  }

  cancel() {
    _timer?.cancel();
    _timer = null;
  }
}
