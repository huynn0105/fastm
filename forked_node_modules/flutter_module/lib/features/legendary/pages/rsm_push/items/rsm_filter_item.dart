import 'package:flutter/material.dart';

import '../../../../../common/colors.dart';
import '../../../../../common/styles.dart';
import '../../../../../common/widgets/buttons.dart';

class RSMFilterItem extends StatelessWidget {
  const RSMFilterItem({
    super.key,
    this.selected = false,
    this.label = '',
    this.onTap,
  });

  final String label;
  final bool selected;
  final Function()? onTap;

  @override
  Widget build(BuildContext context) {
    return SplashButton(
      onTap: onTap,
      child: Container(
        height: 32,
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          color: selected ? UIColors.primaryColor : UIColors.whiteSmoke,
        ),
        child: Text(
          label,
          style: UITextStyle.regular.copyWith(
            color: selected ? UIColors.white : UIColors.grayText,
            fontWeight: selected ? FontWeight.w500 : FontWeight.w400,
          ),
        ),
      ),
    );
  }
}
