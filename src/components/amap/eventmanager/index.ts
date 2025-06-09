/* eslint-disable @typescript-eslint/ban-types */
class EventManager {
  private eventHandlers: { [eventName: string]: any[] };

  constructor() {
    this.eventHandlers = {};
  }

  /**
   * @description: 触发事件
   * @param {string} eventName
   * @param {...any} args
   * @return {*}
   */
  triggerEvent(eventName: string, ...args: any[]) {
    const handlers = this.eventHandlers[eventName];
    if (handlers && handlers.length > 0) {
      handlers.forEach((handler) => handler(...args));
    }
  }

  /**
   * @description: 注册事件处理函数
   * @param {string} eventName
   * @param {Function} handler
   * @return {*}
   */
  on(eventName: string, handler: Function) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(handler);
  }
  /**
   * @description: 解除事件绑定
   * @param {string} eventName
   * @param {Function} handler
   * @return {*}
   */
  off(eventName: string, handler: Function) {
    const handlers = this.eventHandlers[eventName];
    if (handlers && handlers.length > 0) {
      const index = handlers.findIndex((h) => h === handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
}

export default EventManager;
