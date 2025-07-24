import slugify from "slugify";
import { makeRandomString } from "./make-random-string";

export const makeSlugs = (text: string) => {
  const slug = slugify(text, {
    trim: true,
    lower: true,
    strict: true,
  });
  return `${slug}-${makeRandomString()}`;
};
