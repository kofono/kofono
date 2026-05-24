import { version as packageVersion } from "../../package.json";
import type { ExtensionsFactory } from "../extension/ExtensionsFactory";
import type { Property } from "../property/Property";
import type { BaseProperty } from "../property/types";
import type { SchemaProperty } from "../schema/Schema";
import { DataSelector } from "../selector/DataSelector";
import type { ValidatorResponse } from "../validator/types";
import type { ValidatorsFactory } from "../validator/ValidatorsFactory";
import { generateTree } from "./dataTree";
import { Events, type SelectorUpdateCtx } from "./events/types";
import { FormArray } from "./FormArray";
import { FormDataSelector } from "./FormDataSelector";
import { FormEvents } from "./FormEvents";
import { FormExtensions } from "./FormExtensions";
import { FormInitContext } from "./FormInitContext";
import { FormProperty } from "./FormProperty";
import { FormSelectors } from "./FormSelectors";
import { FormSession } from "./FormSession";
import { generateNewFormState } from "./FormState";
import { FormStats } from "./FormStats";
import {
    type BaseProperties,
    type FormConfig,
    type FormEnv,
    type FormInitConfig,
    type FormProperties,
    FormStatus,
    type PassHandler,
    type PropertyState,
    type State,
    Update,
    type UpdateType,
} from "./types";

export class Form {
    static readonly version: string = packageVersion;

    #props: FormProperties = {};
    #state: State;
    #status: FormStatus = FormStatus.Init;
    #updateId: number = 0;
    readonly #array: FormArray;
    readonly #dataSelector: DataSelector;
    readonly #env: FormEnv;
    readonly #events: FormEvents;
    readonly #extensions: FormExtensions;
    readonly #extensionsFactory: ExtensionsFactory;
    readonly #formDataSelector: FormDataSelector;
    readonly #id: string;
    readonly #passHandler: PassHandler;
    readonly #selectors: FormSelectors;
    readonly #session: FormSession;
    readonly #stats: FormStats;
    readonly #validatorsFactory: ValidatorsFactory;
    readonly #vars: Record<string, unknown>;

    constructor(config: FormConfig, properties: BaseProperties = {}) {
        // order is important here for this block
        this.#state = generateNewFormState(); // side effect: new state
        Object.values(properties).map(x => this._addProp(x)); // side effect: add form props
        this.#state.data = generateTree(this.#props); // side effect: update state data
        this.#session = new FormSession(this); // side effect: update state meta

        // the rest in order, no side effect
        this.#array = new FormArray(this);
        this.#dataSelector = new DataSelector();
        this.#env = config.env;
        this.#events = new FormEvents(this);
        this.#extensions = new FormExtensions(this);
        this.#extensionsFactory = config.extensionsFactory;
        this.#formDataSelector = new FormDataSelector(this);
        this.#id = config.id || "";
        this.#passHandler = config.passHandler;
        this.#selectors = new FormSelectors(this);
        this.#stats = new FormStats(this);
        this.#validatorsFactory = config.validatorsFactory;
        this.#vars = config.vars;

        this.compileStats();
    }

    public get $(): FormDataSelector {
        return this.#formDataSelector;
    }

    public get array(): FormArray {
        return this.#array;
    }

    public get dataSelector(): FormDataSelector {
        return this.#formDataSelector;
    }

    public get env(): string {
        return this.#env;
    }

    public get events(): FormEvents {
        return this.#events;
    }

    public get extensions(): FormExtensions {
        return this.#extensions;
    }

    public get extensionsFactory(): ExtensionsFactory {
        return this.#extensionsFactory;
    }

    public get id(): string {
        return this.#id;
    }

    public get props(): FormProperties {
        return this.#props;
    }

    public get selectors(): FormSelectors {
        return this.#selectors;
    }

    public get session(): FormSession {
        return this.#session;
    }

    public get state(): State {
        return this.#state;
    }

    public get status(): FormStatus {
        return this.#status;
    }

    public get updateId(): number {
        return this.#updateId++;
    }

    public get validatorsFactory(): ValidatorsFactory {
        return this.#validatorsFactory;
    }

    public get vars(): Record<string, unknown> {
        return this.#vars;
    }

    // Get a selector data value
    public $d<T>(selector: string): T {
        return this.#formDataSelector.get<T>(selector);
    }

    // Get a selector qualification value
    public $q(selector: string): ValidatorResponse {
        return this.#state.qualifications[selector];
    }

    // Get a selector validation value
    public $v(selector: string): ValidatorResponse {
        return this.#state.validations[selector];
    }

