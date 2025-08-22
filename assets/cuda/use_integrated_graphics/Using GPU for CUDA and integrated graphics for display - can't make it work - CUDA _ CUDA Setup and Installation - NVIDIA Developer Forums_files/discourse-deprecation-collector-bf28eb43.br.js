define("discourse/plugins/discourse-deprecation-collector/discourse/api-initializers/init-deprecation-collector",["exports","discourse/lib/api"],function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(0,t.apiInitializer)("0.8",e=>{e.container.lookup("service:deprecation-collector")})}),define("discourse/plugins/discourse-deprecation-collector/discourse/services/deprecation-collector",["exports","@ember/debug","@ember/runloop","@ember/service","discourse/deprecation-workflow","discourse/lib/debounce","discourse/lib/decorators","discourse/lib/deprecated","discourse/lib/get-url","discourse/lib/source-identifier"],function(e,t,i,r,o,s,n,c,d,l){"use strict"
let a
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,(0,t.registerDeprecationHandler)((e,t,i)=>(a?.(e,t),i(e,t))),(0,c.registerDeprecationHandler)((e,t)=>a?.(e,t))
class u extends r.default{static{dt7948.g(this.prototype,"router",[r.service])}#e=void dt7948.i(this,"router")
#t=new Map
#i=new Map
#r
constructor(){super(...arguments),a=this.track
for(const e of o.default)this.#t.set(e.matchId,e.handler)
document.addEventListener("visibilitychange",this.handleVisibilityChanged),this.router.on("routeWillChange",this.debouncedReport)}willDestroy(){a=null,window.removeEventListener("visibilitychange",this.handleVisibilityChanged),this.router.off("routeWillChange",this.debouncedReport),(0,i.cancel)(this.#r),super.willDestroy()}handleVisibilityChanged(){"visible"!==document.visibilityState&&this.report()}static{dt7948.n(this.prototype,"handleVisibilityChanged",[n.bind])}track(e,t){if("silence"===this.#t.get(t.id))return
if("browser-extension"===(0,l.default)()?.type)return
let i=this.#i.get(t.id)||0
i+=1,this.#i.set(t.id,i)}static{dt7948.n(this.prototype,"track",[n.bind])}debouncedReport(){this.#r=(0,s.default)(this.report,1e4)}static{dt7948.n(this.prototype,"debouncedReport",[n.bind])}report(){if((0,i.cancel)(this.#r),0===this.#i.size)return
const e=Object.fromEntries(this.#i.entries())
this.#i.clear()
const t=new FormData
t.append("data",JSON.stringify(e)),navigator.sendBeacon((0,d.default)("/deprecation-collector/log"),t)}static{dt7948.n(this.prototype,"report",[n.bind])}}e.default=u})

//# sourceMappingURL=discourse-deprecation-collector-be9019dc.map