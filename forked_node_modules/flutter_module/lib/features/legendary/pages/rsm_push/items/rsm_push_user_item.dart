import 'package:flutter/material.dart';

import '../../../../../common/colors.dart';
import '../../../../../common/styles.dart';
import '../../../../../common/widgets/avatar/chat_avatar.dart';
import '../../../../../common/widgets/buttons.dart';
import '../../../../../common/widgets/images.dart';
import '../../../../../models/collaborator/collaborator_rsm_push_model.dart';

class RSMPushUserItem extends StatelessWidget {
  const RSMPushUserItem({super.key, this.item, this.onDelete});

  final CollaboratorRsmPushModel? item;
  final Function()? onDelete;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          width: 60,
          height: 56,
          child: Stack(
            children: [
              ChatAvatar(url: item?.avatarImage ?? '', name: item?.fullName ?? '', size: 56),
              Container(
                alignment: Alignment.topRight,
                transform: Matrix4.translationValues(4, 0, 0),
                child: SplashButton(
                  onTap: onDelete,
                  child: const AppImage.asset(asset: 'ic_delete_user', width: 24, height: 24),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 4),
        Padding(
          padding: const EdgeInsets.only(right: 4),
          child: Text(
            item?.fullName ?? '',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: UITextStyle.regular.copyWith(
              color: UIColors.lightBlack,
            ),
          ),
        )
      ],
    );
  }
}
