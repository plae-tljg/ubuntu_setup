document.addEventListener("discourse-init",async e=>{performance.mark("discourse-init")
const t=e.detail,{default:n,loadThemes:o}=require(`${t.modulePrefix}/app`)
await o()
n.create(t).start()}),function(){if(window.unsupportedBrowser)throw"Unsupported browser detected"
let e=document.querySelector('meta[name="discourse/config/environment"]')
const t=JSON.parse(decodeURIComponent(e.getAttribute("content"))),n=new CustomEvent("discourse-init",{detail:t})
document.dispatchEvent(n)}()

//# sourceMappingURL=start-discourse-5cd5f405.map