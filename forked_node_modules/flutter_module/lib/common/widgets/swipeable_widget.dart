import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

/// Signature used by [swipeable] to indicate that it has been swiped in
/// the given `direction`.
///
/// Used by [Swipeable.onSwiped].
typedef SwipeDirectionCallback = void Function(SwipeDirection direction);

/// Signature for a function that builds a widget given the progress of the
/// dismissing action.
///
/// Used by [Swipeable.backgroundBuilder].
typedef BackgroundWidgetBuilder = Widget Function(
  BuildContext context,
  SwipeUpdateDetails details,
);

/// The direction in which a [Swipeable] can be swiped.
enum SwipeDirection {
  /// The [Swipeable] can be swiped by dragging either left or right.
  horizontal,

  /// The [Swipeable] can be swiped by dragging in the reverse of the
  /// reading direction (e.g., from right to left in left-to-right languages).
  endToStart,

  /// The [Swipeable] can be swiped by dragging in the reading direction
  /// (e.g., from left to right in left-to-right languages).
  startToEnd,

  /// The [Swipeable] cannot be swiped by dragging.
  none
}

/// A widget that can be swiped in a specified direction.
///
/// The `Swipeable` widget allows its child to be swiped by the user in a
/// specified direction.
///
/// It provides options for customizing the swipe behavior, including the
/// ability to specify a background widget that appears during the swipe,
/// callbacks for handling swipe completion, and more.
///
/// Example usage:
/// ```dart
/// Swipeable(
///   child: Container(
///     height: 100,
///     width: 200,
///     color: Colors.blue,
///     child: Center(
///       child: Text('Swipe me'),
///     ),
///   ),
///   backgroundBuilder: (context, details) {
///     final direction = details.direction;
///     return Container(
///       color: Colors.red,
///       child: Center(
///         child: Text(
///           direction == SwipeDirection.left ? 'Swipe left' : 'Swipe right',
///           style: TextStyle(
///             color: Colors.white,
///             fontWeight: FontWeight.bold,
///           ),
///         ),
///       ),
///     );
///   },
///   onSwiped: (direction) {
///     if (direction == SwipeDirection.left) {
///       // Handle left swipe
///     } else if (direction == SwipeDirection.right) {
///       // Handle right swipe
///     }
///   },
///   direction: SwipeDirection.horizontal,
///   swipeThreshold: 0.4,
///   movementDuration: Duration(milliseconds: 200),
/// )
/// ```


/// WIDGET 1
class Swipeable extends StatefulWidget {
  /// Creates a widget that can be swiped .
  const Swipeable({
    required super.key,
    required this.child,
    this.backgroundBuilder,
    this.onSwiped,
    this.direction = SwipeDirection.horizontal,
    this.swipeThreshold = 0.4,
    this.movementDuration = const Duration(milliseconds: 200),
    this.dragStartBehavior = DragStartBehavior.start,
    this.behavior = HitTestBehavior.opaque,
    this.clipBehavior = Clip.hardEdge,
  }) : assert(
          swipeThreshold >= 0.0 && swipeThreshold <= 1.0,
          'swipeThreshold must be between 0.0 and 1.0',
        );

  /// The widget below this widget in the tree.
  ///
  /// {@macro flutter.widgets.ProxyWidget.child}
  final Widget child;

  /// A widget that is stacked behind the child. If secondaryBackground is also
  /// specified then this widget only appears when the child has been dragged
  /// down or to the right.
  final BackgroundWidgetBuilder? backgroundBuilder;

  /// Called when the widget has been successfully swiped based on the
  /// [direction] and [swipeThreshold].
  final SwipeDirectionCallback? onSwiped;

  /// The direction in which the widget can be swiped.
  final SwipeDirection direction;

  /// The offset threshold the item has to be dragged in order to be considered
  /// swiped.
  ///
  /// Represented as a fraction, e.g. if it is 0.4 (the default), then the item
  /// has to be dragged at least 40% towards one direction to be considered
  /// swiped.
  ///
  /// See also:
  ///
  ///  * [direction], which controls the directions in which the items can
  ///    be swiped.
  final double swipeThreshold;

  /// Defines the duration for card to come back to original position.
  final Duration movementDuration;

