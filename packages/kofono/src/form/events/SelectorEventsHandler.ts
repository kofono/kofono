import { PropertyType, TreeType } from "../../property/types";
import {
    type ValidationContext,
    ValidatorError,
    type ValidatorResponse,
} from "../../validator/types";
import type { Form } from "../Form";
import type { FormProperty } from "../FormProperty";
import { Update } from "../types";
import { SelectorEventResponse } from "./SelectorEventResponse";
import { Events, type SelectorEventCtx, type SelectorEvents } from "./types";

/**
 * Wrap selector validations/qualification event and handle their responses
 */
export class SelectorEventsHandler<K extends keyof SelectorEvents> {
    constructor(
        private form: Form,
        private selector: string,
        private event: K,
        private ctx: SelectorEventCtx[K],
    ) {}

    public async emit(): Promise<SelectorEventResponse | null> {
        // skip selectors without events and disqualified selectors
        // console.log({
        //     events: this.form.events.selectorsEvents,
        //     selector: this.selector,
        //     exists: this.form.events.selectorsEvents[this.selector],
        //     qualify: this.form.prop(this.selector)!.isQualify(),
        // });

        if (
            !this.form.events.selectorsEvents[this.selector] ||
            (this.event === Events.SelectorValidation &&
                this.form.prop(this.selector)?.isQualified() === false)
        ) {
            return null;
        }

        const before: ValidatorResponse =
            this.event === Events.SelectorValidation
                ? this.form.$v(this.selector)
                : this.form.$q(this.selector);

        for (const handler of this.form.events.selectorsEvents[this.selector][
            this.event
        ]) {
            const after: ValidatorResponse = await handler(this.ctx);
            if (!after[0]) {
                return await this.handleResponse(
                    new SelectorEventResponse(before, after),
                );
            }
        }

        return await this.handleResponse(
            new SelectorEventResponse(before, [true, ""]),
        );
    }

    /**
     * Handle a selector event response
     */
    private async handleResponse(
        selectorEventResponse: SelectorEventResponse,
    ): Promise<SelectorEventResponse> {
        const prop: FormProperty = this.form.prop(this.selector);

        // update validation or qualification
        if (this.event === Events.SelectorValidation) {
            prop.validation = selectorEventResponse.after;
        } else {
            prop.qualification = selectorEventResponse.after;
        }

        const [validatorSucceed] = selectorEventResponse.after;

        if (selectorEventResponse.hasChanged()) {
            this.form.compileStats();
        }

        // handle qualifications/disqualifications state change
        if (
            this.event === Events.SelectorQualification &&
            selectorEventResponse.hasChanged()
        ) {
            !validatorSucceed
                ? await this.handlePropDisqualification(prop)
                : await this.handlePropQualification(prop);
            this.form.compileStats();
        }

        return selectorEventResponse;
    }

    /**
     * Handle a property being disqualified
     */
    private async handlePropDisqualification(
        prop: FormProperty,
    ): Promise<void> {
        prop.validation = [false, ValidatorError.SelectorDisqualified];

        if (prop.type === PropertyType.Object) {
            const children = prop.childrenSelectors();
            for (const childSelector of children) {
                const childProp = this.form.prop(childSelector);
                childProp.validation = [
                    false,
                    ValidatorError.SelectorDisqualified,
                ];
                childProp.qualification = [
                    false,
                    ValidatorError.ParentDisqualified,
                ];
                await this.resetValueOfDisqualifiedSelector(childProp);
            }
        } else {
            await this.resetValueOfDisqualifiedSelector(prop);
        }
    }

    /**
     * Handle a property being qualified
     */
    private async handlePropQualification(prop: FormProperty): Promise<void> {
        if (prop.type === PropertyType.Object) {
            // reset validation on object
            await this.form.events.emitSelector(
                prop.selector,
                Events.SelectorValidation,
                {
                    form: this.form,
                    selector: prop.selector,
                    value: prop.value,
                },
            );

            // call validation/qualification children off newly qualified selector
            const children = prop.childrenSelectors();
            for (const childSelector of children) {
                const ctx: ValidationContext = {
                    form: this.form,
                    selector: childSelector,
                    value: this.form.prop(childSelector).value,
                };
                await this.form.events.emitSelector(
                    childSelector,
                    Events.SelectorQualification,
                    ctx,
                );
                await this.form.events.emitSelector(
                    childSelector,
                    Events.SelectorValidation,
                    ctx,
                );
            }
        } else {
            // call validation on newly qualified selector
            await this.form.events.emitSelector(
                this.selector,
                Events.SelectorValidation,
                {
                    form: this.form,
                    selector: this.selector,
                    value: prop.value,
                },
            );
        }
    }

    /**
     * Revert to the default value of a disqualified selector
     */
    private async resetValueOfDisqualifiedSelector(
        prop: FormProperty,
    ): Promise<void> {
        if (prop.treeType === TreeType.Leaf) {
            const defaultValue = prop.get("default", null);
            await this.form.update(
                prop.selector,
                defaultValue,
                Update.ResetQualification,
            );
        }
    }
}
