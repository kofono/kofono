import { builtinValidators } from "kofono";
import { For } from "solid-js";
import { H1, H2, Spacer } from "@/components/html";
import { ConceptQv } from "@/doc/concept.qv.meta";
import { DocLayout } from "@/layouts/doc-layout";

enum Anchor {
    Overview = "overview",
    Qualifications = "qualifications",
    Validations = "validations",
    Validators = "validators",
}

export const onThisPage = {
    [Anchor.Overview]: "Overview",
    [Anchor.Qualifications]: "Qualifications",
    [Anchor.Validations]: "Validations",
    [Anchor.Validators]: "Validators",
};

export default function () {
    const listItems = builtinValidators.map(validator => validator.name);
    listItems.sort();

    return (
        <DocLayout meta={ConceptQv} onThisPage={onThisPage}>
            <H1>Qualifications and Validations</H1>
            <H2 id={Anchor.Overview}>Overview</H2>
            <p>
                Qualifications and validations are two core concepts in Kofono. They work hand in hand to control what a
                user can interact with and to verify that the data provided is correct.
            </p>
            <Spacer />
            <H2 id={Anchor.Qualifications}>Qualifications</H2>
            <p>
                A <i>qualification</i> determines whether a user is able to see or answer a property, or a group of
                properties. In other words, it tells if a property is relevant in the current context of the form.
            </p>
            <p>
                A property that is <i>disqualified</i> is always considered invalid. This rule is important to keep in
                mind: qualification comes first, validation comes after.
            </p>
            <Spacer />
            <H2 id={Anchor.Validations}>Validations</H2>
            <p>
                A <i>validation</i> checks if the data of a property is valid or not. It ensures that the value provided
                by the user matches the expected rules (e.g. required, valid email, between a min and max, etc.).
            </p>
            <Spacer />
            <H2 id={Anchor.Validators}>Validators</H2>
            <ul>
                <For each={listItems}>{(validator, _) => <li>{validator}</li>}</For>
            </ul>
        </DocLayout>
    );
}
