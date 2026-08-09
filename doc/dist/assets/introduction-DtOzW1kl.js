import{C as e,c as t,h as n}from"./solid-PDEAyDJe.js";import{r}from"./index-ByiJAM5Z.js";import{d as i,f as a,o}from"./header-CzRcQSua.js";import{t as s}from"./code-block-hNaDGfl1.js";import{t as c}from"./code-tabs-BDIbq5Oc.js";import{t as l}from"./doc-layout-CcmFU8dS.js";var u=n(`<p>Kofono is a <!> for TypeScript. You define forms with a schema-first approach. This let you validate them frontend/backend without duplicating logic.`),d=n(`<p>Forms are essential and often fragile. Kofono centralizes structure, validation, and types so your forms stay predictable and maintainable as requirements grow.`),f=n(`<ul class="list-disc pl-5 flex flex-col gap-3"><li>: describe your data once and get end-to-end type safety.</li><li>: conditionals, nested objects/arrays, dynamic defaults, and more.</li><li>: reuse the same schema for UI rendering, server validation, and tests.</li><li>: built-in rules plus custom validators you control.</li><li>: bring your own UI (React, Vue, Svelte, vanilla) or render on the server.</li><li>: compose plugins, validators, and custom renderers without forking the core.`);function p(){return e(l,{meta:r,get children(){return[e(o,{class:`font-bold text-4xl`,children:`Kofono documentation`}),e(o,{children:`What is Kofono?`}),(()=>{var n=u(),r=n.firstChild.nextSibling;return r.nextSibling,t(n,e(a,{children:`headless form engine`}),r),n})(),e(c,{get tabs(){return[{label:`JSON Schema`,content:e(s,{height:`750px`,value:`export const intro: Schema = {
    $id: "my-form",
    __: {
        name: {
            type: "string",
            $v: ["required"],
        },
        product: {
            type: "string",
            $v: ["required"],
            enum: ["product1", "product2", "product3"],
        },
        dimension: {
            type: "object",
            __: {
                width: {
                    type: "number",
                    $v: [{ min: 1 }],
                },
                height: {
                    type: "number",
                    $v: [{ min: 1 }],
                },
            },
        },
        quantity: {
            type: "number",
            $v: [{ min: 5 }, { max: 20 }],
            default: 5,
        },
        consent: {
            type: "boolean",
            $v: ["isTrue"],
            default: false,
        },
    },
};`}),active:!0},{label:`Typescript Builder`,content:e(s,{height:`225px`,value:`const schema = K.schema({
    $id: "my-form",
    name: K.string(required()),
    product: K.string(required()).enum(["product1", "product2", "product3"]),
    dimension: K.object({
        width: K.number(min(1)),
        height: K.number(min(1)),
    }),
    quantity: K.number(min(5), max(20)).default(5),
    consent: K.boolean(required()).default(false),
}`})}]}}),e(i,{}),e(o,{children:`Why Kofono`}),d(),(()=>{var n=f(),r=n.firstChild,i=r.firstChild,o=r.nextSibling,s=o.firstChild,c=o.nextSibling,l=c.firstChild,u=c.nextSibling,d=u.firstChild,p=u.nextSibling,m=p.firstChild,h=p.nextSibling,g=h.firstChild;return t(r,e(a,{children:`Strongly typed schemas`}),i),t(o,e(a,{children:`Complex flows`}),s),t(c,e(a,{children:`Single source of truth`}),l),t(u,e(a,{children:`Validation engine`}),d),t(p,e(a,{children:`Headless`}),m),t(h,e(a,{children:`Extensible`}),g),n})(),e(i,{})]}})}export{p as default};