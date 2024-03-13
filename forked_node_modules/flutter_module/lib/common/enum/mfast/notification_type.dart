enum NotificationType {
  unknown("-999"),
  plainText("1"),
  webLink("2"),
  webStack("3"),
  plainTextWebLink("4"),
  openView("5"),
  confirmCtv("6"),
  newsDetails("10"),
  moneyHistory("11"),
  pointsHistory("12"),
  employeeCard("13"),
  feedback("14"),
  chatMessage("70"),
  chatThreadChange("71"),
  forceLogout("1000"),
  showLogoutPopup("9999"),
  changePass("2000");

  final String? name;
  const NotificationType(
    this.name,
  );
}

extension NotificationTypeExtension on NotificationType {}
