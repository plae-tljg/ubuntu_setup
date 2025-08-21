window.CTCWP=(function(window,document,navigator){var textArea,copy;function isOS(){return navigator.userAgent.match(/ipad|iphone/i)}
function createTextArea(text){textArea=document.createElement('textArea');textArea.value=text;document.body.appendChild(textArea)}
function selectText(){var range,selection;if(isOS()){range=document.createRange();range.selectNodeContents(textArea);selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);textArea.setSelectionRange(0,999999)}else{textArea.select()}}
function copyToClipboard(){document.execCommand('copy');document.body.removeChild(textArea);if(typeof copyTheCode!=='undefined'&&copyTheCode.redirect_url){window.location.href=copyTheCode.redirect_url}}
copy=function(text){createTextArea(text);selectText();copyToClipboard()}
copySelection=function(source){const selection=window.getSelection()
const range=document.createRange()
range.selectNodeContents(source[0])
selection.removeAllRanges()
selection.addRange(range)
document.execCommand('copy')
selection.removeAllRanges()}
return{copy:copy,copySelection:copySelection,}})(window,document,navigator)