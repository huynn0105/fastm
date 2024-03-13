
import 'donut_chart_data.dart';

/// Lerps [DonutChartSectionData] list based on [t] value, check [Tween.lerp].
List<DonutChartSectionData>? lerpDonutSectionDataList(
  List<DonutChartSectionData>? a,
  List<DonutChartSectionData>? b,
  double t,
) {
  return lerpList(a, b, t, lerp: DonutChartSectionData.lerp);
}

List<T>? lerpList<T>(
  List<T>? a,
  List<T>? b,
  double t, {
  required T Function(T, T, double) lerp,
}) {
  if (a != null && b != null && a.length == b.length) {
    return List.generate(a.length, (i) {
      return lerp(a[i], b[i], t);
    });
  } else if (a != null && b != null) {
    return List.generate(b.length, (i) {
      return lerp(i >= a.length ? b[i] : a[i], b[i], t);
    });
  } else {
    return b;
  }
}
