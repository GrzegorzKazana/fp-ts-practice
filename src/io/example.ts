import * as I from "fp-ts/lib/IO";
import { pipe } from "fp-ts/lib/pipeable";

const fakeUserInput: I.IO<string> = I.of("John");
const generateToken: I.IO<string> = () => Math.random().toString();

// combining value and io
const createUniqeName: (
  name: string,
  tokenGenerator: I.IO<string>
) => I.IO<string> = (name, tokenGenerator) =>
  pipe(
    tokenGenerator,
    I.map(token => `${name}${token}`)
  );

// combine two io's
// dont do it this way, it's stupid
const combineNameAndToken: (
  nameInput: I.IO<string>,
  tokenGenerator: I.IO<string>
) => I.IO<string> = (nameInput, tokenGenerator) =>
  pipe(
    nameInput,
    I.chain(name =>
      pipe(
        tokenGenerator,
        I.map(token => `${name}${token}`)
      )
    )
  );
// do it this way
import { sequenceT } from "fp-ts/lib/Apply";
const combineNameAndToken2: (
  nameInput: I.IO<string>,
  tokenGenerator: I.IO<string>
) => I.IO<string> = (nameInput, tokenGenerator) =>
  pipe(
    sequenceT(I.io)(nameInput, tokenGenerator),
    I.map(([name, token]) => `${name}${token}`)
  );

// sample program flow
import { log } from "fp-ts/lib/Console";

const main = pipe(
  fakeUserInput,
  I.map(generateToken),
  log
);

main();
