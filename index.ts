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
type NonZero = { isZero: False, pred: Nat };
type Nat = Zero | NonZero;
type Succ<N extends Nat> = { isZero: False, pred: N };

type Sum<L extends Nat, R extends Nat>
  = L extends Succ<infer T>
    ? { isZero: False, pred: Sum<T, Succ<R>>['pred'] }
    : R;

type NonZeroProduct<L extends NonZero, R extends NonZero>
  = L extends Succ<Succ<infer T>>
      ? { isZero: False, pred: Sum<R, NonZeroProduct<Succ<T>, R>>['pred'] }
      : R;

type Product<L extends Nat, R extends Nat>
  = L extends NonZero ? (R extends NonZero ? NonZeroProduct<L, R> : Zero) : Zero;

type _1 = Succ<Zero>;  // { isZero: False, pred: Zero }
type _2 = Succ<_1>;    // { isZero: False, pred: Succ<Zero> }
type _3 = Succ<_2>;    // { isZero: False, pred: Succ<Succ<Zero>> }

type _4 = Sum<_3, _1>; // { isZero: False, pred: Succ<Succ<Succ<Zero>>> }

type _0 = Product<_2, Zero>;
type _6 = Product<_2, _3>;

type IZero = Zero & { isNegative: False };
type IPositive = NonZero & { isNegative: False };
type INegative = NonZero & { isNegative: True };
type Integer = INegative | IZero | IPositive;

type IMinus<I extends Integer>
  = I extends INegative | IPositive
    ? { isZero: I['isZero'], isNegative: Not<I['isNegative']>, pred: I['pred'] }
    : IZero;

type ISucc<I extends Integer>
  = I extends { isZero: Bool, isNegative: False }
    ? { isZero: False, isNegative: False, pred: Succ<I>['pred'] }
    : I extends { isZero: False, isNegative: True, pred: Succ<infer T> }
      ? { isZero: False, isNegative: True, pred: T }
      : IZero;

type IPred<I>
  = I extends { isZero: False, isNegative: False, pred: Succ<infer T> }
    ? { isZero: (T extends Zero ? True : False), isNegative: False, pred: T }
    : I extends { isZero: False, isNegative: True, pred: Succ<infer T> }
      ? { isZero: False, isNegative: True, pred: Succ<Succ<T>> }
      : IMinus<ISucc<IZero>>;

/*
type IPred<I>
  = I extends IZero
    ? IMinus<ISucc<IZero>>
    : I extends { isZero: False, isNegative: False, pred: Succ<infer T> }
      ? (T extends Zero
        ? IZero
        : { isZero: False, isNegative: False, pred: T })
      : I extends { isZero: False, isNegative: True, pred: Succ<infer T> }
        ? { isZero: False, isNegative: True, pred: Succ<Succ<T>> }
        : 'うんち';
*/

type IPPSum<L extends IPositive | IZero, R extends IPositive | IZero>
  = L extends Succ<infer T>
    ? { isZero: And<L['isZero'], R['isZero']>, isNegative: False, pred: Sum<T, Succ<R>>['pred'] }
    : R;

type INNSum<L extends INegative, R extends INegative>
  = IMinus<
      IPPSum<
        { isZero: False, isNegative: False, pred: L['pred'] },
        { isZero: False, isNegative: False, pred: R['pred'] }>>;

type IPNSum<L extends IPositive | IZero, R extends Integer>
  = R extends { isZero: True, isNegative: False }
    ? L // when R == IZero
    : {
      isZero: IPred<IPNSum<L, ISucc<R>>>['isZero'],
      isNegative: IPred<IPNSum<L, ISucc<R>>>['isNegative'],
      pred: IPred<IPNSum<L, ISucc<R>>>['pred']
    };

type INPSum<L extends INegative, R extends IPositive | IZero> = IPNSum<R, L>;

type ISum<L extends Integer, R extends Integer>
  = L extends IZero
    ? R
    : (R extends IZero
      ? L
      : (L extends IPositive
        ? (R extends IPositive
          ? IPPSum<L, R>
          : IPNSum<L, R>)
        : (L extends INegative
          ? (R extends IPositive
            ? INPSum<L, R>
            : (R extends INegative
              ? INNSum<L, R>
              : 'うんち'))
          : 'うんち')));

type i0 = IZero;
type i2 = ISucc<ISucc<i0>>;
type i3 = ISucc<i2>;
type i5 = ISum<i2, i3>; // 2 + 3 = 5
type im3 = IMinus<i3>; // -3
type im2 = ISum<i5, im3>; // 5 + (-3) = 2

type Pred<N extends Succ<Nat>> = N['pred'];
type IsZero<N extends Nat> = N['isZero'];

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

type S = Atom | { car: S, cdr: S };
type Atom = T | Nil;
type T = True | Number;
type Nil = False;
type Number = Integer;
type Cons<Car extends S, Cdr extends S> = { car: Car, cdr: Cdr };
type List<Tuple extends {}> = Tuple;

type L1 = List<[T]>;         // = { car: T, cdr: Nil }
type L2 = List<[T, T]>;      // = { car: T, cdr: { car: T, cdr: Nil } }
type L3 = List<[T, Nil, T]>; // = { car: T, cdr: { car: T, cdr: { car: T, cdr: Nil } } }

// type S1 = Cons<ISucc<IZero>, Cons<IZero, Nil>>;