  /// Determines the way that drag start behavior is handled.
  ///
  /// If set to [DragStartBehavior.start], the drag gesture used to dismiss a
  /// swipeable will begin at the position where the drag gesture won the
  /// arena.
  ///
  /// If set to [DragStartBehavior.down] it will begin at the position where
  /// a down event is first detected.
  ///
  /// In general, setting this to [DragStartBehavior.start] will make drag
  /// animation smoother and setting it to [DragStartBehavior.down] will make
  /// drag behavior feel slightly more reactive.
  ///
  /// By default, the drag start behavior is [DragStartBehavior.start].
  ///
  /// See also:
  ///
  ///  * [DragGestureRecognizer.dragStartBehavior], which gives an example for
  ///  the different behaviors.
  final DragStartBehavior dragStartBehavior;

  /// How to behave during hit tests.
  ///
  /// This defaults to [HitTestBehavior.opaque].
  final HitTestBehavior behavior;

  ///
  final Clip clipBehavior;

  @override
  State<Swipeable> createState() => _SwipeableState();
}

/// Details for [DismissUpdateCallback].
///
/// See also:
///
///   * [swipeable.onUpdate], which receives this information.
class SwipeUpdateDetails {
  /// Create a new instance of [SwipeUpdateDetails].
  SwipeUpdateDetails({
    this.direction = SwipeDirection.horizontal,
    this.reached = false,
    this.previousReached = false,
    this.progress = 0.0,
  });

  /// The direction that the swipeable is being dragged.
  final SwipeDirection direction;

  /// Whether the swipe threshold is currently reached.
  final bool reached;

  /// Whether the swipe threshold was reached the last time this callback was
  /// invoked.
  ///
  /// This can be used in conjunction with [SwipeUpdateDetails.reached] to catch
  /// the moment that the [Swipeable] is dragged across the threshold.
  final bool previousReached;

  /// The offset ratio of the swipeable in its parent container.
  ///
  /// A value of 0.0 represents the normal position and 1.0 means the child is
  /// completely outside its parent.
  ///
  /// This can be used to synchronize other elements to what the swipeable is
  /// doing on screen, e.g. using this value to set the opacity thereby fading
  /// swipeable as it's dragged offscreen.
  final double progress;
}

class _SwipeableClipper extends CustomClipper<Rect> {
  _SwipeableClipper({
    required this.moveAnimation,
  }) : super(reclip: moveAnimation);

  final Animation<Offset> moveAnimation;

  @override
  Rect getClip(Size size) {
    final offset = moveAnimation.value.dx * size.width;
    if (offset < 0) {
      return Rect.fromLTRB(size.width + offset, 0, size.width, size.height);
    }
    return Rect.fromLTRB(0, 0, offset, size.height);
  }

  @override
  Rect getApproximateClipRect(Size size) => getClip(size);

  @override
  bool shouldReclip(_SwipeableClipper oldClipper) {
    return oldClipper.moveAnimation.value != moveAnimation.value;
  }
}

class _SwipeableState extends State<Swipeable> with SingleTickerProviderStateMixin, AutomaticKeepAliveClientMixin {
  @override
  void initState() {
    super.initState();
    _moveController = AnimationController(
      duration: widget.movementDuration,
      vsync: this,
    )..addStatusListener((_) => updateKeepAlive());
    _updateMoveAnimation();
  }

  AnimationController? _moveController;
  late Animation<Offset> _moveAnimation;

  double _dragExtent = 0;
  bool _dragUnderway = false;
  bool _swipeThresholdReached = false;

  final GlobalKey _contentKey = GlobalKey();

  @override
  bool get wantKeepAlive => _moveController?.isAnimating ?? false;

  @override
  void dispose() {
    _moveController?.dispose();
    super.dispose();
  }

  SwipeDirection _extentToDirection(double extent) {
    if (extent == 0.0) {
      return SwipeDirection.none;
    }
    switch (Directionality.of(context)) {
      case TextDirection.rtl:
        return extent < 0 ? SwipeDirection.startToEnd : SwipeDirection.endToStart;
      case TextDirection.ltr:
        return extent > 0 ? SwipeDirection.startToEnd : SwipeDirection.endToStart;
    }
  }

  SwipeDirection get _swipeDirection => _extentToDirection(_dragExtent);

