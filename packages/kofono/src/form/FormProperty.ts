import type {
    BaseProperty,
    PropertyType,
    PropertyValidator,
    TreeType,
} from "../property/types";
import type { SchemaProperty } from "../schema/Schema";
import { parentSelectors } from "../selector/helpers";
import type {
    ValidatorResponse,
    ValidatorResponseContext,
} from "../validator/types";
import { Events } from "./events/types";
import type { Form } from "./Form";

export class FormProperty<TSchemaType extends SchemaProperty = SchemaProperty>
    implements BaseProperty<TSchemaType>
{
    constructor(
        public readonly property: BaseProperty<TSchemaType>,
        private form: Form,
    ) {}

    public get type(): PropertyType {
        return this.property.type;
    }

    public get treeType(): TreeType {
        return this.property.treeType;
    }

    public get selector(): string {
        return this.property.selector;
    }

    public get validation(): ValidatorResponse {
        return this.form.state.validations[this.selector];
    }

    public get validationError(): string {
        return this.validation[1];
    }

    public set validation(validation: ValidatorResponse) {
        this.form.state.validations[this.selector] = validation;
    }

    public get validationErrorContext(): ValidatorResponseContext {
        return this.validation[2] ?? ({} as ValidatorResponseContext);
    }

    public get validationValidators(): PropertyValidator[] {
        return this.property.validators();
    }

    public get qualification(): ValidatorResponse {
        return this.form.state.qualifications[this.selector];
    }

    public set qualification(qualification: ValidatorResponse) {
        this.form.state.qualifications[this.selector] = qualification;
    }

    public get qualificationError(): string {
        return this.qualification[1];
    }

    public get qualificationValidators(): PropertyValidator[] {
        return this.property.qualifiers();
    }

    public get value(): unknown {
        if (this.property.type === "null") {
            return undefined;
        }
        return this.form.$d(this.selector);
    }

    public def(): TSchemaType {
        return this.property.def(); // as TSchemaType;
    }

    /**
     * Returns the value of the property at the given key path or a default value.
     */
    public get<T>(defKeyPath: string, defaultValue: unknown = null): T {
        return this.property.get<T>(defKeyPath, defaultValue);
    }

    public has(defKeyPath: string): boolean {
        return this.property.has(defKeyPath);
    }

    public qualifiers(): PropertyValidator[] {
        return this.property.qualifiers();
    }

    public renameSelector(selector: string): void {
        this.property.renameSelector(selector);
    }

    public validators(): PropertyValidator[] {
        return this.property.validators();
    }

    public isQualified(): boolean {
        return this.form.state.qualifications[this.selector][0];
    }

    public isValid(): boolean {
        return this.form.state.validations[this.selector][0];
    }

    public isRequired(): boolean {
        const selEvents = this.form.events.selectorsEvents[this.selector];
        return selEvents && selEvents[Events.SelectorValidation].length > 0;
    }

    public isOptional(): boolean {
        return !this.isRequired();
    }

    public hasBeenUpdated(): boolean {
        return this.form.session.hasBeenUpdated(this.selector);
    }

    /**
     * Returns the current value of the property or a default value
     * @param defaultValue The default value to return if the property value is null or undefined.
     */
    public valueOrDefault<T>(defaultValue: T): T {
        if (this.property.type === "null") {
            return defaultValue;
        }

        const [exists, data] = this.form.$.tryGet(this.selector);

        // const data = this.form.$d(this.selector);
        if (!exists || data === null || data === undefined) {
            return defaultValue;
        }
        return data as T;
    }

    // public async update(data: unknown): Promise<void> {
    //     await this.form.update(this.selector, data);
    // }

    // public parentLevel(): number {
    //     return this.selector.split(DataSelector.separator).length - 1;
    // }

    // public parentsSelectors(): string[] {
    //     const selectors: string[] = [];
    //     for (const sel of parentSelectors(this.selector)) {
    //         selectors.push(sel);
    //     }
    //     return selectors;
    // }

    public parentsQualified(): boolean {
        for (const sel of parentSelectors(this.selector)) {
            if (!this.form.prop(sel).isQualified()) {
                return false;
            }
        }
        return true;
    }

    public childrenSelectors(includeParent: boolean = false): string[] {
        const selectors = this.form.selectors.getChildrenSelectors(
            this.selector,
        );
        if (includeParent) {
            selectors.push(this.selector);
        }
        return selectors;
    }

    // public childrenProps(includeParent: boolean = false): Properties {
    //     return this.form.childrenProps(this.property.selector, includeParent);
    // }
}
