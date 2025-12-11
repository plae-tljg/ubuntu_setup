define("discourse/plugins/discourse-details/initializers/apply-details",["exports","jquery","discourse/lib/plugin-api","discourse-i18n","discourse/plugins/discourse-details/lib/rich-editor-extension"],function(e,t,s,i,o){"use strict"
function n(e){e.decorateCooked(e=>(0,t.default)("details",e),{id:"discourse-details"}),e.addComposerToolbarPopupMenuOption({action:function(e){e.applySurround(`\n[details="${(0,i.i18n)("composer.details_title")}"]\n`,"\n[/details]\n","details_text",{multiline:!1})},icon:"caret-right",label:"details.title"}),e.registerRichEditorExtension(o.default)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default={name:"apply-details",initialize(){(0,s.withPluginApi)(n)}}}),define("discourse/plugins/discourse-details/lib/discourse-markdown/details",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.setup=function(e){e.allowList(["summary","summary[title]","details","details[open]","details.elided"]),e.registerPlugin(e=>{e.block.bbcode.ruler.push("details",t)})}
const t={tag:"details",before(e,t){const s=t.attrs,i=e.push("bbcode_open","details",1)
e.push("bbcode_open","summary",1),""===s.open&&(i.attrs=[["open",""]]),e.push("text","",0).content=s._default||"",e.push("bbcode_close","summary",-1)},after(e){e.push("bbcode_close","details",-1)}}}),define("discourse/plugins/discourse-details/lib/rich-editor-extension",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
const t={nodeSpec:{details:{allowGapCursor:!0,attrs:{open:{default:!0}},content:"summary block+",group:"block",selectable:!0,defining:!0,isolating:!0,parseDOM:[{tag:"details"}],toDOM:e=>["details",{open:e.attrs.open||void 0},0]},summary:{content:"inline*",parseDOM:[{tag:"summary"}],toDOM:()=>["summary",0]}},parse:{bbcode_open:(e,t)=>"details"===t.tag?(e.openNode(e.schema.nodes.details,{open:null!==t.attrGet("open")}),!0):"summary"===t.tag?(e.openNode(e.schema.nodes.summary),!0):void 0,bbcode_close(e,t){if("details"===t.tag||"summary"===t.tag)return e.closeNode(),!0}},serializeNode:{details(e,t){e.renderContent(t),e.write("[/details]\n\n")},summary(e,t,s){let i=!1
0===t.content.childCount?e.write("[details"):(i=!0,e.write('[details="'),t.content.forEach(t=>t.text&&e.text(t.text.replace(/"/g,"“"),e.inAutolink)))
let o=(s.attrs.open?" open":"")+"]\n"
i&&(o=`"${o}`),e.write(o)}},plugins:{props:{handleClickOn(e,t,s,i){if(t>i+1||"summary"!==s.type.name)return!1
const o=e.state.doc.nodeAt(i-1)
return e.dispatch(e.state.tr.setNodeMarkup(i-1,null,{open:!o.attrs.open})),!0}}}}
e.default=t})

//# sourceMappingURL=discourse-details-9ccd0e80.map