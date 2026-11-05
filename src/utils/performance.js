/**
 * Performance & Optimization Helpers
 */

export const Performance = {
  getOptimalDPR() {
    return Math.min(window.devicePixelRatio || 1, 2);
  },

  isLowPowerDevice() {
    return (
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (window.innerWidth < 500)
    );
  },

  // Object pooling utility for particles
  createPool(factoryFn, initialSize = 50) {
    const pool = [];
    for (let i = 0; i < initialSize; i++) {
      pool.push(factoryFn());
    }
    return {
      get() {
        return pool.length > 0 ? pool.pop() : factoryFn();
      },
      release(item) {
        pool.push(item);
      }
    };
  }
};
