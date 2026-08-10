import{C as e,c as t,h as n}from"./solid-PDEAyDJe.js";import{a as r,d as i,o as a}from"./header-OMq71_xT.js";import{t as o}from"./code-block-D99bFrET.js";import{t as s}from"./code-tabs-PWg1U9KT.js";import{t as c}from"./doc-layout-CNMGRyj1.js";var l=n(`<p>At is root, Kofono is a schema based validation library. You define your form schema with a JSON schema like syntax or use Typescript fluent syntax. One difference from JSON schema is that <!> are named<!> for brevity and readability.`),u=n(`<p>A schema is composed of a set of properties, each of which has a type and optional metadata.`);function d(){return e(c,{get children(){return[e(a,{children:`Schema Basics`}),(()=>{var n=l(),i=n.firstChild.nextSibling,a=i.nextSibling.nextSibling;return a.nextSibling,t(n,e(r,{children:`properties`}),i),t(n,e(r,{children:`__`}),a),n})(),u(),e(i,{}),`Example:`,e(s,{get tabs(){return[{label:`JSON Schema`,active:!0,content:e(o,{value:`import { Schema } from "kofono";

const schema: Schema = {
    $id: "my-form",
    __: {
        propA: { 
            type: "string" 
        },
    }
}`})},{label:`Typescript Builder`,content:e(o,{value:`import { S } from "kofono";

const schema = K.schema({
    $id: "my-form",
    propA: K.string(),
}`})}]}}),e(i,{})]}})}export{d as default};