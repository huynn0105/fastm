import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../../common/colors.dart';
import '../../../../../common/styles.dart';
import '../../../../../common/widgets/buttons.dart';
import '../../../../../common/widgets/images.dart';

class MTradeSearchTextField extends StatelessWidget {
  const MTradeSearchTextField({
    Key? key,
    this.controller,
    this.hintText,
    this.onChanged,
    this.onSubmitted,
    this.onCleared,
    this.onTap,
    this.autoFocus = false,
    this.autoClear = true,
    this.showClearButton = false,
    this.readOnly = false,
    this.textAlign = TextAlign.start,
    this.borderRadius = const BorderRadius.all(Radius.circular(25)),
    this.borderColor = UIColors.white,
    this.prefixIcon,
    this.height = 40,
    this.inputFormatter,
    this.keyboardType,
    this.inputFormatters,
    this.fillColor = UIColors.white,
    this.textColor = UIColors.defaultText,
    this.hintColor = UIColors.grayText,
    this.iconColor = UIColors.grayText,
    this.showInputBorder = true,
  }) : super(key: key);

  final TextEditingController? controller;
  final bool autoFocus;
  final bool autoClear;
  final bool showClearButton;
  final String? hintText;
  final Function(String)? onChanged;
  final Function(String)? onSubmitted;
  final VoidCallback? onCleared;
  final VoidCallback? onTap;
  final TextAlign textAlign;
  final bool readOnly;
  final BorderRadius borderRadius;
  final Widget? prefixIcon;
  final Color borderColor;
  final double height;
  final List<TextInputFormatter>? inputFormatter;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final Color fillColor;
  final Color textColor;
  final Color hintColor;
  final Color iconColor;
  final bool showInputBorder;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: TextField(
        controller: controller,
        readOnly: readOnly,
        autofocus: autoFocus,
        cursorWidth: 2,
        // cursorHeight: 25,
        cursorColor: UIColors.primaryColor,
        cursorRadius: const Radius.circular(1),
        style: UITextStyle.medium.copyWith(
          fontSize: 16,
          height: 1,
          color: textColor,
        ),
        onTap: onTap,
        onChanged: onChanged,
        onSubmitted: onSubmitted,
        textAlign: textAlign,
        inputFormatters: inputFormatters,
        decoration: InputDecoration(
          filled: true,
          fillColor: fillColor,
          hintText: hintText,
          hintStyle: UITextStyle.regular.copyWith(
            fontSize: 14,
            height: 1,
            color: hintColor,
          ),
          enabledBorder: !showInputBorder
              ? InputBorder.none
              : OutlineInputBorder(
                  borderRadius: borderRadius,
                  borderSide: BorderSide(
                    color: borderColor,
                  ),
                ),
          focusedBorder: !showInputBorder
              ? InputBorder.none
              : OutlineInputBorder(
                  borderRadius: borderRadius,
                  borderSide: BorderSide(
                    color: readOnly ? borderColor : UIColors.primaryColor,
                  ),
                ),
          contentPadding: const EdgeInsets.symmetric(
            vertical: 8,
          ),
          prefixIconConstraints: const BoxConstraints(
            maxWidth: 48,
            maxHeight: 48,
          ),
          prefixIcon: prefixIcon ??
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: AppImage.asset(
                  asset: "ic_search_outline",
                  width: 24,
                  height: 24,
                  color: iconColor,
                ),
              ),
          suffixIconConstraints: const BoxConstraints(
            maxWidth: 48,
            maxHeight: 48,
          ),
          suffixIcon: !showClearButton
              ? const SizedBox(
                  width: 48,
                  height: 48,
                )
              : Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: AppSplashButton(
                    onTap: () {
                      if (autoClear) {
                        controller?.clear();
                      }
                      onCleared?.call();
                    },
                    child: const AppImage.asset(
                      asset: "ic_mtrade_clear_x",
                      width: 24,
                      height: 24,
                    ),
                  ),
                ),
        ),
        keyboardType: keyboardType,
      ),
    );
  }
}
