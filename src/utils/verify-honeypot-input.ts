import { strict } from "assert";
import { simulateLag } from "./simulate-lag";

export async function verifyHoneypotInput(formData: FormData, delay = 3000) {
  await simulateLag(delay);

  const niceInputValue = formData.get("niceNameToInput");

  console.log(formData);

  const isBot =
    niceInputValue === null ||
    (typeof niceInputValue === "string" && niceInputValue.trim() !== "");

  return isBot;
}
