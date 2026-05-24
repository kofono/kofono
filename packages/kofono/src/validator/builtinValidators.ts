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
import * as If from "./if/IfValidator";
import * as Includes from "./includes/IncludesValidator";
import * as NotIncludes from "./includes/NotIncludesValidator";
import * as IsFalse from "./isFalse/IsFalseValidator";
import * as IsTrue from "./isTrue/IsTrueValidator";
import * as IsNotValid from "./isValid/IsNotValidValidator";
import * as IsValid from "./isValid/IsValidValidator";
import * as Length from "./length/LengthValidator";
import * as Max from "./max/MaxValidator";
import * as Min from "./min/MinValidator";
import * as Password from "./password/PasswordValidator";
import * as Regexp from "./regexp/RegexpValidator";
import * as Required from "./required/RequiredValidator";
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
    If.ifValidator,
    Includes.includesValidator,
    IsFalse.isFalseValidator,
    IsNotValid.isNotValidValidator,
    IsTrue.isTrueValidator,
    IsValid.isValidValidator,
    Length.lengthValidator,
    Max.maxValidator,
    Min.minValidator,
    NotEmpty.notEmptyValidator,
    NotEqual.notEqualValidator,
    NotIncludes.notIncludesValidator,
    Password.passwordValidator,
    Regexp.regexpValidator,
    Required.requiredValidator,
    Url.urlValidator,
] as const;

export const builtinValidatorFactories: Record<
    string,
    ValidatorFactoryHandler<any>
> = Object.fromEntries(builtinValidators.map(v => [v.name, v.factory]));
