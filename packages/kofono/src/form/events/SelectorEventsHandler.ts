import { PropertyType, TreeType } from "../../property/types";
import {
    QualificationError,
    type ValidationContext,
    type ValidatorResponse,
} from "../../validator/types";
import { getPropertyDefaultValue } from "../dataTree";
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
        const isValidation = this.event === Events.SelectorValidation;

        if (
            !this.form.events.selectorsEvents[this.selector] ||
            !this.form.prop(this.selector).isParentsQualified() ||
            (isValidation && !this.form.isPropQualified(this.selector))
        ) {
            return null;
        }

        const before: ValidatorResponse = isValidation
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

        // handle qualifications/disqualifications when state changes
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
     * Handle a property being disqualified after being qualified
     */
    private async handlePropDisqualification(
        prop: FormProperty,
    ): Promise<void> {
        prop.validation = [false, QualificationError.SelectorDisqualified];

        if (prop.type !== PropertyType.Object) {
            await this.nullifyPropertyValue(prop);
            return;
        }

        const children = prop.getChildrenSelectors();
        for (const childSelector of children) {
            const childProp = this.form.prop(childSelector);
            childProp.validation = [
                false,
                QualificationError.SelectorDisqualified,
            ];
            childProp.qualification = [
                false,
                QualificationError.ParentDisqualified,
            ];

            await this.nullifyPropertyValue(childProp);
        }
    }

    /**
     * Handle a property being qualified after being disqualified
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
            const children = prop.getChildrenSelectors();
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

                if (
                    this.form.isPropQualified(childSelector) &&
                    prop.isParentsQualified()
                ) {
                    await this.resetPropertyValue(prop);
                    await this.form.events.emitSelector(
                        childSelector,
                        Events.SelectorValidation,
                        ctx,
                    );
                }
            }
        } else if (prop.isParentsQualified()) {
            await this.resetPropertyValue(prop);
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
     * Nullify the value of a property (meant for disqualified properties)
     */
    private async nullifyPropertyValue(prop: FormProperty): Promise<void> {
        if (prop.treeType === TreeType.Leaf) {
            await this.form.update(
                prop.selector,
                null,
                Update.ResetQualification,
            );
        }
    }

    /**
     * Revert a property value to his default value (meant for qualified properties)
     */
    private async resetPropertyValue(prop: FormProperty): Promise<void> {
        if (prop.treeType === TreeType.Leaf) {
            const defaultValue = getPropertyDefaultValue(prop);
            await this.form.update(
                prop.selector,
                defaultValue,
                Update.ResetQualification,
            );
        }
    }
}
