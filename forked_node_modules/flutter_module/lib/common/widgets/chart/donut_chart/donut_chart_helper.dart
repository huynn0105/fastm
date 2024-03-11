import 'dart:math';

import 'package:flutter/material.dart';

import 'donut_chart_data.dart';

class DonutChartHelper {
  DonutChartHelper._();

  static double degreeToRadian(double degree) => degree * pi / 180;

  static double radianToDegree(double radian) => radian * 180 / pi;
}

/// It lerps a [DonutChartSectionData] to another [DonutChartSectionData] (handles animation for updating values)
class DonutChartDataTween extends Tween<DonutChartData> {
  DonutChartDataTween({
    required DonutChartData begin,
    required DonutChartData end,
  }) : super(begin: begin, end: end);

  /// Lerps a [DonutChartSectionData] based on [t] value, check [Tween.lerp].
  @override
  DonutChartData lerp(double t) => begin!.lerp(begin!, end!, t);
}

enum DonutChartAction {
  init(
    Duration.zero,
    Curves.linear,
  ),
  loading(
    Duration(milliseconds: 500),
    Curves.linear,
  ),
  empty(
    Duration(milliseconds: 1000),
    Curves.fastOutSlowIn,
  ),
  show(
    Duration(milliseconds: 1000),
    Curves.fastOutSlowIn,
  ),
  focus(
    Duration(milliseconds: 250),
    Curves.linear,
  );

  final Duration duration;
  final Curve curve;

  const DonutChartAction(this.duration, this.curve);
}

extension ExDonutChartAction on DonutChartAction {
  bool get isInit => this == DonutChartAction.init;

  bool get isEmpty => this == DonutChartAction.empty;

  bool get isLoading => this == DonutChartAction.loading;

  bool get isShow => this == DonutChartAction.show;

  bool get isFocus => this == DonutChartAction.focus;
}

enum DonutLegendGrowthStatus {
  up,
  down;
}

extension ExDonutLegendGrowthStatus on DonutLegendGrowthStatus {
  bool get isUp => this == DonutLegendGrowthStatus.up;

  bool get isDown => this == DonutLegendGrowthStatus.down;
}
