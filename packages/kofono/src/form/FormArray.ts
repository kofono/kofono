import { buildProps } from "../builder/propsBuilder";
import type { Property } from "../property/Property";
import { PropertyType } from "../property/types";
import type { SchemaArrayProperty, SchemaProperty } from "../schema/Schema";
import { getParentSelector, joinSelectors } from "../selector/helpers";
import { generatePartialTree } from "./dataTree";
import { parseSelectorsEventsValidators } from "./events/helpers";
import { Events } from "./events/types";
import type { Form } from "./Form";
import type { FormProperty } from "./FormProperty";

/**
 * This class is responsible for expanding and slicing arrays properties.
 */
export class FormArray {
    constructor(private form: Form) {}

    public async expand(arraySelector: string, n: number = 1): Promise<void> {
        for (let i = 0; i < n; i++) {
            await this._expand(arraySelector);
        }
        await this.form.events.emit(Events.ArrayPropertyExpanded, {
            selector: arraySelector,
            qty: n,
        });
    }

    /**
     * Expand an array property.
     * - Add new properties to the form props
     * - Add new data to the form data
     * - Register validator events
     */
    private async _expand(arraySelector: string): Promise<void> {
        const prop = this.getProperty(arraySelector);
        const arrayIndex =
            (this.form.$d(arraySelector) as unknown[]).length || 0;

        const newProps = buildProps(
            String(arrayIndex),
            prop.get("items", {}),
            arraySelector,
        );

        for (const prop of Object.values(newProps)) {
            await this.form.addProp(prop as Property<SchemaProperty>);
        }

        const arrayData = generatePartialTree(newProps, arraySelector);
        this.form.dataSelector.set(
            `${arraySelector}.${arrayIndex}`,
            arrayData[arrayIndex],
        );

        const selectorsValidators = parseSelectorsEventsValidators(
            newProps,
            `${arraySelector}.${arrayIndex}`,
        );
        await this.form.events.registerSelectorsValidators(selectorsValidators);
    }

    /**
     * Slice an array property.
     * This operation can be expensive if the array is big and the item slice is at the beginning.
     * - Remove properties from the form props
     * - Remove data from the form data
     * - Unregister validator events
     * - Rename higher indexes properties
     * - Move higher indexes data
     * - Update higher indexes selectors events
     */
    public async slice(arraySelector: string, index: number): Promise<void> {
        const data = this.form.$d(arraySelector) as any[];
        if (index >= data.length || index < 0) {
            throw new Error(
                `Index ${index} for selector ${arraySelector} is out of bounds`,
            );
        }
        const nbItems = data.length;

        const arraySelectorIndex = joinSelectors(arraySelector, String(index));
        const childrenSelector = Object.keys(
            this.form.childrenProps(arraySelectorIndex),
        );
        const emitEvents = async () => {
            const lastItemIndex = nbItems > 0 ? nbItems - 1 : 0;
            const lastItemSelector = joinSelectors(
                arraySelector,
                String(lastItemIndex),
            );
            const childrenSelector =
                this.form.selectors.getChildrenSelectors(lastItemSelector);
            for (const sel of childrenSelector) {
                await this.form.events.emit(Events.PropertyDeleted, {
                    selector: sel,
                });
            }

            await this.form.events.emit(Events.ArrayPropertySliced, {
                selector: arraySelector,
                index,
            });
        };

        for (const [sel] of childrenSelector) {
            // delete property children
            await this.form.deleteProp(sel);
            // unregister validator events and remove selector from events dependencies
            this.form.events.offSelector(sel);
        }

        // delete array index data
        this.form.dataSelector.delete(arraySelectorIndex);

        // is it the last item?
        if (index === nbItems - 1) {
            // remove trailing last array properties
            await this.removeLastItemProperties(
                joinSelectors(arraySelector, String(nbItems - 1)),
            );
            await emitEvents();
            return;
        }

        // otherwise rename higher indexes properties
        for (let i = index; i < data.length; i++) {
            const oldSelectorIndex = joinSelectors(
                arraySelector,
                String(i + 1),
            );
            const oldSelectorChildren = this.form.childrenProps(
                oldSelectorIndex,
                true,
            );

            for (const sel of Object.keys(oldSelectorChildren)) {
                const prop = this.form.props[sel];
                this.form.events.offSelector(sel);
                await this.form.deleteProp(sel);

                prop.renameSelector(
                    sel.replace(
                        oldSelectorIndex,
                        joinSelectors(arraySelector, String(i)),
                    ),
                );

                await this.form.addProp(prop);

                const selectorsValidators = parseSelectorsEventsValidators(
                    {
                        [prop.selector]: prop,
                    },
                    getParentSelector(prop.selector),
                );
                await this.form.events.registerSelectorsValidators(
                    selectorsValidators,
                );
            }
        }

        // remove trailing last array properties
        await this.removeLastItemProperties(
            joinSelectors(arraySelector, String(nbItems - 1)),
        );

        // move data
        for (let i = index + 1; i < data.length; i++) {
            const oldSelectorIndex = joinSelectors(arraySelector, String(i));
            const newSelectorIndex = joinSelectors(
                arraySelector,
                String(i - 1),
            );
            this.form.dataSelector.set(
                newSelectorIndex,
                this.form.$d(oldSelectorIndex),
            );
        }

        await emitEvents();
    }

    private getProperty(
        arraySelector: string,
    ): FormProperty<SchemaArrayProperty> {
        const prop = this.form.prop<SchemaArrayProperty>(arraySelector);
        if (!prop || prop.type !== PropertyType.Array) {
            throw new Error(`Selector ${arraySelector} is not an array`);
        }
        return prop;
    }

    private async removeLastItemProperties(
        lastItemSelector: string,
    ): Promise<void> {
        const lastPropChildren = Object.keys(
            this.form.childrenProps(lastItemSelector, true),
        );
        for (const sel of lastPropChildren) {
            await this.form.deleteProp(sel);
            this.form.events.offSelector(sel);
        }
    }
}
