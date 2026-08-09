import{C as e,c as t,h as n}from"./solid-PDEAyDJe.js";import{s as r}from"./index-ByiJAM5Z.js";import{a as i,d as a,o,s}from"./header-CzRcQSua.js";import{n as c,t as l}from"./code-block-hNaDGfl1.js";import{t as u}from"./code-tabs-BDIbq5Oc.js";import{t as d}from"./doc-layout-CcmFU8dS.js";var f=n(`<p>Let's create our first form with Kofono by reusing the schema we created in the previous section. But instead of using <!>, we will use <!>.`),p=n(`<p>A form instance allows us to interact with the form data in real-time.`),m=n(`<p>Once the form is created, you can interact with it by accessing its properties and updating its data.`),h={"create-your-schema":`Create your schema`,"update-a-property":`Update a property`,"access-to-property-infos":`Access to property infos`,"validate-the-form":`Validate the form`,"access-to-the-form-state":`Access to the form state`};function g(){return e(d,{meta:r,onThisPage:h,get children(){return[e(o,{get id(){return`create-your-schema`},children:`Create you first form`}),e(a,{}),(()=>{var n=f(),r=n.firstChild.nextSibling,a=r.nextSibling.nextSibling;return a.nextSibling,t(n,e(i,{children:`K.schema()`}),r),t(n,e(i,{children:`K.form()`}),a),n})(),p(),e(u,{get tabs(){return[{label:`JSON Schema`,content:e(l,{copyable:!0,value:`import { K } from "kofono"

const form = await K.form({
    $id: "my-form",
    __: {
        firstName: {
            type: "string",
            $v: ["required", { max: 255 }],
        },
        lastName: {
            type: "string",
            $v: ["required", { max: 255 }],
        },
        mainContact: {
            type: "string",
            $v: ["email"],
        }
    },
};`})},{active:!0,label:`Typescript Builder`,content:e(l,{copyable:!0,value:`import { K, required, max } from "kofono";

const form = await K.form({
    $id: "my-form",
    firstName: K.string(required(), max(255)),
    lastName: K.string(required(), max(255)),
    mainContact: K.string(email()),
}`})}]}}),m(),e(a,{}),e(s,{get id(){return`update-a-property`},children:`Update a property`}),e(c,{class:`p-0`,value:`await form.update("firstName", "John");`}),e(a,{}),e(s,{get id(){return`access-to-property-infos`},children:`Access to property informations`}),e(c,{class:`p-0`,value:`const firstName = form.prop("firstName");
firstName.isValid();
firstName.isQualified();
firstName.value;
firstName.validationError;
//...
`}),e(a,{}),e(s,{get id(){return`validate-the-form`},children:`Validate the form`}),e(c,{class:`p-0`,value:`if (form.pass()) {
    //...
} else {
    console.log(form.errors());
}`}),e(a,{}),e(s,{get id(){return`access-to-the-form-state`},children:`Access to the form state`}),e(c,{class:`p-0`,value:`console.log(form.state);
/*
{
    sessionId: '69f9353f-81c1-4af0-b762-c810529cfbad',
    data: { firstName: 'John', lastName: null, mainContact: null },
    stats: {
        qualified: 3,
        valid: 1,
        invalid: 2,
        progression: 33.33333333333333,
        node: 0,
        leaf: 3
    },
    meta: { hasBeenUpdated: [ 'firstName' ], extensions: [] },
    pass: [ false, '_FORM_NOT_COMPLETE' ],
    qualifications: {
        firstName: [ true, '' ],
        lastName: [ true, '' ],
        mainContact: [ true, '' ]
    },
    validations: {
        firstName: [ true, '' ],
        lastName: [ false, '_REQUIRED_IS_REQUIRED' ],
        mainContact: [ false, '_EMAIL_INVALID_TYPE' ]
    }
}
*/`})]}})}export{g as default};