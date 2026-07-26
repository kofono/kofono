import { answerablePropertyTypes } from "../property/categories";
import { TreeType } from "../property/types";
import type { Form } from "./Form";

// deprecated
export class FormSelectors {
    public constructor(private form: Form) {}

    public getLeaf(): string[] {
        const selectors: string[] = [];
        for (const selector of this.form.propsKeys()) {
            if (this.form.rawProp(selector).treeType === TreeType.Leaf) {
                selectors.push(selector);
            }
        }
        return selectors;
    }

    public getAnswerable(): string[] {
        const selectors: string[] = [];
        for (const selector of this.form.propsKeys()) {
            if (
                answerablePropertyTypes.includes(
                    this.form.rawProp(selector).type,
                )
            ) {
                selectors.push(selector);
            }
        }
        return selectors;
    }
}
