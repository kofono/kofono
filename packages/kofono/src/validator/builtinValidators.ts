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
import * as Ipv4 from "./regexp/Ipv4v6Validators";
import * as Ipv6 from "./regexp/Ipv4v6Validators";
import * as Regexp from "./regexp/RegexpValidator";
import * as Uuid from "./regexp/UuidValidators";
import * as UuidV4 from "./regexp/UuidValidators";
import * as UuidV6 from "./regexp/UuidValidators";
import * as UuidV7 from "./regexp/UuidValidators";
import * as Required from "./required/RequiredValidator";
import * as NotSameAs from "./sameAs/NotSameAsValidator";
import * as SameAs from "./sameAs/SameAsValidator";
import type { ValidatorDeclaration, ValidatorFactoryHandler } from "./types";
import * as Url from "./url/UrlValidator";

export const builtinValidators: ValidatorDeclaration<any>[] = [
    Alpha.alphaValidator,
    AlphaNum.alphaNumValidator,
    Between.betweenValidator,
    Condition.conditionValidator,
    Datetime.datetimeValidator,
    Email.emailValidator,
    Empty.emptyValidator,
    Equal.equalValidator,
    Excludes.excludesValidator,
    If.ifValidator,
    Includes.includesValidator,
    Ipv4.ipv4Validator,
    Ipv6.ipv6Validator,
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
    Url.urlValidator,
    Uuid.uuidValidator,
    UuidV4.uuidV4Validator,
    UuidV6.uuidV6Validator,
    UuidV7.uuidV7Validator,
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
export * from "./regexp/Ipv4v6Validators";
export * from "./regexp/RegexpValidator";
export * from "./regexp/UuidValidators";
export * from "./required/RequiredValidator";
export * from "./sameAs/NotSameAsValidator";
export * from "./sameAs/SameAsValidator";
export * from "./url/UrlValidator";
