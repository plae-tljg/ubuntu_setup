$bu=function(){if(navigator&&navigator.userAgent){var e=navigator.userAgent
if(e.indexOf("Googlebot")>=0||e.indexOf("Mediapartners")>=0||e.indexOf("AdsBot")>=0)return}if(window.unsupportedBrowser){document.getElementsByTagName("body")[0].className+=" crawler"
for(var t=document.getElementsByTagName("noscript"),o=t.length-1;o>=0;o--){for(var r=t[o],n="",a=0;a<r.childNodes.length;a++)n+=r.childNodes[a].nodeValue
r.getAttribute("data-path")?document.getElementById("main").outerHTML=n:r.outerHTML=n}var i=window.I18n&&I18n.t("browser_update")
i&&-1===i.indexOf(".browser_update]")||(i='Unfortunately, <a href="https://discourse.org/about#browser">your browser is unsupported</a>. Please <a href="https://browsehappy.com">switch to a supported browser</a> to view rich content, log in and reply.')
var d=document.createElement("div")
d.className="buorg",d.innerHTML="<div>"+i+"</div>"
var s=document.createElement("style"),u=".buorg {position:absolute; z-index:111111; width:100%; top:0px; left:0px; background:#FDF2AB; text-align:left; font-family: sans-serif; color:#000; font-size: 14px;} .buorg div {padding: 8px;} .buorg a, .buorg a:visited {color:#E25600; text-decoration: underline;} @media print { .buorg { display: none !important; } }"
document.body.appendChild(d),document.getElementsByTagName("head")[0].appendChild(s)
try{s.innerText=u,s.innerHTML=u}catch(l){try{s.styleSheet.cssText=u}catch(c){return}}document.body.style.marginTop=d.clientHeight+"px"}}()

//# sourceMappingURL=browser-update-f44b00fd.map