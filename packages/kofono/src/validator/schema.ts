import type { SchemaAlphaValidator } from "./alpha/AlphaValidator";
import type { SchemaAlphaNumValidator } from "./alphaNum/AlphaNumValidator";
import type { SchemaBetweenValidator } from "./between/BetweenValidator";
import type { SchemaConditionValidator } from "./condition/ConditionValidator";
import type { SchemaDatetimeValidator } from "./datetime/DatetimeValidator";
import type { SchemaEmailValidator } from "./email/EmailValidator";
import type { SchemaEmptyValidator } from "./empty/EmptyValidator";
import type { SchemaNotEmptyValidator } from "./empty/NotEmptyValidator";
import type { SchemaEqualValidator } from "./equal/EqualValidator";
import type { SchemaNotEqualValidator } from "./equal/NotEqualValidator";
import type { SchemaIfValidator } from "./if/IfValidator";
import type { SchemaIncludesValidator } from "./includes/IncludesValidator";
import type {
    SchemaNotIncludesValidator
} from "./includes/NotIncludesValidator";
import type { SchemaIsFalseValidator } from "./isFalse/IsFalseValidator";
import type { SchemaIsTrueValidator } from "./isTrue/IsTrueValidator";
import type { SchemaIsNotValidValidator } from "./isValid/IsNotValidValidator";
import type { SchemaIsValidValidator } from "./isValid/IsValidValidator";
import type { SchemaLengthValidator } from "./length/LengthValidator";
import type { SchemaMaxValidator } from "./max/MaxValidator";
import type { SchemaMinValidator } from "./min/MinValidator";
import type { SchemaPasswordValidator } from "./password/PasswordValidator";
import type { SchemaRegexpValidator } from "./regexp/RegexpValidator";
import type { SchemaRequiredValidator } from "./required/RequiredValidator";
import { SchemaSameAsValidator } from "./sameAs/SameAsValidator";
import type { SchemaUrlValidator } from "./url/UrlValidator";

export type SchemaPropertyBaseValidator = {
    error?: string;
};

export type SchemaPropertyValidator =
    | SchemaAlphaNumValidator
    | SchemaAlphaValidator
    | SchemaBetweenValidator
    | SchemaConditionValidator
    | SchemaDatetimeValidator
    | SchemaEmailValidator
    | SchemaEmptyValidator
    | SchemaEqualValidator
    | SchemaIfValidator
    | SchemaIncludesValidator
    | SchemaIsFalseValidator
    | SchemaIsNotValidValidator
    | SchemaIsTrueValidator
    | SchemaIsValidValidator
    | SchemaLengthValidator
    | SchemaMaxValidator
    | SchemaMinValidator
    | SchemaNotEmptyValidator
    | SchemaNotEqualValidator
    | SchemaNotIncludesValidator
    | SchemaPasswordValidator
    | SchemaRegexpValidator
    | SchemaRequiredValidator
    | SchemaSameAsValidator
    | SchemaUrlValidator;