    public async addProp(prop: BaseProperty<SchemaProperty>): Promise<void> {
        this._addProp(prop);
        await this.#events.emit(Events.PropertyAdded, {
            selector: prop.selector,
        });
    }

    public childrenProps(
        parentSelector: string,
        includeParent: boolean = false,
    ): BaseProperties {
        const props: BaseProperties = {};
        if (includeParent) {
            props[parentSelector] = this.#props[parentSelector];
        }
        for (const selector in this.#props) {
            if (
                selector.startsWith(parentSelector) &&
                selector !== parentSelector
            ) {
                props[selector] = this.#props[selector];
            }
        }
        return props;
    }

    public compileStats(): Form {
        this.#stats.compile();
        this.state.pass = this.#passHandler(this);
        return this;
    }

    public async deleteProp(selector: string): Promise<Form> {
        delete this.#props[selector];
        delete this.state.validations[selector];
        delete this.state.qualifications[selector];
        this.#formDataSelector.tryDelete(selector);
        await this.#events.emit(Events.PropertyDeleted, {
            selector,
        });
        return this;
    }

    public errors(): Record<string, string> {
        const errors: Record<string, string> = {};
        if (!this.pass()) {
            errors.$global = this.state.pass[1];
        }

        for (const [selector, val] of Object.entries(this.state.validations)) {
            if (!val[0] && val[1] !== "") {
                errors[selector] = val[1];
            }
        }

        return errors;
    }

    public hasProp(selector: string): boolean {
        return !!this.#props[selector]?.selector || false;
    }

    public async init(config: FormInitConfig = {}): Promise<void> {
        if (this.#status === FormStatus.Ready) {
            return;
        }

        await this.#stats.init();

        if (config.init) {
            await config.init(new FormInitContext(this));
        }

        await this.#events.emit(Events.FormLoading, undefined);

        await this.#events.registerPropertiesEvents(); // todo: fix > may crash if an non-existent selector is given
        await this.#events.warmUpSelectorsEvents();
        this.compileStats();

        if (config.state) {
            await this.loadState(config.state);
        }

        if (config.extensions) {
            await this.#extensions.build(config.extensions);
        }

        this.#status = FormStatus.Ready;
    }

    public isQualified(selector: string): boolean {
        return this.$q(selector)[0] ?? false;
    }

    public isValid(selector: string): boolean {
        return this.$v(selector)[0] ?? false;
    }

    public async loadState(state: Partial<State>): Promise<void> {
        this.#state = {
            ...this.#state,
            ...state,
        };
        await this.#events.warmUpSelectorsEvents();
        this.compileStats();
        await this.#events.emit(Events.FormLoadState, { state });
    }

    public pass(): boolean {
        return this.#state.pass[0] ?? false;
    }

    public prop<T extends SchemaProperty = SchemaProperty>(
        selector: string,
    ): FormProperty<T> {
        return this.#props[selector] as FormProperty<T>;
    }

    public propsKeys(): string[] {
        return Object.keys(this.#props);
    }

    public propsEntries(): [string, FormProperty<SchemaProperty>][] {
        return Object.entries(this.#props);
    }

    // todo: still necessary?
    public propState(selector: string): PropertyState {
        const validation = this.$v(selector);
        const qualification = this.$q(selector);
        return {
            data: this.$d(selector),
            isValid: validation[0],
            isQualified: qualification[0],
            validationError: validation[1],
            qualificationError: qualification[1],
        };
    }

    // deprecated
    public rawProp<T extends SchemaProperty = SchemaProperty>(
        selector: string,
    ): Property<T> {
        return this.#props[selector].property as Property<T>;
    }

    /**
     * Update the form data with the new value.
     * This method will trigger the validation and qualification events.
     * @param selector
     * @param newValue
     * @param updateType by default the updateType is "normal" which means that the form session is updated.
     */
    public async update(
        selector: string,
        newValue: unknown,
        updateType: UpdateType = Update.Normal,
    ): Promise<void> {
        const [exists, oldValue] = this.#formDataSelector.tryGet(selector);
        if (!exists) {
            throw new Error(`Selector not found: ${selector}`);
        }

        const updateCtx: SelectorUpdateCtx = {
            id: this.#updateId++,
            selector,
            oldValue,
            newValue,
        };

        if (updateType === Update.Normal) {
            this.#session.update(selector);
        }

        await this.#events.emit(Events.SelectorBeforeUpdate, updateCtx);

        this.#formDataSelector.set(selector, newValue);

        const resp = await this.#events.emitSelector(
            selector,
            Events.SelectorValidation,
            {
                form: this,
                selector,
                value: newValue,
            },
        );

        if (resp?.hasChanged() || oldValue !== newValue) {
            await this.#events.emitSelectorTree(
                selector,
                Events.SelectorQualification,
            );
            await this.#events.emitSelectorTree(
                selector,
                Events.SelectorValidation,
            );
        }

        await this.#events.emit(Events.SelectorAfterUpdate, updateCtx);
    }

    /**
     * Update in batch the form data with the new values.
     * @see update
     * @param values
     * @param updateType
     */
    public async updates(
        values: Record<string, unknown>,
        updateType: UpdateType = Update.Normal,
    ): Promise<void> {
        for (const [sel, val] of Object.entries(values)) {
            await this.update(sel, val, updateType);
        }
    }

    public var(keyPath: string): unknown {
        return this.#dataSelector.getOrDefault(keyPath, undefined, this.#vars);
    }

    private _addProp(prop: BaseProperty<SchemaProperty>) {
        this.#props[prop.selector] = new FormProperty(prop, this);
        this.state.validations[prop.selector] = [true, ""];
        this.state.qualifications[prop.selector] = [true, ""];
    }
}
