/**
 * CUSTOM EVENT MANAGER
 */
export default class EventEmitter {
  constructor() {
    this.events = {};
  }
  /**
   *
   * @param {string} eventName event's name
   * @param {function} callback function to be called when event is trigged
   */
  addEventListener(eventName, callback) {
    const events = this.events;
    const callbacks = (events[eventName] = events[eventName] || []);
    callbacks.push(callback);
  }
  /**
   *
   * @param {string} eventName event's name to be sent
   * @param {array} args parameters to be be sent
   */
  raiseEvent(eventName, args) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i].apply(null, args);
      }
    }
  }
  /**
   *
   * @param {string} eventName event to be deleted
   */
  removeEventListener(eventName) {
    const events = this.events;
    delete events[eventName];
  }
}
