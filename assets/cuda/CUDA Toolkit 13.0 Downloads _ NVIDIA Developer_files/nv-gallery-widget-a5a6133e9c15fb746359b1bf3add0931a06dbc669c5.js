function nvdLogin() {
  window.location = '/login';
}

function nvLogout() {

}

function getJWTToken() {
  return localStorage.getItem('STYXKEY_nv_jwt');
}

const countryCode = 'nv_country_code';

function fromChina() {
  if (window.Cookies) {
    return Cookies.get(countryCode) === 'CN';
  }

  return false;
}

const nodHost = () => {
  let tld = fromChina() ? 'cn' : 'com';
  return `https://api-prod.nvidia.${tld}`;
}

const createSessionURL = () => `${nodHost()}/nod/api/v1/kaltura/session/create`;
const deleteSessionURL = () => `${nodHost()}/nod/api/v1/kaltura/session/delete`;
const voltronApiURL = () => `${nodHost()}/services/nod/api/v1/`;
const apiURL = () => `${nodHost()}/search/graphql`;

function mountWidget(widget, baseConfig)   {
  const {
    id,
    destination,
    isFeatured,
    isFeaturedPlaylist,
    playlistId,
    hideTitle,
    openSessionInNewTab,
  } = widget;

  if (window.nodWidgetsRedrawMap.get(id) === false) {
    return;
  }

  const {lang, jwt, searchJwtToken, roles, site, destinationSite} = baseConfig;

  let {header} = widget;
  header = typeof header === "undefined" ? '' : header;

  try {
    NvidiaGalleryWidget.unmountById(id);
  } catch (e) {
  }

  const options = {
    elementId: id,
    searchInput: buildSearchInputParam(),
    site: site,
    destinationSite: destinationSite,
    destination: destination,
    language: lang,
    jwtToken: jwt,
    hideTitle: !!hideTitle,
    openSessionInNewTab: !!openSessionInNewTab,
    forChina: fromChina(),
    isFeatured,
    isFeaturedPlaylist,
    searchToken: searchJwtToken,
    accessRoles: roles,
    header: header,
    playlistId: playlistId,
    onLogin: () => {
      nvdLogin();
    },
    onLogout: () => {
      nvLogout();
    },
    apiUrl: apiURL(),
    voltronApiUrl: voltronApiURL(),
  };

  if (!document.getElementById(id)) {
    return;
  }

  window.nodWidgetsRedrawMap.set(id, false);
  NvidiaGalleryWidget.mount(options);
}

function initNodWidgets() {
  if (!window['NvidiaGalleryWidget'] || !window.nodWidgets.size) {
    return;
  }

  let roles = '';
  let searchJwtToken = '';

  if (typeof Cookies.get('nv.profile') !== 'undefined') {
    const nvProfile = JSON.parse(decodeURI(atob(Cookies.get('nv.profile'))));
    searchJwtToken = nvProfile['jwtToken'];
    roles = nvProfile['nv.program'];
  }

  let jwt = '';
  const styxkey = getJWTToken();
  if (styxkey) {
    jwt = styxkey;
  }

  const baseConfig = {
    site: 'https://www.nvidia.com',
    destinationSite: 'https://www.nvidia.com',
    lang: fromChina() ? 'zh-cn' : 'en-us',
    jwt,
    searchJwtToken,
    roles,
  };

  window.nodWidgets.forEach((widget) => {
    mountWidget(widget, baseConfig);
  });
}

function buildSearchInputParam() {
  return {
    query: '-',
    maxResults: 12,
  };
}

function setupNodWidgets(event) {
  const {detail} = event;
  window.nodWidgets.set(detail.id, detail);

  const styxkey = getJWTToken();
  const requestDefaults = {
    xhrFields: {
      withCredentials: true
    }
  };

  if (styxkey !== null) {
    jQuery.ajax({
      url: createSessionURL(),
      headers: {'Authorization': `Bearer ${styxkey}`},
      ...{requestDefaults}
    }).always(initNodWidgets);
    return;
  }

  if (typeof Cookies.get('nv.profile') === 'undefined') {
    initNodWidgets();
    return;
  }

  jQuery.ajax({
    url: deleteSessionURL(),
    ...{requestDefaults}
  }).always(initNodWidgets);
}

window.nodWidgets = window.nodWidgets || new Map([]);
window.nodWidgetsRedrawMap = window.nodWidgetsRedrawMap || new Map([]);

document.addEventListener('GalleryWidgetSetup', setupNodWidgets);
