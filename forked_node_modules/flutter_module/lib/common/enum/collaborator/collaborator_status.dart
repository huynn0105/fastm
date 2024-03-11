enum CollaboratorStatus {
  working("working", "Có hoạt động"),
  follow("follow", "Cần theo dõi"),
  can_leave("can_leave", "Có thể rời đi"),
  departed("departed", "Vừa rời đi"),
  can_remove("can_remove", "Có thể xóa");

  final String name;
  final String title;

  const CollaboratorStatus(this.name, this.title);
}
