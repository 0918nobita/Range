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

type Zero = { isZero: True, pred: Nat };
type Nat = Zero | { isZero: False, pred: Nat };
type Succ<N extends Nat> = { isZero: False, pred: N };

type Pred<N extends Succ<Nat>> = N['pred'];
type IsZero<N extends Nat> = N['isZero'];

type f = IsZero<Zero>;      // a: True
type g = IsZero<Succ<Zero>>; // b: False
type h = Pred<Succ<Succ<Zero>>>;  // c: { isZero: False, pred: Zero }

type _0 = Zero;
type _1 = Succ<_0>;
type _2 = Succ<_1>;
type _3 = Succ<_2>;
type _4 = Succ<_3>;
type _5 = Succ<_4>;

type Plus1<N extends Nat> = { isZero: False; pred: Succ<N>; };
type Plus2<N extends Nat> = { isZero: False; pred: Succ<Succ<N>>; };
type Plus3<N extends Nat> = { isZero: False; pred: Succ<Succ<Succ<N>>>; };
type Plus4<N extends Nat> = { isZero: False; pred: Succ<Succ<Succ<Succ<N>>>>; };

type _6 = Plus4<_2>;

// 未実装
type Add<L extends Nat, R extends Nat>
  = L extends Zero ? R : (R extends Zero ? L : { isZero: False, pred: R['pred'] });

type _7 = Add<_5, _2>; // 正しく動作していない
