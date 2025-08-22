define("discourse/plugins/discourse-presence/discourse/components/composer-presence-display",["exports","@glimmer/component","@glimmer/tracking","@ember/service","truth-helpers","discourse/components/user-link","discourse/helpers/avatar","discourse/helpers/helper-fn","discourse-i18n","@ember/component","@ember/template-factory"],function(e,s,t,r,n,i,c,o,a,l,p){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class u extends s.default{static{dt7948.g(this.prototype,"presence",[r.service])}#e=void dt7948.i(this,"presence")
static{dt7948.g(this.prototype,"composerPresenceManager",[r.service])}#s=void dt7948.i(this,"composerPresenceManager")
static{dt7948.g(this.prototype,"currentUser",[r.service])}#t=void dt7948.i(this,"currentUser")
static{dt7948.g(this.prototype,"siteSettings",[r.service])}#r=void dt7948.i(this,"siteSettings")
static{dt7948.g(this.prototype,"replyChannel",[t.tracked])}#n=void dt7948.i(this,"replyChannel")
static{dt7948.g(this.prototype,"whisperChannel",[t.tracked])}#i=void dt7948.i(this,"whisperChannel")
static{dt7948.g(this.prototype,"editChannel",[t.tracked])}#c=void dt7948.i(this,"editChannel")
setupReplyChannel=(0,o.default)((e,s)=>{const{topic:t}=this.args.model
if(!t||!this.isReply)return
const r=`/discourse-presence/reply/${t.id}`,n=this.presence.getChannel(r)
this.replyChannel=n,n.subscribe(),s.cleanup(()=>n.unsubscribe())})
setupWhisperChannel=(0,o.default)((e,s)=>{const{topic:t}=this.args.model,{whisperer:r}=this.currentUser
if(!t||!this.isReply||!r)return
const n=`/discourse-presence/whisper/${t.id}`,i=this.presence.getChannel(n)
this.whisperChannel=i,i.subscribe(),s.cleanup(()=>i.unsubscribe())})
setupEditChannel=(0,o.default)((e,s)=>{const{post:t}=this.args.model
if(!t||!this.isEdit)return
const r=`/discourse-presence/edit/${t.id}`,n=this.presence.getChannel(r)
this.editChannel=n,n.subscribe(),s.cleanup(()=>n.unsubscribe())})
notifyState=(0,o.default)((e,s)=>{const{topic:t,post:r,replyDirty:n}=this.args.model,i=this.isEdit?r:t
if(i){const e=`/discourse-presence/${this.state}/${i.id}`
this.composerPresenceManager.notifyState(e,n)}s.cleanup(()=>this.composerPresenceManager.leave())})
get isReply(){return"reply"===this.state||"whisper"===this.state}get isEdit(){return"edit"===this.state}get state(){const{editingPost:e,whisper:s,replyingToTopic:t}=this.args.model
return e?"edit":s?"whisper":t?"reply":void 0}static{dt7948.n(this.prototype,"state",[t.cached])}get users(){let e
if(this.isEdit)e=this.editChannel?.users||[]
else{e=[...this.replyChannel?.users||[],...this.whisperChannel?.users||[]]}return e.filter(e=>e.id!==this.currentUser.id).slice(0,this.siteSettings.presence_max_users_shown)}static{dt7948.n(this.prototype,"users",[t.cached])}static{(0,l.setComponentTemplate)((0,p.createTemplateFactory)({id:"yT15VqnX",block:'[[[1,"\\n"],[41,[30,0,["currentUser"]],[[[1,"      "],[1,[30,0,["setupReplyChannel"]]],[1,"\\n      "],[1,[30,0,["setupWhisperChannel"]]],[1,"\\n      "],[1,[30,0,["setupEditChannel"]]],[1,"\\n      "],[1,[30,0,["notifyState"]]],[1,"\\n\\n"],[41,[28,[32,0],[[30,0,["users","length"]],0],null],[[[1,"        "],[10,0],[14,0,"presence-users"],[12],[1,"\\n          "],[10,0],[14,0,"presence-avatars"],[12],[1,"\\n"],[42,[28,[31,2],[[28,[31,2],[[30,0,["users"]]],null]],null],null,[[[1,"              "],[8,[32,1],null,[["@user"],[[30,1]]],[["default"],[[[[1,"\\n                "],[1,[28,[32,2],[[30,1]],[["imageSize"],["small"]]]],[1,"\\n              "]],[]]]]],[1,"\\n"]],[1]],null],[1,"          "],[13],[1,"\\n\\n          "],[10,1],[14,0,"presence-text"],[12],[1,"\\n            "],[10,1],[14,0,"description"],[12],[41,[30,0,["isReply"]],[[[1,[28,[32,3],["presence.replying"],[["count"],[[30,0,["users","length"]]]]]]],[]],[[[1,[28,[32,3],["presence.editing"],[["count"],[[30,0,["users","length"]]]]]]],[]]],[13],[1,"\\n            "],[10,1],[14,0,"wave"],[12],[1,"\\n              "],[10,1],[14,0,"dot"],[12],[1,"."],[13],[1,"\\n              "],[10,1],[14,0,"dot"],[12],[1,"."],[13],[1,"\\n              "],[10,1],[14,0,"dot"],[12],[1,"."],[13],[1,"\\n            "],[13],[1,"\\n          "],[13],[1,"\\n        "],[13],[1,"\\n"]],[]],null]],[]],null],[1,"  "]],["user"],false,["if","each","-track-array"]]',moduleName:"/var/www/discourse/app/assets/javascripts/discourse/discourse/plugins/discourse-presence/discourse/components/composer-presence-display.js",scope:()=>[n.gt,i.default,c.default,a.i18n],isStrictMode:!0}),this)}}e.default=u}),define("discourse/plugins/discourse-presence/discourse/components/topic-presence-display",["exports","@glimmer/component","@glimmer/tracking","@ember/service","truth-helpers","discourse/components/user-link","discourse/helpers/avatar","discourse/helpers/helper-fn","discourse-i18n","@ember/component","@ember/template-factory"],function(e,s,t,r,n,i,c,o,a,l,p){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class u extends s.default{static{dt7948.g(this.prototype,"presence",[r.service])}#e=void dt7948.i(this,"presence")
static{dt7948.g(this.prototype,"currentUser",[r.service])}#t=void dt7948.i(this,"currentUser")
static{dt7948.g(this.prototype,"replyChannel",[t.tracked])}#n=void dt7948.i(this,"replyChannel")
static{dt7948.g(this.prototype,"whisperChannel",[t.tracked])}#i=void dt7948.i(this,"whisperChannel")
setupReplyChannel=(0,o.default)((e,s)=>{const{topic:t}=this.args
if(!t)return
const r=`/discourse-presence/reply/${t.id}`,n=this.presence.getChannel(r)
this.replyChannel=n,n.subscribe(),s.cleanup(()=>n.unsubscribe())})
setupWhisperChannel=(0,o.default)((e,s)=>{const{topic:t}=this.args,{whisperer:r}=this.currentUser
if(!t||!r)return
const n=`/discourse-presence/whisper/${t.id}`,i=this.presence.getChannel(n)
this.whisperChannel=i,i.subscribe(),s.cleanup(()=>i.unsubscribe())})
get users(){return[...this.replyChannel?.users||[],...this.whisperChannel?.users||[]].filter(e=>e.id!==this.currentUser.id)}static{dt7948.n(this.prototype,"users",[t.cached])}static{(0,l.setComponentTemplate)((0,p.createTemplateFactory)({id:"nq1M/yEk",block:'[[[1,"\\n"],[41,[30,0,["currentUser"]],[[[1,"      "],[1,[30,0,["setupReplyChannel"]]],[1,"\\n      "],[1,[30,0,["setupWhisperChannel"]]],[1,"\\n\\n"],[41,[28,[32,0],[[30,0,["users","length"]],0],null],[[[1,"        "],[10,0],[14,0,"presence-users"],[12],[1,"\\n          "],[10,0],[14,0,"presence-avatars"],[12],[1,"\\n"],[42,[28,[31,2],[[28,[31,2],[[30,0,["users"]]],null]],null],null,[[[1,"              "],[8,[32,1],null,[["@user"],[[30,1]]],[["default"],[[[[1,"\\n                "],[1,[28,[32,2],[[30,1]],[["imageSize"],[[30,2]]]]],[1,"\\n              "]],[]]]]],[1,"\\n"]],[1]],null],[1,"          "],[13],[1,"\\n\\n          "],[10,1],[14,0,"presence-text"],[12],[1,"\\n            "],[10,1],[14,0,"description"],[12],[1,"\\n              "],[1,[28,[32,3],["presence.replying_to_topic"],[["count"],[[30,0,["users","length"]]]]]],[1,"\\n            "],[13],[1,"\\n            "],[10,1],[14,0,"wave"],[12],[1,"\\n              "],[10,1],[14,0,"dot"],[12],[1,"."],[13],[1,"\\n              "],[10,1],[14,0,"dot"],[12],[1,"."],[13],[1,"\\n              "],[10,1],[14,0,"dot"],[12],[1,"."],[13],[1,"\\n            "],[13],[1,"\\n          "],[13],[1,"\\n        "],[13],[1,"\\n"]],[]],null]],[]],null],[1,"  "]],["user","@avatarSize"],false,["if","each","-track-array"]]',moduleName:"/var/www/discourse/app/assets/javascripts/discourse/discourse/plugins/discourse-presence/discourse/components/topic-presence-display.js",scope:()=>[n.gt,i.default,c.default,a.i18n],isStrictMode:!0}),this)}}e.default=u}),define("discourse/plugins/discourse-presence/discourse/connectors/before-composer-controls/presence",["exports","discourse/plugins/discourse-presence/discourse/components/composer-presence-display","@ember/component","@ember/template-factory","@ember/component/template-only"],function(e,s,t,r,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
const i=(0,t.setComponentTemplate)((0,r.createTemplateFactory)({id:"ic5m4qg5",block:'[[[1,"\\n  "],[10,0],[14,0,"before-composer-controls-outlet presence"],[12],[1,"\\n    "],[8,[32,0],null,[["@model"],[[30,1,["model"]]]],null],[1,"\\n  "],[13],[1,"\\n"]],["@outletArgs"],false,[]]',moduleName:"/var/www/discourse/app/assets/javascripts/discourse/discourse/plugins/discourse-presence/discourse/connectors/before-composer-controls/presence.js",scope:()=>[s.default],isStrictMode:!0}),(0,n.default)(void 0,"presence:Presence"))
e.default=i}),define("discourse/plugins/discourse-presence/discourse/connectors/topic-above-footer-buttons/presence",["exports","@glimmer/component","@ember/helper","@ember/template","discourse/lib/avatar-utils","discourse/plugins/discourse-presence/discourse/components/topic-presence-display","@ember/component","@ember/template-factory"],function(e,s,t,r,n,i,c,o){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
const a="small"
class l extends s.default{get avatarDimensions(){return(0,n.translateSize)(a)}static{(0,c.setComponentTemplate)((0,o.createTemplateFactory)({id:"1blYWYl1",block:'[[[1,"\\n    "],[10,0],[15,5,[28,[32,0],[[28,[32,1],["--avatar-min-height: ",[30,0,["avatarDimensions"]],"px"],null]],null]],[14,0,"topic-above-footer-buttons-outlet presence"],[12],[1,"\\n      "],[8,[32,2],null,[["@topic","@avatarSize"],[[30,1,["model"]],[32,3]]],null],[1,"\\n    "],[13],[1,"\\n  "]],["@outletArgs"],false,[]]',moduleName:"/var/www/discourse/app/assets/javascripts/discourse/discourse/plugins/discourse-presence/discourse/connectors/topic-above-footer-buttons/presence.js",scope:()=>[r.htmlSafe,t.concat,i.default,a],isStrictMode:!0}),this)}}e.default=l}),define("discourse/plugins/discourse-presence/discourse/services/composer-presence-manager",["exports","@ember/runloop","@ember/service","discourse/lib/environment"],function(e,s,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class n extends t.default{static{dt7948.g(this.prototype,"currentUser",[t.service])}#t=void dt7948.i(this,"currentUser")
static{dt7948.g(this.prototype,"presence",[t.service])}#e=void dt7948.i(this,"presence")
static{dt7948.g(this.prototype,"siteSettings",[t.service])}#r=void dt7948.i(this,"siteSettings")
notifyState(e,t=!0,n=1e4){if(!t)return void this.leave()
const i=this.siteSettings.allow_users_to_hide_profile,c=this.currentUser.user_option.hide_presence
i&&c||this._name!==e&&(this.leave(),this._name=e,this._channel=this.presence.getChannel(e),this._channel.enter(),(0,r.isTesting)()||(this._autoLeaveTimer=(0,s.debounce)(this,this.leave,n)))}leave(){this._autoLeaveTimer&&((0,s.cancel)(this._autoLeaveTimer),this._autoLeaveTimer=null),this._channel?.leave(),this._channel=null,this._name=null}}e.default=n})

//# sourceMappingURL=discourse-presence-19039eda.map