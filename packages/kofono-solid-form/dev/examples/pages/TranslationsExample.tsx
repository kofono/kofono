import { alpha, equal, K, min, type Schema } from "kofono";
import { C } from "@/components/PropElement";
import { ExamplePage } from "../ExamplePage";

const translations = {
    en: {
        firstname: {
            title: "Firstname",
            placeholder: "Enter your first name",
            error: "We really need your first name sir!",
        },
        lastname: {
            title: "Lastname",
            placeholder: "Enter your last name",
            emptyError: "We also really need your last name sir!",
            alphaError:
                "We really want only letters in your last name sir and no spaces!",
        },
        consent: {
            title: "Consent",
            label: "I agree to the terms and conditions *",
            description:
                "* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
    },
    fr: {
        VALUE_IS_EMPTY: "FRANCAIS!",
        firstname: {
            title: "Prénom",
            placeholder: "Entrez votre prénom",
            error: "Nous avons vraiment besoin de votre prénom!",
        },
        lastname: {
            title: "Nom de famille",
            placeholder: "Entrez votre nom de famille",
            emptyError: "Nous avons aussi besoin de votre nom de famille!",
            alphaError:
                "Nous voulons vraiment seulement des lettres dans votre nom de famille et pas d'espaces!",
        },
        consent: {
            title: "Consentement",
            label: "J'accepte les termes et conditions",
            description:
                "* Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        },
    },
};

const schema: Schema = K.schema({
    $id: "translations-example",
    firstname: K.string(min(1, "firstname.error")).component({
        type: C.Input,
        title: "firstname.title",
        placeholder: "firstname.placeholder",
    }),
    lastname: K.string(
        alpha({ spaces: false }, "lastname.alphaError"),
        min(1, "lastname.emptyError"),
    ).component({
        type: C.Input,
        title: "lastname.title",
        placeholder: "lastname.placeholder",
    }),
    consent: K.boolean(equal(true)).component({
        type: C.Checkbox,
        title: "consent.title",
        label: "consent.label",
        description: "consent.description",
        grid: 12,
    }),
    $translations: translations,
});

export function TranslationsExample() {
    return (
        <ExamplePage
            schema={schema}
            submit={_ => {
                // sleep for 2 sec
                return new Promise(resolve => setTimeout(resolve, 2000));
            }}
        />
    );
}
