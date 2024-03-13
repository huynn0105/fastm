extension ExMapNonNull<K, V> on Map<K, V> {
  Map<V, K> inverse() {
    return map((k, v) => MapEntry(v, k));
  }

  Map<K, V> removeFalsyValue() {
    return this..removeWhere((k, v) => v == null || v == [] || v == '');
  }
}
