import 'dart:async';

import 'package:extended_nested_scroll_view/extended_nested_scroll_view.dart';
import 'package:flutter/material.dart';
import 'package:liquid_pull_to_refresh/liquid_pull_to_refresh.dart';
import 'package:loading_more_list/loading_more_list.dart';

import '../colors.dart';

class AppNestedScrollView<T> extends StatefulWidget {
  const AppNestedScrollView({
    super.key,
    this.slivers = const [],
    required this.source,
    required this.itemBuilder,
    this.controller,
    this.gridDelegate,
    this.padding,
    this.onRefresh,
    this.body,
  });

  final List<Widget> slivers;
  final LoadingMoreBase<T> source;
  final LoadingMoreItemBuilder? itemBuilder;
  final ScrollController? controller;
  final SliverGridDelegateWithFixedCrossAxisCount? gridDelegate;
  final EdgeInsets? padding;
  final Future<void> Function()? onRefresh;
  final Widget? body;

  @override
  State<StatefulWidget> createState() => _NestedScrollViewState<T>();
}

class _NestedScrollViewState<T> extends State<AppNestedScrollView> with TickerProviderStateMixin {
  final GlobalKey<ExtendedNestedScrollViewState> _key = GlobalKey<ExtendedNestedScrollViewState>();

  @override
  Widget build(BuildContext context) {
    Widget body = widget.body ??
        LoadingMoreList<T>(
          ListConfig<T>(
            sourceList: widget.source as LoadingMoreBase<T>,
            itemBuilder: widget.itemBuilder ??
                (BuildContext context, item, int index) {
                  return const SizedBox();
                },
            gridDelegate: widget.gridDelegate,
            padding: widget.padding ?? EdgeInsets.zero,
            indicatorBuilder: (BuildContext context, IndicatorStatus status) {
              Widget widget;
              switch (status) {
                case IndicatorStatus.none:
                  widget = const SizedBox();
                  break;
                case IndicatorStatus.loadingMoreBusying:
                  widget = Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        padding: const EdgeInsets.all(4),
                        child: const CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(UIColors.primaryColor),
                        ),
                      )
                    ],
                  );
                  break;
                case IndicatorStatus.fullScreenBusying:
                  widget = const SizedBox();
                  break;
                case IndicatorStatus.error:
                  widget = const SizedBox();
                  break;
                case IndicatorStatus.fullScreenError:
                  widget = const SizedBox();
                  break;
                case IndicatorStatus.noMoreLoad:
                  widget = const SizedBox();
                  break;
                case IndicatorStatus.empty:
                  widget = const SizedBox();
                  break;
              }
              return widget;
            },
          ),
        );
    Widget layout = ExtendedNestedScrollView(
      controller: widget.controller,
      key: _key,
      physics: const PositionRetainedScrollPhysics(),
      headerSliverBuilder: (BuildContext c, bool f) {
        return <Widget>[
          ...widget.slivers,
        ];
      },
      onlyOneScrollInBody: true,
      body: body,
    );
    if (widget.onRefresh != null) {
      return LiquidPullToRefresh(
        backgroundColor: UIColors.primaryColor,
        color: Colors.transparent,
        springAnimationDurationInMilliseconds: 300,
        showChildOpacityTransition: false,
        height: 80,
        onRefresh: () async {
          widget.onRefresh?.call();
        },
        child: layout,
      );
    }
    return layout;
  }
}

class LoadMoreListSource<T> extends LoadingMoreBase<T> {
  LoadMoreListSource({this.onLoadMore});

  final Future<bool> Function()? onLoadMore;
  bool _hasMore = true;

  void reset() {
    _hasMore = true;
  }

  @override
  bool get hasMore => _hasMore;

  @override
  Future<bool> loadData([bool isloadMoreAction = false]) async {
    _hasMore = await onLoadMore?.call() ?? false;
    return true;
  }
}

class PositionRetainedScrollPhysics extends ScrollPhysics {
  final bool shouldRetain;
  const PositionRetainedScrollPhysics({super.parent, this.shouldRetain = true});

  @override
  PositionRetainedScrollPhysics applyTo(ScrollPhysics? ancestor) {
    return PositionRetainedScrollPhysics(
      parent: buildParent(ancestor),
      shouldRetain: shouldRetain,
    );
  }

  @override
  double adjustPositionForNewDimensions({
    required ScrollMetrics oldPosition,
    required ScrollMetrics newPosition,
    required bool isScrolling,
    required double velocity,
  }) {
    final position = super.adjustPositionForNewDimensions(
      oldPosition: oldPosition,
      newPosition: newPosition,
      isScrolling: isScrolling,
      velocity: velocity,
    );

    final diff = newPosition.maxScrollExtent - oldPosition.maxScrollExtent;

    if (oldPosition.pixels > oldPosition.minScrollExtent &&
        diff > 0 &&
        shouldRetain) {
      return position + diff;
    } else {
      return position;
    }
  }
}
