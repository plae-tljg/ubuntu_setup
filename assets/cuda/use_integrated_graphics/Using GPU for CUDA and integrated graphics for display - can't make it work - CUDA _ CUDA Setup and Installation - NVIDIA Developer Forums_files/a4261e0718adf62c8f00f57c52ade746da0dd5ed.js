(function () {
  var didInit = false;
  function initMunchkin() {
    if (didInit === false) {
      didInit = true;
      Munchkin.init("156-OFN-742");
    }
  }
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.async = true;
  s.src = "//munchkin.marketo.net/munchkin.js";
  s.onreadystatechange = function () {
    if (this.readyState == "complete" || this.readyState == "loaded") {
      initMunchkin();
    }
  };
  s.onload = initMunchkin;
  document.getElementsByTagName("head")[0].appendChild(s);
})();
//# sourceMappingURL=a4261e0718adf62c8f00f57c52ade746da0dd5ed.map?__ws=forums.developer.nvidia.com
