import * as I from "fp-ts/lib/IO";
import { pipe } from "fp-ts/lib/pipeable";
import assert = require("assert");

// wrapping console.log
const log = (...args): I.IO<void> => () => console.log(...args);
log("asd"); // nothing happens
log("asd")(); // prints 'asd'

// wrapping random number generation
const random: I.IO<number> = () => Math.random();
random(); // returns random number

// typing value as undeterministic
const undeterministicValue: I.IO<number> = I.of(42);
undeterministicValue(); // returns 42

// map
const mappedRandom = pipe(
  random,
  I.map(x => x * 10)
);
mappedRandom(); // returns mapped random value

// chain
const fakeUserInput: I.IO<string> = () => "John";
const fakeResponse: (str: string) => I.IO<string> = str => () =>
  `${str}${Math.random()}`;
const scrambledUser = pipe(
  fakeUserInput,
  I.chain(fakeResponse)
);
scrambledUser(); // returns 'John0.123456'

// ap - applies finction wrapped in io to value in io
const undeterimisticFunction: I.IO<(str: string) => string> = () => str =>
  `${str}${Math.random()}`;
const x = pipe(
  undeterimisticFunction,
  I.ap(fakeUserInput)
);
x(); // returns 'John0.123456'

// flatten
assert.deepStrictEqual(I.flatten(I.of(I.of(42)))(), I.of(42)());
