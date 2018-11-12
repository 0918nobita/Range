declare namespace RangeUtil {
  interface Interval {
    constructor: (first: number, last: number, step: number) => void;
  }

  interface Single {}
}
