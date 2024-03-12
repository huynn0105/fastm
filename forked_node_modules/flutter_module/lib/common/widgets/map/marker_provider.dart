import 'package:google_maps_flutter/google_maps_flutter.dart';

import 'map_helper/image_helper.dart';

class MarkerProvider {
  MarkerProvider._();

  static final MarkerProvider shared = MarkerProvider._();

  Future<Marker?> createDotMarker({id, double? lat, double? lng}) async {
    if (lat == null || lng == null) return null;
    final markerIcon = await ImageHelper.shared
        .getBytesFromAsset('assets/images/dot_marker.png', 52);
    return Marker(
      markerId: MarkerId('$id'),
      position: LatLng(lat, lng),
      icon: BitmapDescriptor.fromBytes(markerIcon),
    );
  }
}
