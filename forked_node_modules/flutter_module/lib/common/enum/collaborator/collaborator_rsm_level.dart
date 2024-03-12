enum CollaboratorRSMLevel {
  level1(1, "CTV Cấp 1", "Cấp 1"),
  level2(2, "CTV Cấp 2", "Cấp 2"),
  level3(3, "CTV Cấp 3", "Cấp 3"),
  level4(4, "CTV Cấp 4", "Cấp 4"),
  level5(5, "CTV Cấp 5", "Cấp 5"),
  level6(6, "CTV Cấp 6", "Cấp 6"),
  level7(7, "CTV > Cấp 6", "> Cấp 6");

  final int value;
  final String focusTitle;
  final String unFocusTitle;

  const CollaboratorRSMLevel(this.value, this.focusTitle, this.unFocusTitle);
}

