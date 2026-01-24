export const errorBus = {
  listeners: [],
  emit(event, data) {
    this.listeners.forEach(listener => listener(event, data));
  },
  on(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
};
