import DigitelClient from '../network/DigitelClient';
import { EVENT, ACTION } from './EventData';

const MAX_EVENT = 20;
const TRIGGER_EVENT_IDS = [ACTION.GO_BACKGROUND];

class EventTracker {
  events = [];

  addEvent = (event) => {
    this._processEvent({
      ...event,
      [EVENT.USER_ID]: DigitelClient.userID,
    });
  }

  _processEvent = async (event) => {
    this.events.push(event);
    const processingEvents = this.events;
    try {
      if (EventTracker._needSendEvents(processingEvents)) {
        this.events = [];
        await EventTracker._sendEventBatch(processingEvents);
      }
    } catch (err) {
      this.events = processingEvents + this.events;
    }
  }

  static _sendEventBatch = (events) => {
    return DigitelClient.sendTrackingRecords(events);
  }

  static _needSendEvents = (events) => {
    return (events.length > 0 && TRIGGER_EVENT_IDS.includes(events[events.length - 1][EVENT.ACTION_ID]))
      || (events.length >= MAX_EVENT);
  }


}

const tracker = new EventTracker();
export default tracker;
