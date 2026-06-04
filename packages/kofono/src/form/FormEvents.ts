import { PropertyType, type PropertyValidator } from "../property/types";
import type {
    ValidationContext,
    ValidationType,
    ValidatorResponse,
} from "../validator/types";
import { parseSelectorsEventsValidators } from "./events/helpers";
import type { SelectorEventResponse } from "./events/SelectorEventResponse";
import { SelectorEventsHandler } from "./events/SelectorEventsHandler";
import { SelectorValidatorsEvent } from "./events/SelectorValidatorsEvent";
import {
    Events,
    type GlobalEventCallbacks,
    type GlobalEventCtx,
    type GlobalEvents,
    type SelectorEventCallbacks,
    type SelectorEventCtx,
    type SelectorEvents,
    type SelectorsEvents,
    type SelectorsEventsValidators,
} from "./events/types";
import type { Form } from "./Form";

export class FormEvents {
    public selectorsEvents: SelectorsEvents = {};
    public globalEvents: Partial<GlobalEvents> = {};
    public selectorsDependencies: Record<string, string[]> = {};

    constructor(private form: Form) {}

    /**
     * Attaches a callback function to a specific global event.
     *
     * The event type should be a key from the `GlobalEvents` type.
     * The callback function should match the signature of the event type in the `GlobalEventCallbacks`
     */
    public on<K extends keyof GlobalEvents>(
        event: K,
        callback: GlobalEventCallbacks[K],
    ): FormEvents {
        if (!this.globalEvents[event]) {
            this.globalEvents[event] = [];
        }

        (this.globalEvents[event] as GlobalEventCallbacks[K][]).push(callback);
        return this;
    }

    /**
     * Attaches a callback function to a specific selector event.
     *
     * The event type should be a key from the `SelectorEvents` type.
     * The callback function should match the signature of the event type in the `SelectorEventCallbacks`
     * Dependencies argument is an array of selectors attached to the selector.
     */
    public onSelector<K extends keyof SelectorEvents>(
        selector: string,
        event: K,
        callback: SelectorEventCallbacks[K],
        dependencies: string[] = [],
    ): FormEvents {
        if (!this.validateSelector(selector)) {
            return this;
        }

        if (!this.selectorsEvents[selector]) {
            this.selectorsEvents[selector] = {
                [Events.SelectorValidation]: [],
                [Events.SelectorQualification]: [],
            };
        }

        if (dependencies.length > 0) {
            this.attachDependenciesTo(selector, dependencies);
        }
        this.selectorsEvents[selector][event].push(callback);
        return this;
    }

    /**
     * Attaches a callback function to the validation event of a specific selector.
     * @see onSelector() for argument description.
     */
    public onSelectorValidation(
        selector: string,
        callback: (
            ctx: ValidationContext,
        ) => ValidatorResponse | Promise<ValidatorResponse>,
        dependencies: string[] = [],
    ): FormEvents {
        return this.onSelector(
            selector,
            Events.SelectorValidation,
            callback,
            dependencies,
        );
    }

    /**
     * Attaches a callback function to the qualification event of a specific selector.
     * @see onSelector() for the argument description.
     */
    public onSelectorQualification(
        selector: string,
        callback: (
            ctx: ValidationContext,
        ) => ValidatorResponse | Promise<ValidatorResponse>,
        dependencies: string[] = [],
    ): FormEvents {
        return this.onSelector(
            selector,
            Events.SelectorQualification,
            callback,
            dependencies,
        );
    }

    /**
     * Emits a global event.
     */
    public async emit<K extends keyof GlobalEvents>(
        event: K,
        ctx: GlobalEventCtx[K],
    ): Promise<unknown[] | undefined> {
        if (!this.globalEvents[event]) {
            return;
        }

        const results: unknown[] = [];
        for (const handler of this.globalEvents[event]) {
            results.push(await handler(ctx as any));
        }
        return results;
    }

    /**
     * Emits a selector event.
     */
    public async emitSelector<K extends keyof SelectorEvents>(
        selector: string,
        event: K,
        ctx: SelectorEventCtx[K],
    ): Promise<SelectorEventResponse | null> {
        return await new SelectorEventsHandler(
            this.form,
            selector,
            event,
            ctx,
        ).emit();
    }

    // /**
    //  * Emits a selector validation event. (shortcut for emitSelector)
    //  */
    // public async emitSelectorValidation(
    //     selector: string,
    //     ctx: ValidationContext,
    // ): Promise<SelectorEventResponse | null> {
    //     return await this.emitSelector(selector, Events.SelectorValidation, ctx);
    // }
    //
    // /**
    //  * Emits a selector qualification event. (shortcut for emitSelector)
    //  */
    // public async emitSelectorQualification(
    //     selector: string,
    //     ctx: ValidationContext,
    // ): Promise<SelectorEventResponse | null> {
    //     return await this.emitSelector(selector, Events.SelectorQualification, ctx);
    // }

