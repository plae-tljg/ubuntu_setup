function getCookie (name) {
  let value = '; ' + document.cookie;
  let parts = value.split(`; ${name}=`);
  if (parts.length == 2) return parts.pop().split(';').shift();
}

document.addEventListener("DOMContentLoaded", function(event) { 
  var countryCookieName = 'nv_country_code';

  var country = getCookie(countryCookieName);

  if (typeof country === 'undefined') {
    fetch('https://geoip.svc.nvidia.com/json/')
      .then(response => response.json())
      .then(data => {
        document.cookie = countryCookieName + '=' + data.country_code + ';path=/;domain=.nvidia.com;expires=0;';
      });
  }
});
