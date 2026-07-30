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
import type { SchemaExcludesValidator } from "./excludes/ExcludesValidator";
import type { SchemaIfValidator } from "./if/IfValidator";
import type { SchemaIncludesValidator } from "./includes/IncludesValidator";
import type { SchemaIsFalseValidator } from "./isFalse/IsFalseValidator";
import type { SchemaIsTrueValidator } from "./isTrue/IsTrueValidator";
import type { SchemaIsNotValidValidator } from "./isValid/IsNotValidValidator";
import type { SchemaIsValidValidator } from "./isValid/IsValidValidator";
import type { SchemaLengthValidator } from "./length/LengthValidator";
import type { SchemaMaxValidator } from "./max/MaxValidator";
import type { SchemaMinValidator } from "./min/MinValidator";
import type { SchemaPasswordValidator } from "./password/PasswordValidator";
import type {
    SchemaCuid2Validator,
    SchemaCuidValidator,
    SchemaGuidValidator,
    SchemaKsuidValidator,
    SchemaNanoidValidator,
    SchemaUlidValidator,
    SchemaXidValidator,
} from "./regexp/IdentifierValidators";
import type { SchemaIntegerValidator } from "./regexp/IntegerValidator";
import type {
    SchemaCidrv4Validator,
    SchemaCidrv6Validator,
    SchemaIpv4Validator,
    SchemaIpv6Validator,
} from "./regexp/IpValidators";
import type { SchemaRegexpValidator } from "./regexp/RegexpValidator";
import type {
    SchemaUuidV4Validator,
    SchemaUuidV6Validator,
    SchemaUuidV7Validator,
    SchemaUuidValidator,
} from "./regexp/UuidValidators";

import type { SchemaRequiredValidator } from "./required/RequiredValidator";
import type { SchemaNotSameAsValidator } from "./sameAs/NotSameAsValidator";
import type { SchemaSameAsValidator } from "./sameAs/SameAsValidator";
import type { SchemaUrlValidator } from "./url/UrlValidator";

export type SchemaPropertyBaseValidator = {
    error?: string;
};

export type SchemaPropertyValidator =
    | SchemaAlphaNumValidator
    | SchemaAlphaValidator
    | SchemaBetweenValidator
    | SchemaConditionValidator
    | SchemaCidrv4Validator
    | SchemaCidrv6Validator
    | SchemaCuid2Validator
    | SchemaCuidValidator
    | SchemaDatetimeValidator
    | SchemaEmailValidator
    | SchemaEmptyValidator
    | SchemaEqualValidator
    | SchemaExcludesValidator
    | SchemaGuidValidator
    | SchemaIfValidator
    | SchemaIncludesValidator
    | SchemaIntegerValidator
    | SchemaIpv4Validator
    | SchemaIpv6Validator
    | SchemaIsFalseValidator
    | SchemaIsNotValidValidator
    | SchemaIsTrueValidator
    | SchemaIsValidValidator
    | SchemaKsuidValidator
    | SchemaLengthValidator
    | SchemaMaxValidator
    | SchemaMinValidator
    | SchemaNanoidValidator
    | SchemaNotEmptyValidator
    | SchemaNotEqualValidator
    | SchemaNotSameAsValidator
    | SchemaPasswordValidator
    | SchemaRegexpValidator
    | SchemaRequiredValidator
    | SchemaSameAsValidator
    | SchemaUlidValidator
    | SchemaUrlValidator
    | SchemaUuidV4Validator
    | SchemaUuidV6Validator
    | SchemaUuidV7Validator
    | SchemaUuidValidator
    | SchemaXidValidator;
