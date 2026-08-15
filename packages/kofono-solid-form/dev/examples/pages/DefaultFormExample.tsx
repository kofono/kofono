import { K, max, min, notEmpty } from "kofono";
import type { CheckboxComponent } from "@/components/checkbox";
import type { CheckboxGroupComponent } from "@/components/checkboxGroup";
import { textInput } from "@/components/input";
import { C } from "@/components/PropElement";
import type { RadioGroupComponent } from "@/components/radioGroup";
import type { BasicSchemaComponent } from "@/components/types";
import { ExamplePage } from "../ExamplePage";

export function DefaultFormExample() {
    return (
        <ExamplePage
            schema={schema}
            submit={() => console.log("Form submitted")}
            cancel={() => console.log("Form cancelled")}
            beforeForm={
                <div class="p-4">
                    <h2 class="text-lg font-bold"> Hello Form!</h2>
                    <p>
                        This is a simple example form demonstrating various
                        input components and schema features.
                    </p>
                </div>
            }
            afterForm={
                <div class="p-4">
                    <h2 class="text-lg font-bold"> Additional Content</h2>
                    <p>
                        This is some additional content that can be rendered
                        alongside the form.
                    </p>
                </div>
            }
        />
    );
}

const description =
    "This is a description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export const schema = K.schema({
    textInput: K.string(min(3, "should be at least 3 characters or more"))
        .default("Hello!")
        .component(
            textInput({
                title: "Text Input",
                subTitle: "This is a subtitle",
                description: description,
                placeholder: "write something",
                grid: {
                    default: 12,
                    sm: 6,
                    lg: 6,
                    xl: 6,
                },
            }),
        ),

    textarea: K.string(notEmpty()).component({
        type: C.Textarea,
        title: "Textarea",
        subTitle: "This is a subtitle",
        description: description,
        placeholder: "This is a placeholder",
        grid: {
            default: 12,
            sm: 6,
            lg: 6,
            xl: 6,
        },
    }),

    checkboxAndRadio: K.object({
        checkbox: K.boolean()
            .default(true)
            .component<CheckboxComponent>({
                type: C.Checkbox,
                title: "Single Checkbox",
                label: "Checkbox label",
                description: description,
                disqualificationBehavior: "disable",
                grid: {
                    default: 12,
                    sm: 12,
                    lg: 4,
                    xl: 4,
                },
            }),

        checkboxGroup: K.listNumber()
            .enum([
                { value: 1, label: "checkbox label choice 1" },
                { value: 2, label: "checkbox label choice 2" },
                { value: 3, label: "checkbox label choice 3" },
            ])
            .default([2])
            .component<CheckboxGroupComponent>({
                type: C.CheckboxGroup,
                title: "Checkbox Group",
                direction: "col",
                grid: {
                    default: 12,
                    sm: 12,
                    lg: 4,
                    xl: 4,
                },
            }),

        radioGroup: K.string()
            .enum([
                { value: 1, label: "radio choice label 1" },
                { value: 2, label: "radio choice label 2" },
                { value: 3, label: "radio choice label 3" },
            ])
            .component<RadioGroupComponent>({
                type: C.RadioGroup,
                title: "Radio Group",
                direction: "col",
                grid: {
                    default: 12,
                    sm: 12,
                    lg: 4,
                    xl: 4,
                },
            }),
    }).component<BasicSchemaComponent>({
        grid: 12,
        legend: "Checkboxes & Radios",
    }),

    selects: K.object({
        select: K.string()
            .enum([
                { value: "1", label: "choice label 1" },
                { value: "2", label: "choice label 2" },
            ])
            .component({
                type: C.Select,
                title: "Select question",
                placeholder: "Select something...",
                grid: 6,
            }),
        dropdown: K.string()
            .enum([
                { value: "1", label: "choice label 1" },
                { value: "2", label: "choice label 2" },
                { value: "3", label: "choice label 3" },
            ])
            .component({
                type: C.Dropdown,
                title: "Dropdown",
                placeholder: "Select something...",
                grid: 6,
            }),
    }).component<BasicSchemaComponent>({
        grid: 12,
    }),

    range: K.number(min(10), max(125)).default(0).component({
        type: C.RangeInput,
        title: "RangeInput",
        label: "RangeInput label",
        description: description,
        grid: 6,
    }),

    files: K.listMixed().component({
        type: C.FileInput,
        title: "FileInput",
        multiple: true,
        label: "",
        grid: 6,
    }),
});
