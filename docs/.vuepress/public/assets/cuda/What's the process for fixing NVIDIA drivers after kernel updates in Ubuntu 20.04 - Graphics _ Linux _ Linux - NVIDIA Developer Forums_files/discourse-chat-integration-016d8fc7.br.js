define("discourse/plugins/discourse-chat-integration/discourse/public-route-map",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(){this.route("transcript",{path:"/chat-transcript/:secret"})}}),define("discourse/plugins/discourse-chat-integration/discourse/routes/transcript",["exports","@ember/service","discourse/lib/ajax","discourse/lib/ajax-error","discourse/lib/utilities","discourse/routes/discourse"],function(e,t,r,s,i,o){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class c extends o.default{static{dt7948.g(this.prototype,"currentUser",[t.service])}#e=void dt7948.i(this,"currentUser")
static{dt7948.g(this.prototype,"composer",[t.service])}#t=void dt7948.i(this,"composer")
static{dt7948.g(this.prototype,"router",[t.service])}#r=void dt7948.i(this,"router")
async model(e){if(this.currentUser){await this.router.replaceWith(`discovery.${(0,i.defaultHomepage)()}`).followRedirects()
try{const{content:t}=await(0,r.ajax)(`/chat-transcript/${e.secret}`)
this.composer.openNewTopic({body:t})}catch(t){(0,s.popupAjaxError)(t)}}else this.send("showLogin")}}e.default=c})

//# sourceMappingURL=discourse-chat-integration-edc03bc5.map