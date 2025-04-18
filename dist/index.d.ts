import { FormCheckerResult, FormCheckerRules, FormCheckerSchema } from "./types";
export declare function formChecker<Fields extends string>(schema: FormCheckerSchema<Fields>, data: Record<Fields, any>): Promise<FormCheckerResult<Fields>>;
export type { FormCheckerResult, FormCheckerRules, FormCheckerSchema };
export default formChecker;
