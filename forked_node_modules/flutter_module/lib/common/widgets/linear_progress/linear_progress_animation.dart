import 'package:flutter/animation.dart';

class LinearProgressAnimation {
  LinearProgressAnimation({
    required this.animationController,
  })  : positionX =
            Tween<double>(begin: 0, end: 90).animate(animationController),
        scaleX = TweenSequence([
          TweenSequenceItem(
            tween: Tween<double>(begin: 10, end: 40)
                .chain(CurveTween(curve: Curves.easeIn)),
            weight: 40.0,
          ),
          TweenSequenceItem(
            tween: Tween<double>(begin: 40, end: 10)
                .chain(CurveTween(curve: Curves.decelerate)),
            weight: 60.0,
          ),
        ]).animate(animationController);
  final AnimationController animationController;
  final Animation<double> scaleX;
  final Animation<double> positionX;
}
