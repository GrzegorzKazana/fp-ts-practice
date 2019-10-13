import * as assert from "assert";

import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

// fold
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.fold(() => 0, x => x * 2)
  ),
  84
);

// tryCatch
assert.deepStrictEqual(
  O.tryCatch(() => JSON.parse("[1, 2, 3]")),
  O.some([1, 2, 3])
);
assert.deepStrictEqual(O.tryCatch(() => JSON.parse("<1, 2, 3]")), O.none);

// ap
assert.deepStrictEqual(
  pipe(
    O.some(x => x * 2),
    O.ap(O.some(42))
  ),
  O.some(84)
);
assert.deepStrictEqual(
  pipe(
    O.some(x => x * 2),
    O.ap(O.none)
  ),
  O.none
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.ap(O.some(42))
  ),
  O.none
);

// apFirst - if both are some picks first in pipe, else none (?)
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.apFirst(O.some("42"))
  ),
  O.some(42)
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.apFirst(O.some("42"))
  ),
  O.none
);
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.apFirst(O.none)
  ),
  O.none
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.apFirst(O.none)
  ),
  O.none
);

// apSecond - if both are some picks second in pipe, else none (?)
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.apSecond(O.some("42"))
  ),
  O.some("42")
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.apSecond(O.some("42"))
  ),
  O.none
);
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.apSecond(O.none)
  ),
  O.none
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.apSecond(O.none)
  ),
  O.none
);

// chain
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.chain(x => (x === 0 ? O.none : O.some(1 / x)))
  ),
  O.some(1 / 42)
);
assert.deepStrictEqual(
  pipe(
    O.some(0),
    O.chain(x => (x === 0 ? O.none : O.some(1 / x)))
  ),
  O.none
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.chain(x => (x === 0 ? O.none : O.some(1 / x)))
  ),
  O.none
);

// chainFirst - if inner f returns some, keeps the first arg (?)
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.chainFirst(x => (x === 0 ? O.none : O.some(1 / x)))
  ),
  O.some(42)
);
assert.deepStrictEqual(
  pipe(
    O.some(0),
    O.chainFirst(x => (x === 0 ? O.none : O.some(1 / x)))
  ),
  O.none
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.chainFirst(x => (x === 0 ? O.none : O.some(1 / x)))
  ),
  O.none
);

// compact
assert.deepStrictEqual(O.compact(O.some(O.some(42))), O.some(42));
assert.deepStrictEqual(O.compact(O.some(O.none)), O.none);
assert.deepStrictEqual(O.compact(O.none), O.none);

// duplicate
assert.deepStrictEqual(O.duplicate(O.some(42)), O.some(O.some(42)));
assert.deepStrictEqual(O.duplicate(O.none), O.none);

// extend
const f = (x: O.Option<number>) =>
  O.isSome(x) ? (x.value % 2 === 0 ? "even" : "odd") : "none";

assert.deepStrictEqual(O.extend(f)(O.some(42)), O.some("even"));
assert.deepStrictEqual(O.extend(f)(O.some(43)), O.some("odd"));
assert.deepStrictEqual(O.extend(f)(O.none), O.none);

// filter
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.filter(x => x % 2 === 0)
  ),
  O.some(42)
);
assert.deepStrictEqual(
  pipe(
    O.some(43),
    O.filter(x => x % 2 === 0)
  ),
  O.none
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.filter(x => x % 2 === 0)
  ),
  O.none
);

// filterMap - for Option filterMap === chain
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.filterMap(x => (x === 0 ? O.none : O.some(1 / x)))
  ),
  O.some(1 / 42)
);
assert.deepStrictEqual(
  pipe(
    O.some(0),
    O.filterMap(x => (x === 0 ? O.none : O.some(1 / x)))
  ),
  O.none
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.filterMap(x => (x === 0 ? O.none : O.some(1 / x)))
  ),
  O.none
);

// flatten - for Option flatten === compact
assert.deepStrictEqual(O.flatten(O.some(O.some(42))), O.some(42));
assert.deepStrictEqual(O.flatten(O.some(O.none)), O.none);
assert.deepStrictEqual(O.flatten(O.none), O.none);

// foldMap - if some unwraps and maps the value, else returns Monoid.empty
import { monoidProduct, monoidString } from "fp-ts/lib/Monoid";

assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.foldMap(monoidProduct)(x => x * 2)
  ),
  84
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.foldMap(monoidProduct)(x => x * 2)
  ),
  1
);
assert.deepStrictEqual(
  pipe(
    O.some("asd"),
    O.foldMap(monoidString)(x => x.toUpperCase())
  ),
  "ASD"
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.foldMap(monoidString)((x: string) => x.toUpperCase())
  ),
  ""
);

// partition - if some matches refinement its put in 'rigth' else in 'left'
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.partition(x => x % 2 === 0)
  ),
  { left: O.none, right: O.some(42) }
);
assert.deepStrictEqual(
  pipe(
    O.some(43),
    O.partition(x => x % 2 === 0)
  ),
  { left: O.some(43), right: O.none }
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.partition(x => x % 2 === 0)
  ),
  { left: O.none, right: O.none }
);

// partitionMap
import * as E from "fp-ts/lib/Either";

assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.partitionMap(x => (x === 0 ? E.left("div by 0") : E.right(1 / x)))
  ),
  { left: O.none, right: O.some(1 / 42) }
);
assert.deepStrictEqual(
  pipe(
    O.some(0),
    O.partitionMap(x => (x === 0 ? E.left("div by 0") : E.right(1 / x)))
  ),
  { left: O.some("div by 0"), right: O.none }
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.partitionMap(x => (x === 0 ? E.left("div by 0") : E.right(1 / x)))
  ),
  { left: O.none, right: O.none }
);

// reduce - similar in results to fold, however onNone is not lazy
assert.deepStrictEqual(
  pipe(
    O.some(42),
    O.reduce(1, (acc, prev) => acc + prev)
  ),
  43
);
assert.deepStrictEqual(
  pipe(
    O.none,
    O.reduce(1, (acc, prev) => acc + prev)
  ),
  1
);

// separate
assert.deepStrictEqual(O.separate(O.some(E.right(42))), {
  left: O.none,
  right: O.some(42)
});
assert.deepStrictEqual(O.separate(O.some(E.left("error msg"))), {
  left: O.some("error msg"),
  right: O.none
});
assert.deepStrictEqual(O.separate(O.none), { left: O.none, right: O.none });
