import 'package:flutter/material.dart';

class RectangularIndicator extends Decoration {
  /// Border radius of the indicator, default to 5.
  final BorderRadius borderRadius;

  /// Color of the indicator, default set to [Colors.black]
  final Color color;

  /// Horizontal padding of the indicator, default set to 0
  final double horizontalPadding;

  /// Vertical padding of the indicator, default set to 0
  final double verticalPadding;

  /// [PagingStyle] determines if the indicator should be fill or stroke, default to fill
  final PaintingStyle paintingStyle;

  /// StrokeWidth, used for [PaintingStyle.stroke], default set to 0
  final double strokeWidth;

  const RectangularIndicator({
    this.borderRadius = BorderRadius.zero,
    this.color = Colors.black,
    this.horizontalPadding = 0,
    this.verticalPadding = 0,
    this.paintingStyle = PaintingStyle.fill,
    this.strokeWidth = 1,
  });

  @override
  CustomPainter createBoxPainter([VoidCallback? onChanged]) {
    return CustomPainter(
      this,
      onChanged,
      color: color,
      bottomLeftRadius: borderRadius.bottomLeft.x,
      bottomRightRadius: borderRadius.bottomRight.x,
      topLeftRadius: borderRadius.topLeft.x,
      topRightRadius: borderRadius.topRight.x,
      horizontalPadding: horizontalPadding,
      verticalPadding: verticalPadding,
      paintingStyle: paintingStyle,
      strokeWidth: strokeWidth,
    );
  }
}

class CustomPainter extends BoxPainter {
  final RectangularIndicator decoration;
  final double topRightRadius;
  final double topLeftRadius;
  final double bottomRightRadius;
  final double bottomLeftRadius;
  final Color color;
  final double horizontalPadding;
  final double verticalPadding;
  final PaintingStyle paintingStyle;
  final double strokeWidth;

  CustomPainter(
    this.decoration,
    VoidCallback? onChanged, {
    required this.topRightRadius,
    required this.topLeftRadius,
    required this.bottomRightRadius,
    required this.bottomLeftRadius,
    required this.color,
    required this.horizontalPadding,
    required this.verticalPadding,
    required this.paintingStyle,
    required this.strokeWidth,
  }) : super(onChanged);

  @override
  void paint(Canvas canvas, Offset offset, ImageConfiguration configuration) {
    assert(
      horizontalPadding >= 0,
    );
    assert(
      horizontalPadding < configuration.size!.width / 2,
      "Padding must be less than half of the size of the tab",
    );
    assert(
      verticalPadding < configuration.size!.height / 2 && verticalPadding >= 0,
    );
    assert(
      strokeWidth >= 0 &&
          strokeWidth < configuration.size!.width / 2 &&
          strokeWidth < configuration.size!.height / 2,
    );

    // offset is the position from where the decoration should be drawn.
    // configuration.size tells us about the height and width of the tab.
    Size mySize = Size(
      configuration.size!.width - (horizontalPadding * 2),
      configuration.size!.height - (2 * verticalPadding),
    );

    Offset myOffset = Offset(
      offset.dx + (horizontalPadding),
      offset.dy + verticalPadding,
    );

    final Rect rect = myOffset & mySize;
    final Paint paint = Paint()
      ..color = color
      ..style = paintingStyle
      ..strokeWidth = 3;

    canvas.drawRRect(
      RRect.fromRectAndCorners(
        rect,
        bottomRight: Radius.circular(bottomRightRadius),
        bottomLeft: Radius.circular(bottomLeftRadius),
        topLeft: Radius.circular(topLeftRadius),
        topRight: Radius.circular(topRightRadius),
      ),
      paint,
    );
  }
}
