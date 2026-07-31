import * as Alpha from "./alpha/AlphaValidator";
import * as AlphaNum from "./alphaNum/AlphaNumValidator";
import * as Between from "./between/BetweenValidator";
import * as Condition from "./condition/ConditionValidator";
import * as Datetime from "./datetime/DatetimeValidator";
import * as Email from "./email/EmailValidator";
import * as Empty from "./empty/EmptyValidator";
import * as NotEmpty from "./empty/NotEmptyValidator";
import * as Equal from "./equal/EqualValidator";
import * as NotEqual from "./equal/NotEqualValidator";
import * as Excludes from "./excludes/ExcludesValidator";
import * as If from "./if/IfValidator";
import * as Includes from "./includes/IncludesValidator";
import * as IsFalse from "./isFalse/IsFalseValidator";
import * as IsTrue from "./isTrue/IsTrueValidator";
import * as IsNotValid from "./isValid/IsNotValidValidator";
import * as IsValid from "./isValid/IsValidValidator";
import * as Length from "./length/LengthValidator";
import * as Max from "./max/MaxValidator";
import * as Min from "./min/MinValidator";
import * as Password from "./password/PasswordValidator";
import * as Base64 from "./regexp/Base64Validators";
import * as Identifier from "./regexp/IdentifierValidators";
import * as Integer from "./regexp/IntegerValidator";
import * as Ip from "./regexp/IpValidators";
import * as Regexp from "./regexp/RegexpValidator";
import * as StringValidator from "./regexp/StringValidators";
import * as Uuid from "./regexp/UuidValidators";
import * as Required from "./required/RequiredValidator";
import * as NotSameAs from "./sameAs/NotSameAsValidator";
import * as SameAs from "./sameAs/SameAsValidator";
import type { ValidatorDeclaration, ValidatorFactoryHandler } from "./types";
import * as Url from "./url/UrlValidator";

export const builtinValidators: ValidatorDeclaration<any>[] = [
    Alpha.alphaValidator,
    AlphaNum.alphaNumValidator,
    Base64.base64Validator,
    Base64.base64urlValidator,
    Between.betweenValidator,
    Condition.conditionValidator,
    Datetime.datetimeValidator,
    Email.emailValidator,
    Empty.emptyValidator,
    Equal.equalValidator,
    Excludes.excludesValidator,
    Identifier.cuid2Validator,
    Identifier.cuidValidator,
    Identifier.guidValidator,
    Identifier.ksuidValidator,
    Identifier.nanoidValidator,
    Identifier.ulidValidator,
    Identifier.xidValidator,
    If.ifValidator,
    Includes.includesValidator,
    Integer.integerValidator,
    Ip.ipv4Validator,
    Ip.ipv6Validator,
    Ip.cidrv4Validator,
    Ip.cidrv6Validator,
    IsFalse.isFalseValidator,
    IsNotValid.isNotValidValidator,
    IsTrue.isTrueValidator,
    IsValid.isValidValidator,
    Length.lengthValidator,
    Max.maxValidator,
    Min.minValidator,
    NotEmpty.notEmptyValidator,
    NotEqual.notEqualValidator,
    NotSameAs.notSameAsValidator,
    Password.passwordValidator,
    Regexp.regexpValidator,
    Required.requiredValidator,
    SameAs.sameAsValidator,
    StringValidator.lowercaseValidator,
    StringValidator.uppercaseValidator,
    StringValidator.hexValidator,
    Url.urlValidator,
    Uuid.uuidV4Validator,
    Uuid.uuidV6Validator,
    Uuid.uuidV7Validator,
    Uuid.uuidValidator,
] as const;

export const builtinValidatorFactories: Record<
    string,
    ValidatorFactoryHandler<any>
> = Object.fromEntries(builtinValidators.map(v => [v.name, v.factory]));

// validator exports
export * from "./alpha/AlphaValidator";
export * from "./alphaNum/AlphaNumValidator";
export * from "./between/BetweenValidator";
export * from "./condition/ConditionValidator";
export * from "./condition/when";
export * from "./datetime/DatetimeValidator";
export * from "./email/EmailValidator";
export * from "./empty/EmptyValidator";
export * from "./empty/NotEmptyValidator";
export * from "./equal/EqualValidator";
export * from "./equal/NotEqualValidator";
export * from "./excludes/ExcludesValidator";
export * from "./if/IfValidator";
export * from "./includes/IncludesValidator";
export * from "./isFalse/IsFalseValidator";
export * from "./isTrue/IsTrueValidator";
export * from "./isValid/IsNotValidValidator";
export * from "./isValid/IsValidValidator";
export * from "./length/LengthValidator";
export * from "./max/MaxValidator";
export * from "./min/MinValidator";
export * from "./password/PasswordValidator";
export * from "./regexp/Base64Validators";
export * from "./regexp/IdentifierValidators";
export * from "./regexp/IntegerValidator";
export * from "./regexp/IpValidators";
export * from "./regexp/RegexpValidator";
export * from "./regexp/StringValidators";
export * from "./regexp/UuidValidators";
export * from "./required/RequiredValidator";
export * from "./sameAs/NotSameAsValidator";
export * from "./sameAs/SameAsValidator";
export * from "./url/UrlValidator";
