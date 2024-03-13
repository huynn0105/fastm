import 'package:flutter/material.dart';

class SeparatedColumn extends StatelessWidget {
  const SeparatedColumn({
    Key? key,
    required this.separatorBuilder,
    required this.children,
    this.textBaseline,
    this.textDirection,
    this.showOuterSeparators = false,
    this.mainAxisSize = MainAxisSize.max,
    this.verticalDirection = VerticalDirection.down,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.crossAxisAlignment = CrossAxisAlignment.center,
  }) : super(key: key);

  final List<Widget> children;
  final TextBaseline? textBaseline;
  final bool showOuterSeparators;
  final TextDirection? textDirection;
  final MainAxisSize mainAxisSize;
  final VerticalDirection verticalDirection;
  final MainAxisAlignment mainAxisAlignment;
  final CrossAxisAlignment crossAxisAlignment;
  final IndexedWidgetBuilder separatorBuilder;

  @override
  Widget build(BuildContext context) {
    final children = <Widget>[];
    final index = showOuterSeparators ? 1 : 0;

    if (this.children.isNotEmpty) {
      if (showOuterSeparators) {
        children.add(separatorBuilder(context, 0));
      }

      for (int i = 0; i < this.children.length; i++) {
        children.add(this.children[i]);

        if (this.children.length - i != 1) {
          children.add(separatorBuilder(context, i + index));
        }
      }

      if (showOuterSeparators) {
        children.add(separatorBuilder(context, this.children.length));
      }
    }

    return Column(
      key: key,
      mainAxisSize: mainAxisSize,
      textBaseline: textBaseline,
      textDirection: textDirection,
      verticalDirection: verticalDirection,
      mainAxisAlignment: mainAxisAlignment,
      crossAxisAlignment: crossAxisAlignment,
      children: children,
    );
  }
}

class SeparatedRow extends StatelessWidget {
  final List<Widget> children;
  final TextBaseline? textBaseline;
  final bool includeOuterSeparators;
  final TextDirection? textDirection;
  final MainAxisSize mainAxisSize;
  final VerticalDirection verticalDirection;
  final MainAxisAlignment mainAxisAlignment;
  final CrossAxisAlignment crossAxisAlignment;
  final IndexedWidgetBuilder separatorBuilder;

  const SeparatedRow({
    Key? key,
    required this.separatorBuilder,
    required this.children,
    this.textBaseline,
    this.textDirection,
    this.includeOuterSeparators = false,
    this.mainAxisSize = MainAxisSize.max,
    this.verticalDirection = VerticalDirection.down,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.crossAxisAlignment = CrossAxisAlignment.center,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final children = <Widget>[];
    final index = includeOuterSeparators ? 1 : 0;

    if (this.children.isNotEmpty) {
      if (includeOuterSeparators) {
        children.add(separatorBuilder(context, 0));
      }

      for (int i = 0; i < this.children.length; i++) {
        children.add(this.children[i]);

        if (this.children.length - i != 1) {
          children.add(separatorBuilder(context, i + index));
        }
      }

      if (includeOuterSeparators) {
        children.add(separatorBuilder(context, this.children.length));
      }
    }

    return Row(
      key: key,
      mainAxisSize: mainAxisSize,
      textBaseline: textBaseline,
      textDirection: textDirection,
      verticalDirection: verticalDirection,
      mainAxisAlignment: mainAxisAlignment,
      crossAxisAlignment: crossAxisAlignment,
      children: children,
    );
  }
}
