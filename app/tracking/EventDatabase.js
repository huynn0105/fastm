import { TrackingStorage } from '../utils/AsyncStorageUtil';

class EventDatabase {
  static async readRecords() {
    return JSON.parse(TrackingStorage.readRecords());
  }

  static async addRecords(data) {
    return TrackingStorage.addRecords(JSON.stringify(data));
  }

  static async deleteRecords() {
    return TrackingStorage.removeItem();
  }
}

export default EventDatabase;
