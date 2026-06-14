export const operators: string[] = [
    "==",
    "!=",
    ">",
    "<",
    ">=",
    "<=",
    "includes",
    "!includes",
    //todo: startsWith, endsWith, !contains
    //todo: maybe contains should be rename into includes
] as const;

export type Operator = (typeof operators)[number];

export type Relation = "and" | "or";
export const relations: Relation[] = ["and", "or"];

// A single expression (field, operator, value)
export type ExpressionField = string;
export type ExpressionValue = any;
export type Expression = [ExpressionField, Operator, ExpressionValue];

export type ExpressionOrCondition = Expression | Condition;

// A condition is either a single expression or a nested structure with relations
export type Condition =
    | Expression
    | [ExpressionOrCondition, Relation, ExpressionOrCondition]
    | [
          ExpressionOrCondition,
          Relation,
          ExpressionOrCondition,
          Relation,
          ExpressionOrCondition,
      ]
    | [
          ExpressionOrCondition,
          Relation,
          ExpressionOrCondition,
          Relation,
          ExpressionOrCondition,
          Relation,
          ExpressionOrCondition,
      ]
    | [
          ExpressionOrCondition,
          Relation,
          ExpressionOrCondition,
          Relation,
          ExpressionOrCondition,
          Relation,
          ExpressionOrCondition,
          Relation,
          ExpressionOrCondition,
      ];

export type PlaceholderType =
    | "self"
    | "data"
    | "var"
    | "qualification"
    | "validation"
    | "def";

export interface Placeholder {
    type: PlaceholderType;
    path: string;
    modifier?: string;
}

export type PlaceholderList = Record<string, Placeholder[]>;
