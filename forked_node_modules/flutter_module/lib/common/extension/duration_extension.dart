extension ExDuration on Duration? {
  String getMMss() {
    if (this == null) {
      return '00:00';
    }
    final minutes = this!.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = this!.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }
}
