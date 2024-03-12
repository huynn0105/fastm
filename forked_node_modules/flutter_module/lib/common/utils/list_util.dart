class ListUtil {
  ListUtil._();

  static List insertOrUpdateValue(List list, int index, dynamic value, {dynamic defaultValue}) {
    if (index >= 0) {
      if (index < list.length) {
        list[index] = value;
      } else if (index == list.length) {
        list.add(value);
      } else {
        for (int i = list.length; i < index; i++) {
          list.add(defaultValue);
        }
        list.add(value);
      }
    }
    return list;
  }

  static T? getValueByIndex<T>(List<T>? list, int index) {
    if (list != null) {
      if (list.isNotEmpty && index >= 0 && index < list.length) {
        return list[index];
      }
    }
    return null;
  }
}
