import type { SchemaScoringExtension } from "./Scoring/ScoringExtension";
import type { SchemaUpdateCounterExtension } from "./UpdateCounter/UpdateCounterExtension";

export type SchemaExtension =
    | SchemaUpdateCounterExtension
    | SchemaScoringExtension
    | Record<string, unknown>;
