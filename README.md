# Kofono

[![npm version](https://img.shields.io/npm/v/kofono.svg)](https://www.npmjs.com/package/kofono)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](LICENSE)

Kofono is a headless schema-based form engine. It provides
a robust system for building, validating, and managing complex forms with
conditional logic or custom logic.

It can be run in any JavaScript environment, including Node.js and browsers, and
is designed to work seamlessly with modern frameworks like React, Vue, SolidJS, and more.

```typescript
import { between, email, K, min, required } from "kofono";

const form = await K.form({
    firstName: K.string(required()),
    middleName: K.string(),
    lastName: K.string(required()),
    email: K.string(email()),
    quantity: K.number(between(1, 30, "Select a quantity between 1 and 30")),
    address: K.object({
        street: K.string(required()),
        city: K.string(required()).enum([
            "Montréal",
            "Québec City",
            "Laval",
            "Gatineau",
            "Longueuil",
            "Sherbrooke",
            "Lévis",
            "Saguenay",
            "Trois-Rivières",
            "Terrebonne",
        ]),
        zipCode: K.string(min(6), max(7)),
    }),
    sameAddressForBilling: K.boolean().default(false),
    billingAddress: K.object({
        street: K.string(required()),
        city: K.string(required()),
        zipCode: K.string(min(6), max(7)),
    }).qualifications(when("sameAddressForBilling").isFalse()),
    acceptTerms: K.boolean(isTrue()).default(false),
    otherNotes: K.string(),
});
```
