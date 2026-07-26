import * as Scoring from "./Scoring/ScoringExtension";
import type { ExtensionFactoryHandler } from "./types";
import * as UpdateCounter from "./UpdateCounter/UpdateCounterExtension";

export const builtinExtensions = [
    UpdateCounter.updateCounterExtension,
    Scoring.scoringExtension,
] as const;

export const builtinExtensionFactories: Record<
    string,
    ExtensionFactoryHandler
> = Object.fromEntries(builtinExtensions.map(v => [v.name, v.factory]));
