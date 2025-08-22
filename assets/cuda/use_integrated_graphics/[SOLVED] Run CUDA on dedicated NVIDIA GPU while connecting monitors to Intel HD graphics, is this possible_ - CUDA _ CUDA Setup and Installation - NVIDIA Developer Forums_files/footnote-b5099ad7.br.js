define("discourse/plugins/footnote/api-initializers/inline-footnotes",["exports","@glimmer/component","@ember/modifier","@ember/object","@ember/template","discourse/lib/api","float-kit/components/d-tooltip","@ember/component","@ember/template-factory"],function(e,t,o,n,i,s,r,a,l){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class c extends t.default{preventDefault(e){e.preventDefault()}static{dt7948.n(this.prototype,"preventDefault",[n.action])}static{(0,a.setComponentTemplate)((0,l.createTemplateFactory)({id:"6hwOaO4I",block:'[[[1,"\\n    "],[8,[32,0],null,[["@identifier","@interactive","@closeOnScroll","@closeOnClickOutside"],["inline-footnote",true,false,true]],[["trigger","content"],[[[[1,"\\n"],[1,"        "],[11,3],[24,0,"expand-footnote"],[24,6,""],[24,"role","button"],[16,"data-footnote-id",[30,1,["footnoteId"]]],[16,"data-footnote-content",[30,1,["footnoteContent"]]],[4,[32,1],["click",[30,0,["preventDefault"]]],null],[12],[13],[1,"\\n      "]],[]],[[[1,"\\n        "],[1,[28,[32,2],[[30,1,["footnoteContent"]]],null]],[1,"\\n      "]],[]]]]],[1,"\\n  "]],["@data"],false,[]]',moduleName:"/var/www/discourse/app/assets/javascripts/discourse/discourse/plugins/footnote/api-initializers/inline-footnotes.js",scope:()=>[r.default,o.on,i.htmlSafe],isStrictMode:!0}),this)}}e.default=(0,s.apiInitializer)(e=>{e.decorateCookedElement((t,o)=>{if(!e.container.lookup("service:site-settings").display_footnotes_inline)return
const n=t.querySelectorAll("sup.footnote-ref")
n.forEach(e=>{const n=e.querySelector("a")
if(!n)return
const i=n.getAttribute("href"),s=t.querySelector(i)?.innerHTML,r=document.createElement("span")
e.replaceWith(r),o.renderGlimmer(r,c,{footnoteId:i,footnoteContent:s})}),n.length&&t.classList.add("inline-footnotes")})})}),define("discourse/plugins/footnote/initializers/composer",["exports","discourse/lib/plugin-api","discourse-i18n","discourse/plugins/footnote/lib/rich-editor-extension"],function(e,t,o,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default={name:"footnotes-composer",initialize(){(0,t.withPluginApi)(e=>{e.registerRichEditorExtension(n.default),e.addComposerToolbarPopupMenuOption({action(e){e.addText(`^[${(0,o.i18n)("footnote.title")}]`)},group:"insertions",icon:"asterisk",label:"footnote.add"})})}}}),define("discourse/plugins/footnote/lib/discourse-markdown/footnotes",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.setup=function(e){e.registerOptions((e,t)=>{e.features.footnotes=window.markdownitFootnote&&!!t.enable_markdown_footnotes}),e.allowList(["ol.footnotes-list","hr.footnotes-sep","li.footnote-item","a.footnote-backref","sup.footnote-ref"]),e.allowList({custom(e,t,o){if(("a"===e||"li"===e)&&"id"===t)return!!o.match(/^fn(ref)?\d+$/)}}),window.markdownitFootnote&&e.registerPlugin(window.markdownitFootnote)}}),define("discourse/plugins/footnote/lib/rich-editor-extension",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
const t={nodeViews:{footnote:function({pmView:{EditorView:e},pmState:{EditorState:t},pmTransform:{StepMap:o}}){return class{constructor(e,t,o){this.node=e,this.outerView=t,this.getPos=o,this.dom=document.createElement("div"),this.dom.className="footnote",this.innerView=null}selectNode(){this.dom.classList.add("ProseMirror-selectednode"),this.innerView||this.open(),this.innerView&&this.innerView.dom.focus()}deselectNode(){this.dom.classList.remove("ProseMirror-selectednode"),this.innerView&&this.close()}open(){const o=this.dom.appendChild(document.createElement("div"))
o.style.setProperty("--footnote-counter",`"${this.#e()}"`),o.className="footnote-tooltip",this.innerView=new e(o,{state:t.create({doc:this.node,plugins:this.outerView.state.plugins.filter(e=>!/^(placeholder|trailing-paragraph)\$.*/.test(e.key))}),dispatchTransaction:this.dispatchInner.bind(this),handleDOMEvents:{mousedown:()=>{this.outerView.hasFocus()&&this.innerView.focus()}}})}#e(){const e=this.dom.closest(".ProseMirror")?.querySelectorAll(".footnote")
return Array.from(e).indexOf(this.dom)+1}close(){this.innerView.destroy(),this.innerView=null,this.dom.textContent=""}dispatchInner(e){const{state:t,transactions:n}=this.innerView.state.applyTransaction(e)
if(this.innerView.updateState(t),!e.getMeta("fromOutside")){const e=this.outerView.state.tr,t=o.offset(this.getPos()+1)
for(let o=0;o<n.length;o++){const i=n[o].steps
for(let o=0;o<i.length;o++)e.step(i[o].map(t))}e.docChanged&&this.outerView.dispatch(e)}}update(e){if(!e.sameMarkup(this.node))return!1
if(this.node=e,this.innerView){const t=this.innerView.state,o=e.content.findDiffStart(t.doc.content)
if(null!=o){let{a:n,b:i}=e.content.findDiffEnd(t.doc.content),s=o-Math.min(n,i)
s>0&&(n+=s,i+=s),this.innerView.dispatch(t.tr.replace(o,i,e.slice(o,n)).setMeta("fromOutside",!0))}}return!0}destroy(){this.innerView&&this.close()}stopEvent(e){return this.innerView&&this.innerView.dom.contains(e.target)}ignoreMutation(){return!0}}}},nodeSpec:{footnote:{attrs:{id:{}},group:"inline",content:"block*",inline:!0,atom:!0,draggable:!1,parseDOM:[{tag:"div.footnote"}],toDOM:()=>["div",{class:"footnote"},0]}},parse:({pmModel:{Slice:e,Fragment:t}})=>({footnote_ref:{node:"footnote",getAttrs:e=>({id:e.meta.id})},footnote_block:{ignore:!0},footnote_open(o,n,i,s){const r=o.top(),a=n.meta.id
let l=i.slice(s+1,i.length-1)
const c=l.findIndex(e=>"footnote_close"===e.type)
l=l.slice(0,c),r.content.forEach((n,i)=>{const s=[]
n.descendants((n,i)=>{if("footnote"!==n.type.name||n.attrs.id!==a)return
o.stack=[],o.openNode(o.schema.nodes.footnote),o.parseTokens(l)
const c=o.closeNode()
o.stack=[r]
const d=new e(t.from(c),0,0)
s.push({from:i,to:i+2,slice:d})})
for(const{from:e,to:t,slice:o}of s)r.content[i]=r.content[i].replace(e,t,o)}),i.splice(s+1,l.length+1)},footnote_anchor:{ignore:!0,noCloseToken:!0}}),serializeNode:{footnote(e,t){if(1===t.content.content.length&&"paragraph"===t.content.firstChild.type.name)e.write("^["),e.renderContent(t.content.firstChild),e.write("]")
else{const o=e.footnoteContents??=[]
o.push(t.content),e.write(`[^${o.length}]`)}},afterSerialize(e){const t=e.footnoteContents
if(t)for(let o=0;o<t.length;o++){const n=e.delim
e.write(`[^${o+1}]: `),e.delim+="    ",e.renderContent(t[o]),e.delim=n}}},inputRules:({pmState:{NodeSelection:e}})=>[{match:/\^\[(.*?)]$/,handler:(e,t,o,n)=>{const i=e.doc.slice(o+2,n).content,s=e.schema.nodes.paragraph.create(null,i),r=e.schema.nodes.footnote.create(null,s)
return e.tr.replaceWith(o,n,r)}},{match:/\[\^\d+]$/,handler:(t,o,n,i)=>{const s=t.schema.nodes.paragraph.create(),r=t.schema.nodes.footnote.create(null,s),a=t.tr.replaceWith(n,i,r)
return a.setSelection(e.create(a.doc,n)),a}}]}
e.default=t})

//# sourceMappingURL=footnote-6c137533.map