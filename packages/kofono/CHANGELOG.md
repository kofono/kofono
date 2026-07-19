# 0.9.0 - ?

- add cache to speed up form stats compilation
- remove YAML schema support
- replace date-fns dependency by local functions
- refactor property builder
- add a schema normalization process at the build stage
- switch to rolldown for building the library
- modify ts compilation to only output declaration files
- modify RequiredValidator validates against enum values if defined
- modify K.form() to also accept raw Schema
- Form constructor convert Property to FormProperty instances
- deprecate Form.rawProp()
- cleanup FormProperty unused getters/setters
- rename type SchemaPropertiesDeclarations to SchemaDeclaration
- replace non-generic type FormProperties by BaseProperties generic type
- fix RequiredValidator to work with enum values and list properties
- refactor validator errors to their respective folders 
- introduce ValidatorDeclaration type
- rename the wrong name ValidatorError enum to QualificationError
- modify form stats compilation to round the progression value
- add SameAsValidator
- rename NotIncludesValidator to ExcludesValidator
- remove Form.dataSelector getter

# 0.8.0 - 2026-04-28

- K type methods use variadic params
- rename plugins to extensions for better intent
- move out FormConfig properties and extensions to building steps
- deprecate K builder $v() and $q()
- K validations() and qualications() use variadic params
- refactor mechanic around GenericValidator + introduce addValidator()
- move FormConfig.init() call to Form.init() and make it async
- add FormInitContext
- refactor Form properties, constructor and init methods
- drop Form #config in favor of direct properties
- rework custom extensions support
- transform DataTree class methods into three functions
- remove deprecated form logs
- fix some array edge cases with DataSelector
- refactor extension schema and metadata structure
- refactor extension building steps custom extensions support
- Form.pass is now a function instead of a property
- isolate state between form instances
- add Form.errors() to simplify error retrieval

# 0.7.0 - 2026-03-29

- rework form session to use state meta
- add plugins to state meta
- add events FormLoadState
- add Form.isQualified()
- add Form.pass
- refactor schema builder validators declaration
- add a base plugin and rework UpdateCounterPlugins
- add IsTrueValidator and IsFalseValidator
- add IncludesValidator and NotIncludesValidator
- add LengthValidator
- rework validators factory
- prefix valid and notValid validators with "is" for consistency

# 0.6.0 - 2026-01-03

- rename project to Kofono
- rename S to K
- prevent prototype pollution in DataSelector
- add event PropertyAdded and PropertyDeleted
- add event ArrayPropertyExpanded and ArrayPropertySliced
- add condition modifier toUpperCase
- add test for PasswordValidator

# 0.5.0 - 2025-11-29

- add IfValidator
- add EmptyValidator
- remove ValueValidator
- add Condition parser and validator
- add RequiredValidator
- add FormProperty isRequired() && isOptional() methods
- add S builder extendsSchema()
- refactor validator errors under an object called ValidatorErrors
- support optional context for validator response

# 0.4.0 - 2025-07-01

- rework Form constructor and initialization
- rework events types
- rework validators
- rename validator isValid and isNotValid to valid and notValid
- add min/max, regexp, equal, notEqual, url, alpha, alphaNum validators
- drop biomejs and revert to prettier
- introduce plugins + refactor form building accordingly

# 0.3.0 - 2025-03-01

- rework FormProperty and introduce interface BaseProperty
- add fluent schema builder
- drop prettier and eslint for biomejs
- drop jest for vitest
- switch to pnpm

# 0.2.0 - 2024-05-25

- fix/rework types for Events callbacks and contexts
- add form component
- better property default data handling
- add updateId to event context and Form::updateId()
- switch to async for build and events
- drop duplicate type ValidationCtx
- modify Form.update() to also trigger dependencies validation event
- add token var replacement in ValueValidator
- add email validator

# 0.1.0 - 2023-10-05

- First prototype version
