import{C as e,c as t,h as n}from"./solid-PDEAyDJe.js";import{o as r}from"./index-ByiJAM5Z.js";import{a as i,d as a,o,u as s}from"./header-CzRcQSua.js";import{t as c}from"./code-block-hNaDGfl1.js";import{t as l}from"./code-tabs-BDIbq5Oc.js";import{t as u}from"./doc-layout-CcmFU8dS.js";var d=n(`<p>So lets create your first schema. We have two choices:`),f=n(`<li>Use JSON syntax`),p=n(`<li>Use Kofono <!> builder`),m=n(`<p>Through the documentation, you will see both syntax, but generally, we recommend using the Kofono <!> builder as it offers a more intuitive and concise way to define schemas. It has also the benefit of being computed to a JSON schema with <!>. `),h=n(`<p>This is a basic example of a schema. It defines a form with id "my-form" and with three fields(aka properties): <br>, <!>, and <!>.`),g=n(`<p>By essence, the schema represent a way to describe your form structure, validations and business logics. It can be stored in database or in file easily.`),_=n(`<p>In this example,<!> and <!> must be a string of max 255 characters and at least one character. <br> must be a valid email address string.`),v=n(`<p>To actually use the schema, you will need to create a form instance. This is where the magic happens.`);function y(){return e(u,{meta:r,get children(){return[e(o,{children:`Create your first schema`}),d(),e(s,{get children(){return[f(),(()=>{var n=p(),r=n.firstChild.nextSibling;return r.nextSibling,t(n,e(i,{children:`K`}),r),n})()]}}),(()=>{var n=m(),r=n.firstChild.nextSibling,a=r.nextSibling.nextSibling;return a.nextSibling,t(n,e(i,{children:`K`}),r),t(n,e(i,{children:`K.schema()`}),a),n})(),e(a,{}),e(l,{get tabs(){return[{label:`JSON Schema`,content:e(c,{value:`import { Schema } from "kofono"

export const intro: Schema = {
    $id: "my-form",
    __: {
        firstName: {
            type: "string",
            $v: [{ between:{ min: 1, max: 255 }],
        },
        lastName: {
            type: "string",
            $v: [{ between:{ min: 1, max: 255 }],
        },
        mainContact: {
            type: "string",
            $v: ["email"],
        }
    },
};`}),active:!0},{label:`Typescript Builder`,content:e(c,{value:`import { K, between, email } from "kofono";

export const schema = K.schema({
    $id: "my-form",
    firstName: K.string(between(1, 255)),
    lastName: K.string(between(1, 255)),
    mainContact: K.string(email()),
}`})}]}}),(()=>{var n=h(),r=n.firstChild.nextSibling.nextSibling,a=r.nextSibling,o=a.nextSibling.nextSibling;return o.nextSibling,t(n,e(i,{children:`firstName`}),r),t(n,e(i,{children:`lastName`}),a),t(n,e(i,{children:`mainContact`}),o),n})(),g(),(()=>{var n=_(),r=n.firstChild.nextSibling,a=r.nextSibling.nextSibling,o=a.nextSibling.nextSibling.nextSibling;return t(n,e(i,{children:`firstName`}),r),t(n,e(i,{children:`lastName`}),a),t(n,e(i,{children:`mainContact`}),o),n})(),v()]}})}export{y as default};