  bool get _isActive => _dragUnderway || _moveController!.isAnimating;

  double get _overallDragAxisExtent => context.size!.width;

  void _handleDragStart(DragStartDetails details) {
    _dragUnderway = true;
    if (_moveController!.isAnimating) {
      _dragExtent = _moveController!.value * _overallDragAxisExtent * _dragExtent.sign;
      _moveController!.stop();
    } else {
      _dragExtent = 0.0;
      _moveController!.value = 0.0;
    }
    setState(_updateMoveAnimation);
  }

  void _handleDragUpdate(DragUpdateDetails details) {
    if (!_isActive || _moveController!.isAnimating) {
      return;
    }

    final delta = details.primaryDelta!;
    final oldDragExtent = _dragExtent;
    switch (widget.direction) {
      case SwipeDirection.horizontal:
        _dragExtent += delta;
        break;
      case SwipeDirection.endToStart:
        switch (Directionality.of(context)) {
          case TextDirection.rtl:
            if (_dragExtent + delta > 0) {
              _dragExtent += delta;
            }
            break;
          case TextDirection.ltr:
            if (_dragExtent + delta < 0) {
              _dragExtent += delta;
            }
            break;
        }
        break;
      case SwipeDirection.startToEnd:
        switch (Directionality.of(context)) {
          case TextDirection.rtl:
            if (_dragExtent + delta < 0) {
              _dragExtent += delta;
            }
            break;
          case TextDirection.ltr:
            if (_dragExtent + delta > 0) {
              _dragExtent += delta;
            }
            break;
        }
        break;
      case SwipeDirection.none:
        _dragExtent = 0;
        break;
    }

    if (oldDragExtent.sign != _dragExtent.sign) {
      setState(_updateMoveAnimation);
    }

    if (!_moveController!.isAnimating) {
      final currentDragExtent = _dragExtent.abs();
      final overallDragExtent = _overallDragAxisExtent;
      final movePastThresholdExtent = widget.swipeThreshold * overallDragExtent;

      final double newPos;
      if (currentDragExtent > movePastThresholdExtent) {
        // How many "thresholds" past the threshold we are.
        final n = currentDragExtent / movePastThresholdExtent;

        // Take the number of thresholds past the threshold, and reduce it by
        // the threshold amount, then normalize it to the drag extents.
        final reducedThreshold = math.pow(n, 0.3);
        final adjustedDragExtent = movePastThresholdExtent * reducedThreshold;

        newPos = adjustedDragExtent / overallDragExtent;
      } else {
        newPos = currentDragExtent / overallDragExtent;
      }

      _moveController!.value = newPos;
    }
  }

  SwipeUpdateDetails _currentSwipeUpdateDetails() {
    final oldSwipeThresholdReached = _swipeThresholdReached;
    _swipeThresholdReached = _moveController!.value > widget.swipeThreshold;

    return SwipeUpdateDetails(
      direction: _swipeDirection,
      reached: _swipeThresholdReached,
      previousReached: oldSwipeThresholdReached,
      progress: _moveController!.value,
    );
  }

  void _updateMoveAnimation() {
    final end = _dragExtent.sign;
    _moveAnimation = _moveController!.drive(
      Tween<Offset>(
        begin: Offset.zero,
        end: Offset(end, 0),
      ),
    );
  }

