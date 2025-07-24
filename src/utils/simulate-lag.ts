import { logColor } from "./log-color";

export async function simulateLag(millisseconds: number = 0, verbose = false) {
  if (millisseconds <= 0) return;

  if (verbose) {
    logColor(`Aplicando delay de ${millisseconds}ms`);
  }

  await new Promise((resolve) => setTimeout(resolve, millisseconds));
}
