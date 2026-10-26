export interface ParsedAssertion {
  id: string;
  level: "error" | "warn";
  kind: "category" | "audit";
  key: string;
  op: ">=" | "<=";
  limit: number;
}
export interface AssertionRow {
  id: string;
  level: "error" | "warn";
  op: ">=" | "<=";
  limit: number;
  value: number | null;
  runs: number;
  pass: boolean;
  missing: boolean;
}
export function median(nums: Array<number | null | undefined>): number | null;
export function parseAssertions(assertions: unknown): ParsedAssertion[];
export function evaluate(
  lhrs: unknown[],
  assertions: ParsedAssertion[],
): { rows: AssertionRow[]; errors: AssertionRow[]; warnings: AssertionRow[] };
export function formatRows(rows: AssertionRow[]): string;
