enum CollaboratorRSMTop {
  top10("TOP 10", 10),
  top20("TOP 20", 20),
  top50("TOP 50", 50),
  top100("TOP 100", 100);

  final String title;
  final int value;

  const CollaboratorRSMTop(this.title, this.value);
}
