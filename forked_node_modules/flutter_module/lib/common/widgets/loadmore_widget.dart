import 'package:flutter/material.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';

import '../colors.dart';

class LoadMoreWidget extends StatefulWidget {
  const LoadMoreWidget({
    Key? key,
    required this.child,
    this.onRefresh,
    this.onLoadMore,
    this.refreshController,
    this.reverse = false,
  }) : super(key: key);

  final Widget child;
  final Future Function()? onRefresh;
  final Future Function()? onLoadMore;
  final RefreshController? refreshController;
  final bool reverse;

  @override
  State<LoadMoreWidget> createState() => _LoadMoreWidgetState();
}

class _LoadMoreWidgetState extends State<LoadMoreWidget> {
  late final RefreshController refreshController;

  @override
  void initState() {
    super.initState();
    refreshController = widget.refreshController ?? RefreshController();
  }

  @override
  void dispose() {
    if (widget.refreshController == null) {
      refreshController.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SmartRefresher(
      controller: refreshController,
      reverse: widget.reverse,
      enablePullDown: widget.onRefresh != null,
      enablePullUp: widget.onLoadMore != null,
      onRefresh: () async {
        if (widget.onRefresh != null) {
          await widget.onRefresh!.call();
          refreshController.refreshCompleted(resetFooterState: true);
        }
      },
      onLoading: () async {
        if (widget.onLoadMore != null) {
          /// [true]: changed data
          /// [false]: not changed data
          final enabledLoadmore = await widget.onLoadMore!.call();
          if (enabledLoadmore is bool && enabledLoadmore) {
            refreshController.loadComplete();
          } else {
            refreshController.loadNoData();
          }
        }
      },
      header: const MaterialClassicHeader(
        color: UIColors.primaryColor,
      ),
      footer: CustomFooter(
        builder: (BuildContext context, LoadStatus? mode) {
          if (mode == LoadStatus.loading) {
            Widget body = const SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(UIColors.primaryColor),
              ),
            );
            return SizedBox(
              height: 32,
              child: Center(
                child: body,
              ),
            );
          }
          return const SizedBox();
        },
      ),
      child: widget.child,
    );
  }
}
