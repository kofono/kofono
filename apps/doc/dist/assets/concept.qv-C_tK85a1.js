import{C as e,c as t,h as n,v as r}from"./solid-PDEAyDJe.js";import{c as i}from"./index-CCIeqi_q.js";import{_ as a,d as o,o as s,s as c}from"./header-OMq71_xT.js";import{t as l}from"./code-block-D99bFrET.js";import{t as u}from"./code-tabs-PWg1U9KT.js";import{t as d}from"./doc-layout-CNMGRyj1.js";var f=n(`<p>Qualifications and validations are two core concepts in Kofono. They work hand in hand to control what a user can interact with and to verify that the data provided is correct.`),p=n(`<p>A <i>qualification</i> determines whether a user is able to see or answer a property, or a group of properties. In other words, it tells if a property is relevant in the current context of the form.`),m=n(`<p>A property that is <i>disqualified</i> is always considered invalid. This rule is important to keep in mind: qualification comes first, validation comes after.`),h=n(`<p>A <i>validation</i> checks if the data of a property is valid or not. It ensures that the value provided by the user matches the expected rules (e.g. required, valid email, between a min and max, etc.).`),g=n(`<ul>`),_=n(`<li>`),v={overview:`Overview`,qualifications:`Qualifications`,validations:`Validations`,validators:`Validators`},y=`
const form = await K.form({
    __: {
        foo: {
            type: "boolean",
            $v: ["required"],
        },
        bar: {
            type: "string",
            $q: [{ isValid: "foo" }],
        },
    },
})`,b=`
const form = await K.form({
    foo: K.boolean(required()),
    bar: K.string().qualifications(isValid("foo")),
}`;function x(){let n=a.map(e=>e.name);return n.sort(),e(d,{meta:i,onThisPage:v,get children(){return[e(s,{children:`Qualifications and Validations`}),e(c,{get id(){return`overview`},children:`Overview`}),f(),e(o,{}),e(c,{get id(){return`qualifications`},children:`Qualifications`}),p(),m(),e(u,{get tabs(){return[{label:`JSON Schema`,content:e(l,{copyable:!0,value:y})},{active:!0,label:`Typescript Builder`,content:e(l,{copyable:!0,value:b})}]}}),e(o,{}),e(c,{get id(){return`validations`},children:`Validations`}),h(),e(o,{}),e(c,{get id(){return`validators`},children:`Validators`}),(()=>{var i=g();return t(i,e(r,{each:n,children:(e,n)=>(()=>{var n=_();return t(n,e),n})()})),i})()]}})}export{x as default,v as onThisPage};