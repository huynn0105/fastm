import 'dart:async';

import 'package:flutter/foundation.dart';

class CountDownUtil {
  CountDownUtil({required this.seconds});

  final int seconds;

  Timer? _timer;
  ValueNotifier<int> result = ValueNotifier<int>(-1);

  start({
    Function()? onCompleted,
  }) {
    if (_timer != null) {
      return;
    }
    _timer = Timer.periodic(
      const Duration(seconds: 1),
      (timer) {
        if (seconds == 0) {
          result.value = 0;
          return;
        }
        if (timer.tick >= seconds) {
          onCompleted?.call();
          timer.cancel();
          return;
        }
        result.value = seconds - timer.tick;
      },
    );
  }

  pause() {
    _timer?.cancel();
    _timer = null;
  }

  cancel() {
    result.dispose();
    _timer?.cancel();
    _timer = null;
  }

  Duration get duration => Duration(seconds: result.value);

  static String format(int remainSeconds) {
    Duration duration = Duration(seconds: remainSeconds);
    int days = duration.inDays;
    int hours = duration.inHours.remainder(24);
    int minutes = duration.inMinutes.remainder(60);
    int seconds = duration.inSeconds.remainder(60);
    return [
      if (days > 0) "${days}N",
      if (hours > 0) "${hours}H",
      if (minutes > 0) "${minutes}M",
      if (seconds > 0 && (days + hours + minutes) == 0) "${seconds}S",
    ].join(" : ");
  }

  static String formatDay(int remainSeconds) {
    Duration duration = Duration(seconds: remainSeconds);
    int days = duration.inDays;
    int hours = duration.inHours.remainder(24);
    int minutes = duration.inMinutes.remainder(60);
    int seconds = duration.inSeconds.remainder(60);
    return [
      if (days > 0) "$days ngày,",
      if (hours > 0) "$hours giờ",
      if (minutes > 0) "$minutes phút",
      if (seconds > 0 && (days + hours + minutes) == 0) "$seconds giây",
    ].join(" ");
  }

  static String formatDayFormatUntilHour(int remainSeconds) {
    Duration duration = Duration(seconds: remainSeconds);
    int days = duration.inDays;
    int hours = duration.inHours.remainder(24);
    int minutes = duration.inMinutes.remainder(60);
    int seconds = duration.inSeconds.remainder(60);
    return [
      if (days > 0) "$days ngày,",
      if (hours >= 0) "$hours giờ",
      if (minutes >= 0) "$minutes phút",
      if (seconds > 0 && (days + hours + minutes) == 0) "$seconds giây",
    ].join(" ");
  }

  static String formatDayFormatUntilMinute(int remainSeconds) {
    Duration duration = Duration(seconds: remainSeconds);
    int days = duration.inDays;
    int hours = duration.inHours.remainder(24);
    int minutes = duration.inMinutes.remainder(60);
    int seconds = duration.inSeconds.remainder(60);
    return [
      if (days > 0) "$days ngày,",
      if (hours > 0) "$hours giờ",
      if (minutes >= 0) "$minutes phút",
      if (seconds >= 0 && (days + hours) == 0) "$seconds giây",
    ].join(" ");
  }

  static String formatDateAgo(int remainSeconds) {
    Duration duration = Duration(seconds: remainSeconds);
    int days = duration.inDays;
    if (days > 0) return '$days ngày';

    int hours = duration.inHours.remainder(24);
    if (hours > 0) {
      return '$hours giờ';
    }
    int minutes = duration.inMinutes.remainder(60);
    if (minutes < 1) return '1 phút';
    return '$minutes phút';
  }

  static String formatTimeChecking(int remainSeconds) {
    Duration duration = Duration(seconds: remainSeconds);
    int days = duration.inDays;
    int hours = duration.inHours.remainder(24);
    int minutes = duration.inMinutes.remainder(60);
    int seconds = duration.inSeconds.remainder(60);
    return [
      if (days > 0) "$days ngày,",
      if (hours > 0) "$hours giờ",
      if (minutes > 0) "$minutes phút",
      if (seconds >= 0) "${seconds.toString().padLeft(2, '0')} giây",
    ].join(" ");
  }
}
