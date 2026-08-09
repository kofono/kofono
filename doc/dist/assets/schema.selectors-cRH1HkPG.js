import{C as e,h as t}from"./solid-PDEAyDJe.js";import{_ as n}from"./vendor-DWLxfED5.js";import{i as r}from"./index-ByiJAM5Z.js";import{o as i}from"./header-CzRcQSua.js";import{t as a}from"./code-block-hNaDGfl1.js";import{t as o}from"./doc-layout-CcmFU8dS.js";var s=t(`<p>Selector are important concept and they are used in many way. Each property have a selector assigned to it that can be used as reference to this property. Just remember that selectors are automatically generated based from position in the schema using dot notation.`),c=t(`<p>Selectors will become handy later with validation and qualifications and form instance:`),l=t(`<ul><li><code>address.street</code></li><li><code>address.city</code></li><li><code>address.location.lat</code></li><li><code>address.location.lng`);function u(){return e(o,{get children(){return[e(n,{get children(){return r.title}}),e(i,{children:`Selectors`}),s(),c(),e(a,{height:`380px`,value:`const schema: Schema = {
    __: {
        address: {
            type: "object",
            __: {
                street: { type: "string" },
                city: { type: "string" },
                location: {
                    type: "object",
                    __: {
                        lat: { type: "number" },
                        lng: { type: "number" }
                    }
                }
            }
        }
    }            
}`}),`Here the selectors of answerable properties of the example above:`,l()]}})}export{u as default};