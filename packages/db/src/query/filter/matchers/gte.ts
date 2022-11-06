import { GteMatcher } from "../../types";

export function matchesGte<T extends number | string | Date | BigInt | null | undefined>(
  value: T,
  matcher: GteMatcher<T>
): boolean {
  return value! >= matcher.$gte!;
}