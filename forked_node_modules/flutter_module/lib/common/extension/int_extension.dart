extension ExInt on int {
  int roundToThousands() {
    return (this / 1000).ceil() * 1000;
  }
}

extension ExDouble on double {
  int roundToThousands() {
    return (this / 1000).ceil() * 1000;
  }
}