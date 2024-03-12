import 'package:flutter/material.dart';

import 'donut_chart_data.dart';
import 'donut_chart_helper.dart';

class DonutChartController extends ChangeNotifier {
  DonutChartController({
    this.delayedDuration = const Duration(seconds: 1),
  });

  ///
  final Duration delayedDuration;
  bool _disposed = false;
  DonutChartData _data = const DonutChartData();

  ///
  DonutChartAction _action = DonutChartAction.init;

  DonutChartAction get action => _action;

  DonutChartData get data => _data;

  DonutChartData getData() => _action.isLoading ? DonutChartData.kLoading() : _data;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  @override
  void notifyListeners() {
    if (_disposed) {
      return;
    }
    super.notifyListeners();
  }

  void show({required DonutChartData data, bool forceDelay = false}) async {
    _action = DonutChartAction.show;
    _data = data;
    if (forceDelay) {
      await delay();
    }
    notifyListeners();
  }

  void empty({bool forceDelay = false}) async {
    _action = DonutChartAction.empty;
    _data = DonutChartData.kEmpty();
    if (forceDelay) {
      await delay();
    }
    notifyListeners();
  }

  void load() {
    _action = DonutChartAction.loading;
    notifyListeners();
  }

  void focus(int index) {
    _action = DonutChartAction.focus;
    final indexToFocus = (_data.indexToFocus == index) ? -1 : index;
    final tmp = List.generate(
      _data.sections.length,
      (i) {
        return _data.sections[i].copyWith(
          radius: (i == index && indexToFocus == index) ? 10 : 0,
        );
      },
    );
    _data = _data.copyWith(
      sections: tmp,
      indexToFocus: indexToFocus,
    );
    notifyListeners();
  }

  Future<void> delay() async {
    await Future.delayed(delayedDuration);
  }

// DonutChartData _getData() {
//   return const DonutChartData(
//     isLoading: false,
//     animatedAngle: 360,
//     sections: [
//       DonutChartSectionData(
//         value: 1500000,
//         label: "Tài chính",
//         color: Color(0xFFF2387C),
//       ),
//       DonutChartSectionData(
//         value: 6500000,
//         label: "Bảo hiểm",
//         color: Color(0xFF04D9C4),
//       ),
//       DonutChartSectionData(
//         value: 3000000,
//         label: "Mở ví ngân hàng",
//         color: Color(0xFF05C7F2),
//       ),
//       DonutChartSectionData(
//         value: 4300000,
//         label: "CTV phát sinh giao dịch ngoài hành chính",
//         color: Color(0xFFF2B705),
//       ),
//       DonutChartSectionData(
//         value: 1000000,
//         label: "CTV phát sinh bảo hiểm & tài chính doanh nghiệp",
//         color: Color(0xFFF26241),
//       ),
//     ],
//   );
// }
}
