import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../colors.dart';
import '../styles.dart';

class ToastProvider {
  ToastProvider._();

  static final ToastProvider instance = ToastProvider._();

  final FToast _toast = FToast();

  show({
    required BuildContext context,
    required String message,
    Color textColor = UIColors.white,
    Color backgroundColor = UIColors.blurBackground,
    Duration duration = const Duration(seconds: 1),
    ToastGravity gravity = ToastGravity.TOP,
  }) {
    _toast
      ..init(context)
      ..removeQueuedCustomToasts()
      ..showToast(
        gravity: gravity,
        toastDuration: duration,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(4),
          ),
          child: Text(
            message,
            style: UITextStyle.regular.copyWith(
              color: textColor,
            ),
          ),
        ),
      );
  }

  showCopy({
    required BuildContext context,
  }) {
    show(
      context: context,
      message: "Đã Copy !!!",
      backgroundColor: UIColors.darkBlue,
    );
  }

  showSuccess({
    required BuildContext context,
    required String message,
  }) {
    show(
      context: context,
      message: message,
      textColor: UIColors.white,
      backgroundColor: UIColors.green,
    );
  }

  display(String message) {
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.TOP,
      timeInSecForIosWeb: 5,
      backgroundColor: Colors.black,
      textColor: Colors.white,
      fontSize: 13,
    );
  }
}
