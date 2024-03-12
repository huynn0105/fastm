import 'dart:math';

import 'package:flutter/material.dart';

import '../../../colors.dart';
import '../../../styles.dart';
import 'donut_chart.dart';
import 'donut_chart_controller.dart';
import 'donut_chart_helper.dart';

class AnimatedDonutChart extends StatefulWidget {
  const AnimatedDonutChart({
    super.key,
    required this.controller,
    required this.onDisplayTitle,
    required this.subtitle,
    this.enableDisplayTitle = true,
    this.size = 132,
    this.totalValue,
  });

  final DonutChartController controller;
  final String Function(double value) onDisplayTitle;
  final String subtitle;
  final bool enableDisplayTitle;
  final double size;
  final double? totalValue;

  @override
  State<AnimatedDonutChart> createState() => _AnimatedDonutChartState();
}

class _AnimatedDonutChartState extends State<AnimatedDonutChart> with TickerProviderStateMixin {
  late final DonutChartController chartController;
  late final AnimationController animationController;
  late final Animation<double> animation;

  final double donutSize = 14;

  double get size => widget.size;

  @override
  void initState() {
    super.initState();
    chartController = widget.controller;

    animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: animationController,
        curve: Curves.linear,
      ),
    );

    animation.addListener(onAnimationListen);
    chartController.addListener(onDonutChartListen);
  }

  @override
  void dispose() {
    if (animation is CurvedAnimation) {
      (animation as CurvedAnimation).removeListener(onAnimationListen);
      (animation as CurvedAnimation).dispose();
    }
    chartController.removeListener(onDonutChartListen);
    animationController.dispose();
    super.dispose();
  }

  @override
  void setState(VoidCallback fn) {
    if (mounted) {
      super.setState(fn);
    }
  }

  @override
  Widget build(BuildContext context) {
    double total = 0;
    if (widget.totalValue != null) {
      total = widget.totalValue!;
    } else {
      total = chartController.getData().isLoading || chartController.action.isEmpty
          ? 0.0
          : chartController.getData().sumValue();
    }

    ///
    return Stack(
      fit: StackFit.loose,
      alignment: Alignment.center,
      children: [
        AnimatedBuilder(
          animation: animation,
          builder: (context, child) {
            final status = animation.status;
            final angle = animation.value * 2 * pi;
            return Transform.rotate(
              angle: status == AnimationStatus.forward ? angle : -angle,
              child: child!,
            );
          },
          child: DonutChart(
            size: size,
            donutSize: donutSize,
            data: chartController.getData(),
            curve: chartController.action.curve,
            duration: chartController.action.duration,
          ),
        ),
        Container(
          width: size - donutSize * 2,
          height: size - donutSize * 2,
          alignment: Alignment.center,
          padding: const EdgeInsets.all(5),
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
          ),
          child: AnimatedTitleDonutChart(
            value: total,
            enableDisplayTitle: widget.enableDisplayTitle,
            onDisplayTitle: widget.onDisplayTitle,
            subtitle: widget.subtitle,
            curve: chartController.action.curve,
            duration: chartController.delayedDuration + chartController.action.duration,
          ),
        ),
      ],
    );
  }

  void onDonutChartListen() {
    if (chartController.action == DonutChartAction.loading) {
      onLoading();
    }
    if (chartController.action == DonutChartAction.show || chartController.action == DonutChartAction.empty) {
      onShow();
    }
    if (chartController.action == DonutChartAction.focus) {
      onFocus();
    }
  }

  void onAnimationListen() {
    if (!mounted) {
      return;
    }
    final actions = [
      DonutChartAction.show,
      DonutChartAction.focus,
      DonutChartAction.empty,
    ];
    if (animationController.isCompleted) {
      if (actions.contains(chartController.action)) {
        animationController.stop();
      } else {
        animationController.reverse();
      }
      return;
    }
    if (animationController.isDismissed) {
      if (actions.contains(chartController.action)) {
        animationController.stop();
      } else {
        animationController.forward();
      }
      return;
    }
  }

  void onLoading() {
    if (animationController.isAnimating) {
      return;
    }
    if (animationController.isDismissed) {
      animationController.forward();
    } else if (animationController.isCompleted) {
      animationController.reverse();
    }
    setState(() {});
  }

  void onShow() {
    setState(() {});
  }

  void onFocus() {
    setState(() {});
  }
}

class AnimatedTitleDonutChart extends ImplicitlyAnimatedWidget {
  const AnimatedTitleDonutChart({
    super.key,
    required this.value,
    required this.onDisplayTitle,
    required this.subtitle,
    required super.duration,
    super.curve,
    super.onEnd,
    this.enableDisplayTitle = true,
  });

  final double value;
  final String Function(double value) onDisplayTitle;
  final String subtitle;
  final bool enableDisplayTitle;

  @override
  ImplicitlyAnimatedWidgetState<ImplicitlyAnimatedWidget> createState() {
    return _AnimatedTitleState();
  }
}

class _AnimatedTitleState extends AnimatedWidgetBaseState<AnimatedTitleDonutChart> {
  Tween<double>? tween;

  @override
  Widget build(BuildContext context) {
    final value = tween!.animate(animation).value;
    final title = widget.onDisplayTitle(value);
    if (!widget.enableDisplayTitle) {
      return const SizedBox();
    }
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Flexible(
          child: Text(
            title,
            style: UITextStyle.semiBold.copyWith(
              height: 1.2,
              fontSize: 18,
            ),
            textAlign: TextAlign.center,
          ),
        ),
        if (widget.subtitle.isNotEmpty)
          Flexible(
            child: Text(
              widget.subtitle,
              style: UITextStyle.regular.copyWith(
                height: 1,
                fontSize: 14,
                color: UIColors.grayText,
              ),
              textAlign: TextAlign.center,
            ),
          ),
      ],
    );
  }

  @override
  void forEachTween(TweenVisitor<dynamic> visitor) {
    tween = visitor(
      tween,
      widget.value,
      (dynamic value) {
        return Tween<double>(
          begin: value as double,
          end: widget.value,
        );
      },
    ) as Tween<double>?;
  }
}
