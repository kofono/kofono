import{C as e,c as t,h as n}from"./solid-PDEAyDJe.js";import{a as r,d as i,o as a,p as o,s}from"./header-CzRcQSua.js";import{t as c}from"./code-block-hNaDGfl1.js";import{t as l}from"./code-tabs-BDIbq5Oc.js";import{t as u}from"./doc-layout-CcmFU8dS.js";var d=n(`<p>Properties are the bread and butter of your schema. They define the structure of your form data. Each property has a type and optional metadata. Some types are answerable, meaning they can be answered by the user, while others act as container for nested properties.`),f=n(`<p>Kofono supports the following property types:`),p=n(`<p class=pl-4><i>Leaf</i>: A property that cannot contain other properties.<br><i>Node</i>: A property that can contain other properties.<br><i>Answerable</i>: A property that can be answered by the user.`),m=n(`<p>Category: <!> `),h=n(`<p>These types are pretty straightforward. Ideal for input, textarea, single checkbox, radio group, select, etc.`),g=n(`<p>An object type is a collection of properties. It can be nested inside other object types. Objects act as containers for other properties and cannot be answered directly.`),_=n(`<p>Lists represent a collection of values of a specific type. They can be used to store multiple values of the same type. They are ideal for checkboxes, radio buttons, select or other fields that allow multiple selections. If the type is dynamic, you can use the mixed type to store any value.`),v=n(`<p>An array type is a special type that allows you to store multiple values of the same type. It is a non-answerable because you can't answer it directly, only each item in the array can be answered.`),y=n(`<p>Ideal for repeatable fields like addresses or tags. Arrays can be nested inside other array types to create complex data structures. Use <!> to specify shape of the array items.`),b=n(`<p>`),x=n(`<p>The null type is a special type that represents the absence of a value. It is non-answerable because you cannot directly answer it. Some form renderer need this for displaying stuff between properties.`),S=n(`<tr><th>type</th><th>answerable</th><th>tree type`),C=n(`<tr><td><code>string</code></td><td>Yes</td><td>Leaf`),w=n(`<tr><td><code>number</code></td><td>Yes</td><td>Leaf`),T=n(`<tr><td><code>boolean</code></td><td>Yes</td><td>Leaf`),E=n(`<tr><td><code>list&lt;string&gt;</code></td><td>Yes</td><td>Leaf`),D=n(`<tr><td><code>list&lt;number&gt;</code></td><td>Yes</td><td>Leaf`),O=n(`<tr><td><code>list&lt;boolean&gt;</code></td><td>Yes</td><td>Leaf`),k=n(`<tr><td><code>list&lt;mixed&gt;</code></td><td>Yes</td><td>Leaf`),A=n(`<tr><td><code>array</code></td><td>No</td><td>Node`),j=n(`<tr><td><code>object</code></td><td>No</td><td>Node`),M=n(`<tr><td><code>null</code></td><td>No</td><td>Leaf`),N=`const schema = {
    __: {
        propA: { 
            type: "object",
            __: {
                subProp: {
                    type: "string",
                }
            } 
        }
    }
}`,P=`const schema = K.schema({
    propA: K.object({
        subProp: K.string()
    })
}`,F=`const schema = {
    __: {
        propA: { 
            type: "string" 
        },
        propB: { 
            type: "number"
        },
        propC: { 
            type: "boolean"
        }
    }
}`;function I(){return e(u,{get children(){return[e(a,{children:`Properties`}),d(),f(),e(o,{get head(){return S()},get body(){return[C(),w(),T(),E(),D(),O(),k(),A(),j(),M()]}}),p(),e(i,{}),e(a,{children:`String, Boolean, Number types`}),(()=>{var n=m(),i=n.firstChild.nextSibling;return i.nextSibling,t(n,e(r,{children:`Leaf`}),i),t(n,e(r,{children:`Answerable`}),null),n})(),h(),e(l,{get tabs(){return[{label:`JSON Schema`,content:e(c,{value:F,height:`280px`}),active:!0},{label:`Typescript Builder`,content:e(c,{value:P,height:`100px`})}]}}),e(i,{}),e(a,{children:`Object type`}),(()=>{var n=m(),i=n.firstChild.nextSibling;return i.nextSibling,t(n,e(r,{children:`Node`}),i),t(n,e(r,{children:`Non-Answerable`}),null),n})(),g(),e(l,{get tabs(){return[{label:`JSON Schema`,content:e(c,{value:N,height:`260px`}),active:!0},{label:`Typescript Builder`,content:e(c,{height:`220px`,value:`const schema = K.schema({
    address: K.object({
        street: K.string(),
        city: K.string(),
        location: K.object({ 
            lat: K.number(), 
            lng: K.number() 
        }),
    }),
});`})}]}}),e(i,{}),e(a,{children:`List types`}),e(s,{children:`list<string>, list<number>, list<boolean>, list<mixed>`}),(()=>{var n=m(),i=n.firstChild.nextSibling;return i.nextSibling,t(n,e(r,{children:`Leaf`}),i),t(n,e(r,{children:`Answerable`}),null),n})(),_(),e(l,{get tabs(){return[{label:`JSON Schema`,content:e(c,{height:`180px`,value:`const schema = {
    __: {
        s: { type: "list<string>" },
        n: { type: "list<number>" },
        b: { type: "list<boolean>" },
        m: { type: "list<mixed>" }
    }
}`}),active:!0},{label:`Typescript Builder`,content:e(c,{height:`140px`,value:`const schema = K.schema({
    s: K.listString(),
    n: K.listNumber(),
    b: K.listBoolean(),
    m: K.listMixed(),
});`})}]}}),e(i,{}),e(a,{children:`Array type`}),(()=>{var n=m(),i=n.firstChild.nextSibling;return i.nextSibling,t(n,e(r,{children:`Node`}),i),t(n,e(r,{children:`Non-Answerable`}),null),n})(),v(),(()=>{var n=y(),i=n.firstChild.nextSibling;return i.nextSibling,t(n,e(r,{children:`items`}),i),n})(),(()=>{var n=b();return t(n,e(l,{get tabs(){return[{label:`JSON Schema`,content:e(c,{height:`300px`,value:`const schema = {
    __: {
        persons: { 
            type: "array",
            items: {
                type: "object",
                __: {
                    name: { type: "string" },
                    age: { type: "number" }
                }
            }
        }
    }
}`}),active:!0},{label:`Typescript Builder`,content:e(c,{height:`180px`,value:`const schema = K.schema({
    persons: K.array(
        K.object({
            name: K.string(),
            age: K.number(),
        }),
    ),
});`})}]}})),n})(),e(i,{}),e(a,{children:`Null type`}),(()=>{var n=m(),i=n.firstChild.nextSibling;return i.nextSibling,t(n,e(r,{children:`Leaf`}),i),t(n,e(r,{children:`Non-Answerable`}),null),n})(),x(),e(l,{get tabs(){return[{label:`JSON Schema`,content:e(c,{height:`160px`,value:`const schema = {
    __: {
        intro: { 
            type: "null",
        }
    }
}`}),active:!0},{label:`Typescript Builder`,content:e(c,{height:`80px`,value:`const schema = K.schema({
    intro: K.null(),
});`})}]}})]}})}export{I as default};