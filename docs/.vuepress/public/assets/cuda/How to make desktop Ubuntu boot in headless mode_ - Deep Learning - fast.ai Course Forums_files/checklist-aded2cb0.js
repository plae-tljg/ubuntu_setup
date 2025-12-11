define("discourse/plugins/checklist/discourse/initializers/checklist",["exports","discourse/lib/ajax","discourse/lib/ajax-error","discourse/lib/deprecated","discourse/lib/get-owner","discourse/lib/icon-library","discourse/lib/plugin-api","discourse-i18n","discourse/plugins/checklist/lib/rich-editor-extension"],function(e,t,c,n,s,i,a,r,o){"use strict"
function l(e){return 3===e.nodeType&&e.nodeValue.match(/^\s*$/)}function d(e){e.forEach(e=>{let t=e.parentElement
"P"===t.nodeName&&t.parentElement.firstElementChild===t&&(t=t.parentElement),"LI"!==t.nodeName||"UL"!==t.parentElement.nodeName||function(e){let t=e.previousSibling
for(;t;){if(!l(t))return!0
t=t.previousSibling}return!1}(e)||(t.classList.add("has-checkbox"),e.classList.add("list-item-checkbox"),e.nextSibling||e.insertAdjacentHTML("afterend","&#8203;"))})}function u(e,a){const o=[...e.getElementsByClassName("chcklst-box")]
d(o)
const l=a?.getModel(),u=(0,n.withSilencedDeprecations)("discourse.post-stream-widget-overrides",()=>(0,s.getOwnerWithFallback)(this).lookup("service:site").useGlimmerPostStream?null:a?.widget)
l?.can_edit&&o.forEach((e,n)=>{e.onclick=async e=>{const s=e.currentTarget,a=s.classList
if(a.contains("permanent")||a.contains("readonly"))return
const d=a.contains("checked")?"[ ]":"[x]",h=document.createElement("template")
h.innerHTML=(0,i.iconHTML)("spinner",{class:"fa-spin list-item-checkbox"}),s.insertAdjacentElement("afterend",h.content.firstChild),s.classList.add("hidden"),o.forEach(e=>e.classList.add("readonly"))
try{const e=await(0,t.ajax)(`/posts/${l.id}`),c=[];[/`[^`\n]*\n?[^`\n]*`/gm,/^```[^]*?^```/gm,/\[code\][^]*?\[\/code\]/gm,/_(?=\S).*?\S_/gm,/~~(?=\S).*?\S~~/gm].forEach(t=>{let n
for(;null!=(n=t.exec(e.raw));)c.push([n.index,n.index+n[0].length])}),[/([^\[\n]|^)\*\S.+?\S\*(?=[^\]\n]|$)/gm].forEach(t=>{let n
for(;null!=(n=t.exec(e.raw));)c.push([n.index+1,n.index+n[0].length])})
let s=-1,i=!1
const a=e.raw.replace(/\[( |x)?\]/gi,(t,a,r)=>i||r>0&&"!"===e.raw[r-1]?t:(s+=c.every(e=>e[0]>=r+t.length||r>e[1]),s===n?(i=!0,d):t))
await l.save({raw:a,edit_reason:(0,r.i18n)("checklist.edit_reason")}),u&&(u.attrs.isSaving=!1,u.scheduleRerender())}catch(f){(0,c.popupAjaxError)(f)}finally{o.forEach(e=>e.classList.remove("readonly")),s.classList.remove("hidden"),s.parentElement.querySelector(".fa-spin").remove()}}})}Object.defineProperty(e,"__esModule",{value:!0}),e.checklistSyntax=u,e.default=void 0
e.default={name:"checklist",initialize(){(0,a.withPluginApi)(e=>function(e){e.container.lookup("service:site-settings").checklist_enabled&&(e.decorateCookedElement(u),e.registerRichEditorExtension(o.default))}(e))}}}),define("discourse/plugins/checklist/lib/discourse-markdown/checklist",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.setup=function(e){e.registerOptions((e,t)=>{e.features.checklist=!!t.checklist_enabled}),e.allowList(["span.chcklst-stroked","span.chcklst-box fa fa-square-o fa-fw","span.chcklst-box checked fa fa-square-check-o fa-fw","span.chcklst-box checked permanent fa fa-square-check fa-fw"]),e.registerPlugin(e=>e.core.ruler.push("checklist",s))}
const t=/\[( |x)?\]/gi
function c(e,t,c,n){const s=function(e){switch(e){case"x":return"checked fa fa-square-check-o fa-fw"
case"X":return"checked permanent fa fa-square-check fa-fw"
default:return"fa fa-square-o fa-fw"}}(c[1]),i=new n.Token("check_open","span",1)
i.attrs=[["class",`chcklst-box ${s}`]],e.push(i)
const a=new n.Token("check_close","span",-1)
e.push(a)}function n(e,n){let s,i=null,a=0
for(;s=t.exec(e);){if(s.index>a){i=i||[]
const t=new n.Token("text","",0)
t.content=e.slice(a,s.index),i.push(t)}a=s.index+s[0].length,i=i||[],c(i,0,s,n)}if(i&&a<e.length){const t=new n.Token("text","",0)
t.content=e.slice(a),i.push(t)}return i}function s(e){let t,c,s,i,a,r=e.tokens,o=0
for(c=0,s=r.length;c<s;c++)if("inline"===r[c].type)for(i=r[c].children,t=i.length-1;t>=0;t--)if(a=i[t],o+=a.nesting,"text"===a.type&&0===o){const s=n(a.content,e)
s&&(r[c].children=i=e.md.utils.arrayReplaceAt(i,t,s))}}}),define("discourse/plugins/checklist/lib/rich-editor-extension",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
const t={nodeSpec:{check:{attrs:{checked:{default:!1}},inline:!0,group:"inline",draggable:!0,selectable:!1,toDOM:e=>["span",{class:e.attrs.checked?"chcklst-box checked fa fa-square-check-o fa-fw":"chcklst-box fa fa-square-o fa-fw"}],parseDOM:[{tag:"span.chcklst-box",getAttrs:e=>({checked:n(e.className)})}]}},inputRules:[{match:/(^|\s)\[(x? ?)]$/,handler:(e,t,c,n)=>e.tr.replaceWith(c+t[1].length,n,e.schema.nodes.check.create({checked:"x"===t[2]}))}],parse:{check_open:{node:"check",getAttrs:e=>({checked:n(e.attrGet("class"))})},check_close:{noCloseToken:!0,ignore:!0}},serializeNode:{check:(e,t)=>{e.write(t.attrs.checked?"[x]":"[ ]")}}},c=/\bchecked\b/
function n(e){return c.test(e)}e.default=t})

//# sourceMappingURL=checklist-4a0429c0.map