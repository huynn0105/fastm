import 'package:flutter/material.dart';

import 'donut_chart_data.dart';
import 'donut_chart_helper.dart';
import 'donut_chart_painter.dart';

class DonutChart extends ImplicitlyAnimatedWidget {
  const DonutChart({
    super.key,
    required this.size,
    required this.data,
    required super.duration,
    super.curve,
    super.onEnd,
    this.donutSize = 15,
  });

  final double size;
  final double donutSize;
  final DonutChartData data;

  @override
  ImplicitlyAnimatedWidgetState<ImplicitlyAnimatedWidget> createState() {
    return _DonutChartState();
  }
}

class _DonutChartState extends AnimatedWidgetBaseState<DonutChart> {
  DonutChartDataTween? donutChartDataTween;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: CustomPaint(
        painter: DonutChartPainter(
          donutSize: widget.donutSize,
          data: donutChartDataTween!.evaluate(animation),
        ),
        child: const AspectRatio(
          aspectRatio: 1,
        ),
      ),
    );
  }

  @override
  void forEachTween(TweenVisitor<dynamic> visitor) {
    donutChartDataTween = visitor(
      donutChartDataTween,
      widget.data,
      (dynamic value) => DonutChartDataTween(
        begin: value as DonutChartData,
        end: widget.data,
      ),
    ) as DonutChartDataTween?;
  }
}
