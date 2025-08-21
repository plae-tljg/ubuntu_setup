(function(_ds){var window=this;var hta=_ds.zN([':host{--mdc-line-height:var(--devsite-mdc-line-height,56px);--mdc-text-field-outlined-hover-border-color:#4e5256;--mdc-text-field-outlined-focused-border-color:var(--devsite-link-color);--mdc-text-field-outlined-focused-label-color:var(--devsite-link-color);--mdc-text-field-padding:16px;--mdc-text-field-border-radius:4px;--mdc-text-field-error-color:#d93025;--mdc-text-field-warning-color:#c63119;--mdc-text-field-icon-width:24px;--mdc-text-field-icon-height:24px;--mdc-select-dropdown-icon-color:rgba(0,0,0,.54)}*{-moz-box-sizing:border-box;box-sizing:border-box}label{border:var(--devsite-input-border);border-radius:var(--mdc-text-field-border-radius);color:var(--devsite-input-color,var(--devsite-primary-text-color));display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;position:relative;width:100%}label:hover{border-color:var(--mdc-text-field-outlined-hover-border-color)}label:focus{outline:0}label.devsite-mwc--focused,label.devsite-mwc--focused:hover{border:1px solid var(--mdc-text-field-outlined-focused-border-color)}label.devsite-mwc--focused .devsite-mwc__label,label.devsite-mwc--focused:hover .devsite-mwc__label{color:var(--mdc-text-field-outlined-focused-label-color);font-weight:500}label.devsite-mwc--focused input,label.devsite-mwc--focused select,label.devsite-mwc--focused textarea,label.devsite-mwc--focused:hover input,label.devsite-mwc--focused:hover select,label.devsite-mwc--focused:hover textarea{border:1px solid var(--mdc-text-field-outlined-focused-border-color);border-radius:calc(var(--mdc-text-field-border-radius)/2)}label.devsite-mwc--invalid,label.devsite-mwc--invalid:hover{border-color:var(--mdc-text-field-error-color)}@media (forced-colors:active){label.devsite-mwc--invalid,label.devsite-mwc--invalid:hover{border-color:LinkText}}label.devsite-mwc--invalid input,label.devsite-mwc--invalid select,label.devsite-mwc--invalid textarea,label.devsite-mwc--invalid:hover input,label.devsite-mwc--invalid:hover select,label.devsite-mwc--invalid:hover textarea{border-color:var(--mdc-text-field-error-color)}@media (forced-colors:active){label.devsite-mwc--invalid input,label.devsite-mwc--invalid select,label.devsite-mwc--invalid textarea,label.devsite-mwc--invalid:hover input,label.devsite-mwc--invalid:hover select,label.devsite-mwc--invalid:hover textarea{border-color:LinkText}}label.devsite-mwc--invalid .devsite-mwc__label,label.devsite-mwc--invalid:hover .devsite-mwc__label{color:var(--mdc-text-field-error-color)}@media (forced-colors:active){label.devsite-mwc--invalid .devsite-mwc__label,label.devsite-mwc--invalid:hover .devsite-mwc__label{color:LinkText}}label.devsite-mwc--warning,label.devsite-mwc--warning:hover{border-color:var(--mdc-text-field-warning-color)}@media (forced-colors:active){label.devsite-mwc--warning,label.devsite-mwc--warning:hover{border-color:LinkText}}label.devsite-mwc--warning input,label.devsite-mwc--warning select,label.devsite-mwc--warning textarea,label.devsite-mwc--warning:hover input,label.devsite-mwc--warning:hover select,label.devsite-mwc--warning:hover textarea{border-color:var(--mdc-text-field-warning-color)}@media (forced-colors:active){label.devsite-mwc--warning input,label.devsite-mwc--warning select,label.devsite-mwc--warning textarea,label.devsite-mwc--warning:hover input,label.devsite-mwc--warning:hover select,label.devsite-mwc--warning:hover textarea{border-color:LinkText}}label.devsite-mwc--warning .devsite-mwc__label,label.devsite-mwc--warning:hover .devsite-mwc__label{color:var(--mdc-text-field-warning-color)}@media (forced-colors:active){label.devsite-mwc--warning .devsite-mwc__label,label.devsite-mwc--warning:hover .devsite-mwc__label{color:LinkText}}.devsite-mwc__label--required:after{content:"*"/"(required)";margin-inline:1px 0}input,select,textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--devsite-input-background);border:1px solid transparent;border-radius:var(--mdc-text-field-border-radius);color:var(--devsite-input-color,var(--devsite-primary-text-color));font-family:var(--mdc-typography-subtitle1-font-family,var(--mdc-typography-font-family,Roboto,sans-serif));font-size:var(--mdc-typography-subtitle1-font-size,1rem);font-weight:var(--mdc-typography-subtitle1-font-weight,400);letter-spacing:var(--mdc-typography-subtitle1-letter-spacing,.009375em);line-height:var(--mdc-line-height);margin-block:0;margin-inline:0;min-height:var(--mdc-line-height);outline:0;padding-block:0;padding-inline:var(--mdc-text-field-padding);text-transform:var(--mdc-typography-subtitle1-text-transform,inherit);width:100%}input:active,input:focus,select:active,select:focus,textarea:active,textarea:focus{outline:0}textarea{-moz-box-sizing:border-box;box-sizing:border-box;line-height:1.5em;overflow:hidden auto;padding-block:var(--mdc-text-field-padding);padding-inline:var(--mdc-text-field-padding);resize:none}.devsite-mwc__label{background:transparent;inset-block-start:50%;inset-inline-start:var(--mdc-text-field-padding);padding-block:0;padding-inline:0;pointer-events:none;position:absolute;-webkit-transform:translate3d(0,-50%,0) scale(1);transform:translate3d(0,-50%,0) scale(1);-webkit-transform-origin:left center;transform-origin:left center;-webkit-transition:all .15s cubic-bezier(.4,0,.2,1) 0s;transition:all .15s cubic-bezier(.4,0,.2,1) 0s}[dir=rtl] .devsite-mwc__label{-webkit-transform-origin:right center;transform-origin:right center}.devsite-mwc-text-area .devsite-mwc__label{inset-block-start:calc(13px + var(--mdc-text-field-padding))}.devsite-mwc-text-field__icon{-webkit-box-align:center;-moz-box-align:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;-ms-flex-pack:center;-webkit-align-items:center;align-items:center;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;height:24px;inset-block-start:50%;inset-inline-start:var(--mdc-text-field-padding);-webkit-justify-content:center;justify-content:center;pointer-events:none;position:absolute;-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);width:24px}.devsite-mwc-text-field__icon img{max-width:100%}.devsite-mwc-text-field--with-leading-icon input{-webkit-padding-start:calc(var(--mdc-text-field-padding) + var(--mdc-text-field-icon-width) + 8px);-moz-padding-start:calc(var(--mdc-text-field-padding) + var(--mdc-text-field-icon-width) + 8px);padding-inline-start:calc(var(--mdc-text-field-padding) + var(--mdc-text-field-icon-width) + 8px)}.devsite-mwc-text-field--with-leading-icon .devsite-mwc__label{inset-inline-start:calc(var(--mdc-text-field-padding) + var(--mdc-text-field-icon-width) + 8px)}.devsite-mwc-select__dropdown-icon{fill:var(--mdc-select-dropdown-icon-color);inset-block-start:50%;inset-inline-end:var(--mdc-text-field-padding);pointer-events:none;-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.devsite-mwc-select__dropdown-icon,.devsite-mwc-select__dropdown-icon svg{height:5px;position:absolute;width:10px}.devsite-mwc-select__dropdown-icon svg .devsite-mwc-select__dropdown-icon-inactive{fill:var(--devsite-secondary-text-color)}.devsite-mwc-character-counter{color:var(--devsite-secondary-text-color);font-size:12px;margin-block:4px;margin-inline:var(--mdc-text-field-padding)}.devsite-mwc--floating .devsite-mwc__label{background:var(--devsite-input-background);inset-block-start:0;inset-inline-start:var(--mdc-text-field-padding);padding-block:0;padding-inline:4px;-webkit-transform:translate3d(-3px,-50%,0) scale(.75);transform:translate3d(-3px,-50%,0) scale(.75)}']);var U4=_ds.PN(class extends _ds.QN{constructor(a){super();if(a.type!==3&&a.type!==1&&a.type!==4)throw Error("The `live` directive is not allowed on child or event bindings");if(a.Jb!==void 0)throw Error("`live` bindings can only contain a single expression");}render(a){return a}update(a,[b]){if(b===_ds.Gt||b===_ds.lN)return b;const c=a.element,d=a.name;if(a.type===3){if(b===c[d])return _ds.Gt}else if(a.type===4){if(!!b===c.hasAttribute(d))return _ds.Gt}else if(a.type===1&&c.getAttribute(d)===String(b))return _ds.Gt;
_ds.oP(a);return b}});var V4=function(a){return a.label?(0,_ds.O)`<span
      class="devsite-mwc__label ${a.required?"devsite-mwc__label--required":""}"
      >${a.label}</span
    >`:_ds.lN},W4=function(a){return a.icon?(0,_ds.O)`<span class="devsite-mwc-text-field__icon" aria-hidden="true">
          <img src="${a.staticPath}/images/icons/${a.icon}.svg" />
        </span>`:_ds.lN},ita=function(a){return(0,_ds.O)`
      <select class="devsite-mwc-select__input"
              .value="${U4(a.value)}"
              ?disabled="${a.disabled}"
              ?required="${a.required}"
              ?readonly="${a.readOnly}"
              name="${_ds.iS(a.name===""?void 0:a.name)}"
              @change="${b=>{a.ma(b);a.j(b)}}"
              @blur="${a.ea}"
              @focus="${a.oa}">
        ${a.options.map(b=>(0,_ds.O)`
          <option value="${b.value}"
                  ?disabled="${b.disabled}"
                  ?selected="${b.value.toUpperCase().trim()===a.value.toUpperCase().trim()}">
              ${b.text}
          </option>`)}
      </select>
      <span class="devsite-mwc-select__dropdown-icon" aria-hidden="true">
        <svg class="devsite-mwc-select__dropdown-icon-graphic"
             viewBox="7 10 10 5"
             focusable="false">
          <polygon class="devsite-mwc-select__dropdown-icon-inactive"
                   stroke="none"
                   fill-rule="evenodd"
                   points="7 10 12 15 17 10">
          </polygon>
        </svg>
      </span>`},X4=class extends _ds.lO{static get styles(){return hta}constructor(){super();this.readOnly=!1;this.kind="";this.type="text";this.disabled=this.warning=this.required=this.outlined=!1;this.name=this.value=this.placeholder=this.icon=this.label="";this.invalid=this.focused=!1;this.rows=2;this.cols=20;this.maxLength=this.minLength=-1;this.charCounter=!1;this.staticPath="";this.options=[]}o(a){super.o(a);(a=Array.from(this.querySelectorAll("option")).map(b=>({value:b.value,text:b.text,disabled:b.disabled})))&&
a.length&&a[0].text!==""&&a[0].value!==""&&a.unshift({value:"",text:"",disabled:!0});this.options=a;_ds.fw(this)}update(a){a.has("value")&&typeof this.value!=="string"&&(this.value=`${this.value}`);super.update(a)}ea(a){this.value=a.target.value.trim();this.focused=!1;this.value===""&&(this.warning=!1)}oa(a){this.value=a.target.value.trim();this.focused=!0}ma(a){this.value=a.target.value.trim();this.invalid=!1;this.required&&this.value===""?this.invalid=!0:this.value&&(this.minLength>0&&this.value.length<
this.minLength&&(this.invalid=!0),this.maxLength>0&&this.value.length>this.maxLength&&(this.invalid=!0))}j(a){const b=new CustomEvent("change");a&&(this.value=a.target.value.trim());this.dispatchEvent(b)}focus(){const a=new CustomEvent("focus");let b;(b=this.inputElement)==null||b.dispatchEvent(a);let c;(c=this.inputElement)==null||c.focus();let d;(d=this.ck)==null||d.dispatchEvent(a);let e;(e=this.ck)==null||e.focus();let f;(f=this.Tj)==null||f.dispatchEvent(a);let g;(g=this.Tj)==null||g.focus()}blur(){const a=
new CustomEvent("blur");let b;(b=this.inputElement)==null||b.dispatchEvent(a);let c;(c=this.inputElement)==null||c.blur();let d;(d=this.ck)==null||d.dispatchEvent(a);let e;(e=this.ck)==null||e.blur();let f;(f=this.Tj)==null||f.dispatchEvent(a);let g;(g=this.Tj)==null||g.blur()}select(){let a;(a=this.inputElement)==null||a.select();let b;(b=this.Tj)==null||b.select()}render(){switch(this.kind){case "textfield":var a=(0,_ds.by)({"devsite-mwc-text-field--with-leading-icon":this.icon,"devsite-mwc--no-label":!this.label,
"devsite-mwc--outlined":this.outlined,"devsite-mwc--disabled":this.disabled,"devsite-mwc--focused":this.focused,"devsite-mwc--invalid":this.invalid,"devsite-mwc--warning":this.warning,"devsite-mwc--floating":this.value!==""||this.focused}),b=V4(this),c=W4(this);var d=this.minLength===-1?void 0:this.minLength;const e=this.maxLength===-1?void 0:this.maxLength;d=(0,_ds.O)` <input
      class="devsite-mwc-text-field__input"
      type="${this.type}"
      .value="${U4(this.value)}"
      ?disabled="${this.disabled}"
      placeholder="${this.placeholder}"
      ?required="${this.required}"
      ?readonly="${this.readOnly}"
      minlength="${d!=null?d:_ds.lN}"
      maxlength="${e!=null?e:_ds.lN}"
      name="${_ds.iS(this.name===""?void 0:this.name)}"
      @input="${this.ma}"
      @blur="${this.ea}"
      @focus="${this.oa}"
      @change="${this.j}" />`;return(0,_ds.O)`
      <label class="devsite-mwc-text-field ${a}">
        ${b} ${c}
        ${d}
      </label>
    `;case "select":a:{for(a of this.options)if(a.value.trim()===this.value.trim()){a=a.text.trim();break a}a=""}return(0,_ds.O)`
      <label class="devsite-mwc-select ${(0,_ds.by)({"devsite-mwc--disabled":this.disabled,"devsite-mwc--no-label":!this.label,"devsite-mwc--outlined":this.outlined,"devsite-mwc--focused":this.focused,"devsite-mwc--invalid":this.invalid,"devsite-mwc--floating":a!==""||this.focused})}">
        ${V4(this)} ${W4(this)}
        ${ita(this)}
      </label>
    `;case "textarea":return a=(0,_ds.by)({"devsite-mwc--no-label":!this.label,"devsite-mwc--outlined":this.outlined,"devsite-mwc--disabled":this.disabled,"devsite-mwc--focused":this.focused,"devsite-mwc--invalid":this.invalid,"devsite-mwc--floating":this.value!==""||this.focused}),b=V4(this),c=this.minLength===-1?void 0:this.minLength,d=this.maxLength===-1?void 0:this.maxLength,c=(0,_ds.O)`<textarea
      class="devsite-mwc-text-area__input"
      .value="${U4(this.value)}"
      ?disabled="${this.disabled}"
      ?required="${this.required}"
      ?readonly="${this.readOnly}"
      rows="${this.rows}"
      cols="${this.cols}"
      name="${_ds.iS(this.name===""?void 0:this.name)}"
      minlength="${c!=null?c:_ds.lN}"
      maxlength="${d!=null?d:_ds.lN}"
      @input="${this.ma}"
      @blur="${this.ea}"
      @focus="${this.oa}"
      @change="${this.j}"></textarea>`,(0,_ds.O)`
      <label class="devsite-mwc-text-area ${a}">
        ${b} ${c}
      </label>
      ${!this.charCounter&&this.maxLength?_ds.lN:(0,_ds.O)`<span class="devsite-mwc-character-counter"
      >${Math.min(this.value.length,this.maxLength)} / ${this.maxLength}</span
    >`}
    `;default:return(0,_ds.O)`<span>Invalid element type</span>`}}};_ds.v([_ds.Pt("input"),_ds.w("design:type",HTMLInputElement)],X4.prototype,"inputElement",void 0);_ds.v([_ds.Pt("select"),_ds.w("design:type",HTMLSelectElement)],X4.prototype,"ck",void 0);_ds.v([_ds.Pt("textarea"),_ds.w("design:type",HTMLTextAreaElement)],X4.prototype,"Tj",void 0);_ds.v([_ds.I({type:Boolean}),_ds.w("design:type",Object)],X4.prototype,"readOnly",void 0);
_ds.v([_ds.I({type:String}),_ds.w("design:type",Object)],X4.prototype,"kind",void 0);_ds.v([_ds.I({type:String}),_ds.w("design:type",String)],X4.prototype,"type",void 0);_ds.v([_ds.I({type:Boolean}),_ds.w("design:type",Object)],X4.prototype,"outlined",void 0);_ds.v([_ds.I({type:Boolean,Ka:!0}),_ds.w("design:type",Object)],X4.prototype,"required",void 0);_ds.v([_ds.I({type:Boolean,Ka:!0}),_ds.w("design:type",Object)],X4.prototype,"warning",void 0);
_ds.v([_ds.I({type:Boolean,Ka:!0}),_ds.w("design:type",Object)],X4.prototype,"disabled",void 0);_ds.v([_ds.I({type:String}),_ds.w("design:type",Object)],X4.prototype,"label",void 0);_ds.v([_ds.I({type:String}),_ds.w("design:type",Object)],X4.prototype,"icon",void 0);_ds.v([_ds.I({type:String}),_ds.w("design:type",Object)],X4.prototype,"placeholder",void 0);_ds.v([_ds.I({type:String}),_ds.w("design:type",Object)],X4.prototype,"value",void 0);
_ds.v([_ds.I({type:String}),_ds.w("design:type",Object)],X4.prototype,"name",void 0);_ds.v([_ds.I({type:Boolean}),_ds.w("design:type",Object)],X4.prototype,"focused",void 0);_ds.v([_ds.I({type:Boolean,Ka:!0}),_ds.w("design:type",Object)],X4.prototype,"invalid",void 0);_ds.v([_ds.I({type:Number}),_ds.w("design:type",Object)],X4.prototype,"rows",void 0);_ds.v([_ds.I({type:Number}),_ds.w("design:type",Object)],X4.prototype,"cols",void 0);
_ds.v([_ds.I({type:Number}),_ds.w("design:type",Object)],X4.prototype,"minLength",void 0);_ds.v([_ds.I({type:Number}),_ds.w("design:type",Object)],X4.prototype,"maxLength",void 0);_ds.v([_ds.I({type:Boolean}),_ds.w("design:type",Object)],X4.prototype,"charCounter",void 0);_ds.v([_ds.I({type:String,Ka:!0}),_ds.w("design:type",Object)],X4.prototype,"staticPath",void 0);try{customElements.define("devsite-mwc",X4)}catch(a){console.warn("Unrecognized DevSite custom element - DevsiteMwc",a)};})(_ds_www);
