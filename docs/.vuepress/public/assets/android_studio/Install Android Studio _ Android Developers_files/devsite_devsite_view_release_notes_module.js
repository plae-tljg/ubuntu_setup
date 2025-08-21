(function(_ds){var window=this;var d9=class extends _ds.lO{constructor(){super(["devsite-dialog","devsite-dropdown-list","devsite-view-release-notes-dialog"]);this.Wr=!1;this.releaseNotes=new Map;this.dialog=null;this.path="";this.label="Release Notes";this.disableAutoOpen=!1}Pa(){return this}async connectedCallback(){super.connectedCallback();try{this.path||(this.path=await _ds.xt(_ds.B().href)),this.releaseNotes=await _ds.my(this.path)}catch(a){}this.releaseNotes.size===0?this.remove():(this.Wr=!0,this.disableAutoOpen||location.hash!==
"#release__notes"||this.j())}disconnectedCallback(){super.disconnectedCallback();let a;(a=this.dialog)==null||a.remove();this.dialog=null}j(a){a&&(a.preventDefault(),a.stopPropagation());let b;(b=this.dialog)==null||b.remove();this.dialog=document.createElement("devsite-dialog");this.dialog.classList.add("devsite-view-release-notes-dialog-container");_ds.tN((0,_ds.O)`
      <devsite-view-release-notes-dialog
        .releaseNotes=${this.releaseNotes}>
      </devsite-view-release-notes-dialog>
    `,this.dialog);document.body.appendChild(this.dialog);this.dialog.open=!0;this.Ba({category:"Site-Wide Custom Events",action:"release notes: view note",label:`${this.path}`})}render(){if(!this.Wr)return delete this.dataset.shown,(0,_ds.O)``;this.dataset.shown="";return(0,_ds.O)`
      <button class="view-notes-button" @click="${this.j}">
        ${this.label}
      </button>
    `}};_ds.v([_ds.K(),_ds.w("design:type",Object)],d9.prototype,"Wr",void 0);_ds.v([_ds.I({type:String}),_ds.w("design:type",Object)],d9.prototype,"path",void 0);_ds.v([_ds.I({type:String}),_ds.w("design:type",Object)],d9.prototype,"label",void 0);_ds.v([_ds.I({type:Boolean,Aa:"disable-auto-open"}),_ds.w("design:type",Object)],d9.prototype,"disableAutoOpen",void 0);try{customElements.define("devsite-view-release-notes",d9)}catch(a){console.warn("devsite.app.customElement.DevsiteViewReleaseNotes",a)};})(_ds_www);
