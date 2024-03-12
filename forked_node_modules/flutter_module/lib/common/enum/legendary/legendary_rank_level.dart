// ignore_for_file: constant_identifier_names

enum LegendaryRankLevel {
  EARNING_USER(code: 'earning_user'),
  VAR_RSA(code: 'VAR_RSA'),
  KPI_RSA(code: 'KPI_RSA'),
  FIX_RSA(code: 'FIX_RSA'),
  VAR_RSM(code: 'VAR_RSM'),
  KPI_RSM(code: 'KPI_RSM'),
  FIX_RSM(code: 'FIX_RSM'),
  HEAD(code: 'head');

  final String code;

  const LegendaryRankLevel({
    required this.code,
  });
}
