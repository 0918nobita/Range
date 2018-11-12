export namespace RangeUtil {
  // 区間
  export class Interval {
    constructor(first: number, last: number, step = 1) {
      console.log(step);
    }
  }

  // 単一の値
  export class Single {
    constructor() {}
  }

  export function parse(): (Interval | Single)[] {
    return [new Single()];
  }
}

type False = 'f';
type True = 't';
type Bool = True | False;

type Zero = { isZero: True };
type Nat = Zero | { isZero: False, pred: Nat };
type Succ<N extends Nat> = { isZero: False, pred: N };

type Pred<N extends Succ<Nat>> = N['pred'];
type IsZero<N extends Nat> = N['isZero'];

type Sum<L extends Nat, R extends Nat>
  = L extends Succ<infer T> ? { isZero: False, pred: Sum<T, Succ<R>>['pred'] } : R;

type _0 = Zero;        // { isZero: True }
type _1 = Succ<_0>;    // { isZero: False, pred: Zero }
type _2 = Succ<_1>;    // { isZero: False, pred: Succ<Zero> }
type _3 = Succ<_2>;    // { isZero: False, pred: Succ<Succ<Zero>> }

type _4 = Sum<_3, _1>; // { isZero: False, pred: Succ<Succ<Succ<Zero>>> }
type _5 = Sum<_2, _3>; // { isZero: False, pred: Succ<Succ<Succ<Succ<Zero>>>> }

type f = IsZero<Zero>;      // a: True
type g = IsZero<Succ<Zero>>; // b: False
type h = Pred<Succ<Succ<Zero>>>;  // c: { isZero: False, pred: Zero }

type And<L extends Bool, R extends Bool>
  = L extends False ? False : (R extends False ? False : True);

type Or<L extends Bool, R extends Bool>
  = L extends True ? True : (R extends True ? True : False);

type Not<T extends Bool> = T extends True ? False : True;

type Xor<L extends Bool, R extends Bool> = Or<And<L, Not<R>>, And<Not<L>, R>>;

type a = [
  And<True, True>,
  And<True, False>,
  And<False, True>,
  And<False, False>
]; // a: [True, False, False, False]

type b = [
  Or<True, True>,
  Or<True, False>,
  Or<False, True>,
  Or<False, False>
]; // b: [True, True, True, False]

type c = [
  Xor<True, True>,
  Xor<True, False>,
  Xor<False, True>,
  Xor<False, False>
]; // c: [False, True, True, False]

type If<Cond extends Bool, Then, Else> = { 't': Then, 'f': Else }[Cond];

type d = If<True, 1, 2>;  // j: 1
type e = If<False, 3, 4>; // k: 4
