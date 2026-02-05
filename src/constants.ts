import * as path from "@std/path";

export const HOME = Deno.env.get("HOME")!;
export const PATH = (Deno.env.get("PATH") ?? "").split(":").map((p) => path.resolve(p));
export const SPACING = 12;