  void _handleDragEnd(DragEndDetails details) {
    if (!_isActive || _moveController!.isAnimating) return;
    _dragUnderway = false;

    // Once dragging ends, animate back to the initial offset.
    _moveController!.reverse();

    // If the threshold was reached, report it.
    if (_moveController!.value > widget.swipeThreshold) {
      if (widget.onSwiped != null) {
        final direction = _swipeDirection;
        widget.onSwiped!(direction);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    super.build(context); // See AutomaticKeepAliveClientMixin.

    assert(
      debugCheckHasDirectionality(context),
      'Swipeable must be inside of a Directionality widget.',
    );

    Widget? background;
    final backgroundBuilder = widget.backgroundBuilder;
    if (backgroundBuilder != null) {
      background = AnimatedBuilder(
        animation: _moveAnimation,
        builder: (context, _) {
          final updateDetails = _currentSwipeUpdateDetails();
          return backgroundBuilder.call(context, updateDetails);
        },
      );
    }

    Widget content = SlideTransition(
      position: _moveAnimation,
      child: KeyedSubtree(key: _contentKey, child: widget.child),
    );

    if (background != null) {
      content = Stack(
        clipBehavior: widget.clipBehavior,
        fit: StackFit.passthrough,
        alignment: Alignment.center,
        children: <Widget>[
          if (!_moveAnimation.isDismissed)
            Positioned.fill(
              child: ClipRect(
                clipper: _SwipeableClipper(
                  moveAnimation: _moveAnimation,
                ),
                child: background,
              ),
            ),
          content,
        ],
      );
    }

    // If the SwipeDirection is none, we do not add drag gestures because the
    // content cannot be dragged.
    if (widget.direction == SwipeDirection.none) {
      return content;
    }

    // We are not resizing but we may be being dragging in widget.direction.
    return GestureDetector(
      onHorizontalDragStart: _handleDragStart,
      onHorizontalDragUpdate: _handleDragUpdate,
      onHorizontalDragEnd: _handleDragEnd,
      behavior: widget.behavior,
      dragStartBehavior: widget.dragStartBehavior,
      child: content,
    );
  }
}

/// A custom painter that animates a circle border or fills it based on a
/// progress value.
///
/// This painter draws a circle with a border that can be animated to fill the
/// circle or stroke its outline based on a given progress value. The progress
/// value is a double between 0.0 and 1.0, representing the completion of the
/// animation.
///
/// When the progress is 0.0, the circle is completely empty, and when the
/// progress is 1.0, the circle is fully filled or stroked.
///
/// The color of the arc/circle can be customized by providing a [color].
///
/// Example usage:
/// ```dart
/// AnimatedCircleBorderPainter painter = AnimatedCircleBorderPainter(
///   progress: 0.5,
///   color: Colors.blue,
/// );
///
/// CustomPaint(
///   painter: painter,
///   size: Size(200, 200),
///   // ... other properties
/// )
/// ```
class AnimatedCircleBorderPainter extends CustomPainter {
  /// Creates an [AnimatedCircleBorderPainter] with the specified [progress]
  /// and [color].
  const AnimatedCircleBorderPainter({
    required this.progress,
    required this.color,
  });

  /// The progress of the animation, as a value between 0.0 and 1.0.
  final double progress;

  /// The color of the arc/circle.
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    const style = PaintingStyle.stroke;

    final arcPaint = Paint()
      ..style = style
      ..color = color
      ..strokeWidth = 1.5
      ..strokeCap = StrokeCap.round;

    final radius = size.width / 2;
    final center = Offset(size.width / 2, size.height / 2);
    final sweepAngle = math.pi * 2 * progress;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2,
      sweepAngle,
      false,
      arcPaint,
    );
  }

  @override
  bool shouldRepaint(AnimatedCircleBorderPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.color != color;
  }
}


/// WIDGET 2
class SwipeDetectorWidget extends StatefulWidget {
  const SwipeDetectorWidget({
    super.key,
    required this.child,
    this.onLTRSwiped,
    this.onRTLSwiped,
    this.actionThreshold = 0.1,
  })  : assert(!(onLTRSwiped == null && onRTLSwiped == null)),
        assert(!(onLTRSwiped != null && onRTLSwiped != null));

  final Widget child;
  final double actionThreshold;
  final Function()? onLTRSwiped;
  final Function()? onRTLSwiped;

  @override
  State<SwipeDetectorWidget> createState() => _SwipeDetectorWidgetState();
}

class _SwipeDetectorWidgetState extends State<SwipeDetectorWidget> with TickerProviderStateMixin {
  late final AnimationController swipeLTRController;
  late final AnimationController swipeRTLController;
  late final AnimationController scaleController;

  Size size = Size.zero;
  double distance = 0;

  @override
  void initState() {
    super.initState();
    swipeLTRController = AnimationController(vsync: this);
    swipeRTLController = AnimationController(vsync: this);
    scaleController = AnimationController(vsync: this);
  }