    /**
     * Emits the event on all selector dependencies.
     */
    public async emitSelectorTree(
        selector: string,
        event: keyof SelectorEvents,
    ): Promise<void> {
        for (const sel of this.getSelectorsDependencies(selector)) {
            const depResponse = await this.emitSelector(sel, event, {
                selector: sel,
                value: this.form.$d(sel),
                form: this.form,
            });
            if (depResponse?.hasChanged()) {
                await this.emitSelectorTree(sel, event);
            }
        }
    }

    /**
     * Detaches all events attached to the given selector.
     */
    public offSelector(selector: string): FormEvents {
        delete this.selectorsEvents[selector];
        return this.detachSelectorFromDependencies(selector);
    }

    /**
     * Attaches the given dependencies to the given selector.
     */
    public attachDependenciesTo(selector: string, deps: string[]): FormEvents {
        if (!this.validateSelector(selector)) {
            return this;
        }

        for (const dep of deps) {
            if (!this.selectorsDependencies[dep]) {
                this.selectorsDependencies[dep] = [];
            }
            this.selectorsDependencies[dep] = Array.from(
                new Set(this.selectorsDependencies[dep].concat(selector)),
            );
        }

        return this;
    }

    /**
     * Detaches the given selector from all its dependencies.
     */
    public detachSelectorFromDependencies(selector: string): FormEvents {
        for (const [sel, deps] of Object.entries(this.selectorsDependencies)) {
            if (sel === selector) {
                delete this.selectorsDependencies[sel];
            } else if (deps.includes(selector)) {
                this.selectorsDependencies[sel] = deps.filter(
                    d => d !== selector,
                );
            }
        }
        return this;
    }

    /**
     * Returns the selectors that the given selector depends on.
     */
    public getSelectorsDependencies(selector: string): string[] {
        return this.selectorsDependencies[selector] || [];
    }

    /**
     * Returns the selectors that depend on the given selector.
     */
    public getReverseSelectorsDependencies(selector: string): string[] {
        return Object.entries(this.selectorsDependencies)
            .filter(([, deps]) => deps.includes(selector))
            .map(([sel]) => sel);
    }

    public async warmUpSelectorsEvents(): Promise<FormEvents> {
        for (const [selector, prop] of Object.entries(this.form.props)) {
            if (prop.type === PropertyType.Null) {
                continue;
            }
            const ctx = {
                form: this.form,
                selector,
                value: this.form.$d(selector),
            };
            await this.emitSelector(
                selector,
                Events.SelectorQualification,
                ctx,
            );
            await this.emitSelector(selector, Events.SelectorValidation, ctx);
        }
        return this;
    }

    public async registerPropertiesEvents(): Promise<FormEvents> {
        await this.registerSelectorsValidators(
            parseSelectorsEventsValidators(this.form.props),
        );
        return this;
    }

    /**
     * Registers the given selector validators.
     */
    public async registerSelectorsValidators(
        selectorsValidators: SelectorsEventsValidators,
    ): Promise<FormEvents> {
        for (const [selector, events] of Object.entries(selectorsValidators)) {
            await this.registerSelectorValidators(
                selector,
                "validation",
                events[Events.SelectorValidation],
            );
            await this.registerSelectorValidators(
                selector,
                "qualification",
                events[Events.SelectorQualification],
            );
        }
        return this;
    }

    /**
     * Registers the given selector validators.
     */
    protected async registerSelectorValidators(
        selector: string,
        type: ValidationType,
        validators: PropertyValidator[],
    ): Promise<FormEvents> {
        if (!this.validateSelector(selector)) {
            return this;
        }

        if (validators.length === 0) {
            return this;
        }

        const sve = new SelectorValidatorsEvent(
            type,
            this.form,
            selector,
            validators,
        );
        const eventName =
            type === "validation"
                ? Events.SelectorValidation
                : Events.SelectorQualification;

        await this.onSelector(selector, eventName, sve.generateEvent())
            .attachDependenciesTo(selector, sve.dependencies)
            .emitSelector(selector, eventName, {
                selector: selector,
                value: this.form.$d(selector),
                form: this.form,
            });

        return this;
    }

    private validateSelector(selector: string): boolean {
        if (!this.form.hasProp(selector)) {
            // biome-ignore lint/suspicious/noConsole: we want to warn about unknown selectors
            console.error(`Event unknown selector "${selector}"`);
            return false;
        }
        return true;
    }
}
