enum CollaboratorRSMStatus {
  online("Đang hoạt động", "ONLINE"),
  gvmExist("Có phát sinh doanh số", "GVM_EXIST"),
  plGvmExist("Có doanh số Tài chính", "PL_GVM_EXIST"),
  insGvmExist("Có doanh số Bảo hiểm", "INS_GVM_EXIST"),
  daaGvmExist("Có doanh số Mở tài khoản", "DAA_GVM_EXIST");

  final String label;
  final String value;

  const CollaboratorRSMStatus(this.label, this.value);
}