  @override
  void dispose() {
    swipeLTRController.dispose();
    swipeRTLController.dispose();
    scaleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onHorizontalDragStart: (details) => onHorizontalDragStart(context, details),
      onHorizontalDragUpdate: (details) => onHorizontalDragUpdate(context, details),
      onHorizontalDragEnd: (details) => onHorizontalDragEnd(context, details),
      child: Stack(
        fit: StackFit.passthrough,
        children: [
          SizedBox(
            width: size.width,
            height: size.height,
            child: Stack(
              fit: StackFit.passthrough,
              children: [
                Visibility(
                  visible: widget.onLTRSwiped != null,
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: AnimatedBuilder(
                      animation: scaleController,
                      builder: (context, child) {
                        return ReplyIcon(
                          scaleAnimation: AlwaysStoppedAnimation(scaleController.value),
                        );
                      },
                    ),
                  ),
                ),
                Visibility(
                  visible: widget.onRTLSwiped != null,
                  child: Align(
                    alignment: Alignment.centerRight,
                    child: AnimatedBuilder(
                      animation: scaleController,
                      builder: (context, child) {
                        return ReplyIcon(
                          scaleAnimation: AlwaysStoppedAnimation(scaleController.value),
                        );
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),
          Visibility(
            visible: widget.onLTRSwiped != null,
            child: AnimatedBuilder(
              animation: swipeLTRController,
              builder: (context, child) {
                return SlideTransition(
                  position: AlwaysStoppedAnimation(Offset(swipeLTRController.value, 0)),
                  child: widget.child,
                );
              },
            ),
          ),
          Visibility(
            visible: widget.onRTLSwiped != null,
            child: AnimatedBuilder(
              animation: swipeRTLController,
              builder: (context, child) {
                return SlideTransition(
                  position: AlwaysStoppedAnimation(Offset(-swipeRTLController.value, 0)),
                  child: widget.child,
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  onHorizontalDragStart(BuildContext context, DragStartDetails details) {
    setState(() {
      swipeLTRController.reset();
      swipeRTLController.reset();
      scaleController.reset();
      size = context.size ?? Size.zero;
      distance = 0;
    });
  }

  onHorizontalDragUpdate(BuildContext context, DragUpdateDetails details) {
    runAnimation(
      context: context,
      details: details,
      isRTLSwiped: widget.onRTLSwiped != null,
      isLTRSwiped: widget.onLTRSwiped != null,
    );
  }

  onHorizontalDragEnd(BuildContext context, DragEndDetails details) {
    if (widget.onLTRSwiped != null && swipeLTRController.value > widget.actionThreshold) {
      widget.onLTRSwiped!();
    }
    if (widget.onRTLSwiped != null && swipeRTLController.value > widget.actionThreshold) {
      widget.onRTLSwiped!();
    }
    swipeLTRController.fling(velocity: -1);
    swipeRTLController.fling(velocity: -1);
    scaleController.reset();
  }

  runAnimation({
    required BuildContext context,
    required DragUpdateDetails details,
    required bool isRTLSwiped,
    required bool isLTRSwiped,
  }) {
    double width = context.size?.width ?? 1;
    double offset = details.delta.dx;

    if (isRTLSwiped) {
      distance -= offset;
    } else if (isLTRSwiped) {
      distance += offset;
    }

    double ratio = (distance / width);

    // if (ratio.abs() > widget.actionThreshold * 1.5) {
    //   return;
    // }

    if (isRTLSwiped) {
      swipeRTLController.value = ratio;
    } else if (isLTRSwiped) {
      swipeLTRController.value = ratio;
    }

    scaleController.value = ratio / widget.actionThreshold;
  }
}

class ReplyIcon extends StatelessWidget {
  const ReplyIcon({
    Key? key,
    required this.scaleAnimation,
  }) : super(key: key);

  final Animation<double> scaleAnimation;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 28,
      height: 28,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Transform.scale(
            scale: scaleAnimation.value,
            child: Container(
              width: 28,
              height: 28,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: scaleAnimation.value == 1.0 ? Colors.white : Colors.transparent,
              ),
              child: Icon(
                Icons.reply_rounded,
                size: 18 * scaleAnimation.value,
                color: Colors.black,
              ),
            ),
          ),
          SizedBox(
            width: 25,
            height: 25,
            child: CircularProgressIndicator(
              value: scaleAnimation.value,
              backgroundColor: Colors.transparent,
              strokeWidth: 1.25,
              color: Colors.black,
            ),
          ),
        ],
      ),
    );
  }
}
