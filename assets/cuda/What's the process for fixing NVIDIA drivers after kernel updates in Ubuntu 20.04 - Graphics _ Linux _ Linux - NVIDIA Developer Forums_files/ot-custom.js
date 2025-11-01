
const NvCookies = {
    get(name) {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const [key, value] = cookies[i].split('=');
            if (key === name) {
                return decodeURIComponent(value);
            }
        }
        return undefined; // Return undefined if the cookie doesn't exist
    },

    set(name, value, options = {}) {
        let cookieString = `${name}=${encodeURIComponent(value)}`;
        if (options.expires) {
            if (typeof options.expires === 'number') {
                const date = new Date();
                date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
                options.expires = date.toUTCString();
            }
            cookieString += `; expires=${options.expires}`;
        }
        if (options.path) {
            cookieString += `; path=${options.path}`;
        }
        if (options.domain) {
            cookieString += `; domain=${options.domain}`;
        }
        if (options.secure) {
            cookieString += '; secure';
        }
        document.cookie = cookieString;
    }
};


/* below Event listener checks the loaded in iframe hide the banner */
window.addEventListener('bannerLoaded', function otcustomcallback() {
    const banner = document.getElementById('onetrust-consent-sdk');
    if (window.location !== window.parent.location) {   
        if (banner) {
            banner.style.display = 'none';
        }
    }
    /* if user agent contains any AI bot identifier, close the banner WEB0-73354 */
    if (isAIBotUserAgent()) {
        if (banner) {
            banner.style.display = 'none';
        }
    }


    const translations = {
        "en": { "done": "Done" },
        "en-us": { "done": "Done" },
        "zh-cn": { "done": "完成" },
        "zh-hans": { "done": "完成" },
        "zh-hant": { "done": "完成" },
        "zh-tw": { "done": "完成" },
        "ja-jp": { "done": "完了する" },
        "ja": { "done": "完了する" },
        "ko-kr": { "done": "완료" },
        "en-in": { "done": "Done" },
        "en-au": { "done": "Done" },
        "en-sg": { "done": "Done" },
        "id-id": { "done": "Selesai" },
        "th-th": { "done": "เสร็จสิ้น" },
        "vi-vn": { "done": "done" },
        "en-ph": { "done": "Done" },
        "en-my": { "done": "Done" },
        "en-gb": { "done": "Done" },
        "cs-cz": { "done": "Hotovo" },
        "da-dk": { "done": "Udført" },
        "de-de": { "done": "Fertig" },
        "es-es": { "done": "Hecho" },
        "fi-fi": { "done": "Valmis" },
        "fr-fr": { "done": "Terminé" },
        "it-it": { "done": "Fine" },
        "nb-no": { "done": "Ferdig" },
        "nl-nl": { "done": "Gereed" },
        "pl-pl": { "done": "Gotowe" },
        "ro-ro": { "done": "Gata" },
        "ru-ru": { "done": "Готово" },
        "sv-se": { "done": "Klart" },
        "tr-tr": { "done": "Bitti" },
        "fr-be": { "done": "Terminé" },
        "de-at": { "done": "Fertig" },
        "en-eu": { "done": "Done" },
        "en-me": { "done": "Done" },
        "es-la": { "done": "Listo" },
        "pt-br": { "done": "Concluído" }
    }

    const setNvDone = function () {
        var acceptbtn = document.getElementById('onetrust-accept-btn-handler');
        var rejectbtn = document.getElementById('onetrust-reject-all-handler');
        var btngroup = document.getElementById('onetrust-button-group');
        var isdoneBtn = document.getElementById('nv-done-btn-handler');
        var cookiebanner = document.getElementById('onetrust-consent-sdk');

        if (acceptbtn) {
            acceptbtn.style.display = 'none';
        }
        if (rejectbtn) {
            rejectbtn.style.display = 'none';
        }

        if (!isdoneBtn) {
            const lang = document.documentElement.lang.toLowerCase() || 'en';
            const doneButton = document.createElement('button');
            doneButton.id = 'nv-done-btn-handler';
            doneButton.textContent = translations[lang]?.done || translations['en'].done || 'Done';
            if (btngroup) {
                document.getElementById('onetrust-button-group').appendChild(doneButton);
            }
        }
        const doneBtnevnt = document.getElementById('nv-done-btn-handler');
        doneBtnevnt.addEventListener('click', function () {
            if(cookiebanner) {
                OneTrust.RejectAll();
            }
        });

    };

    /* if gpc enabled then setting the Done button with translations */
    function isGPCEnabled() {
        return navigator.globalPrivacyControl === true;
    }

    if (isGPCEnabled() && !(OneTrust.IsAlertBoxClosed())) {
        setNvDone();
    }

    // Function to parse query parameters from URL
    function getQueryParam(param) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param);
    }

    var manageCookiesLink = document.getElementById("manage-nvcookies-link");
    if (manageCookiesLink) {
        manageCookiesLink.addEventListener('click', function () {
            OneTrust.ToggleInfoDisplay();
        });
    }

    var showprefPanel = getQueryParam('manage-cookies');
    if (showprefPanel === 'true') {
        setTimeout(function () {
            OneTrust.ToggleInfoDisplay();
        }, 1000);
    }

    /* **************** */
    function isValidLoginDataAvailable(key) {
        try {
            const value = localStorage.getItem(key);
            if (value) {
                const item = JSON.parse(value);
                if (item.expiration) {
                    const expirationDate = new Date(item.expiration);
                    const currentDate = new Date();
                    if (expirationDate > currentDate) {
                        return item;
                    } else {
                        console.log('LocalStorage item has expired.');
                        localStorage.removeItem(key);
                        return null;
                    }
                } else {
                    console.log('LocalStorage item does not have an expiration date.');
                    return item; // Or false, depending on your requirement
                }
            } else {
                return null;
            }
        } catch (e) {
            console.error('Error parsing localStorage item:', e);
            return null;
        }
    }


    /* ************ */
    function preferenceGetRequest(url, headers) {
        return fetch(url, {
            method: 'GET',
            headers: headers,
            credentials: 'omit'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error in preferenceGetRequest:', error);
            throw error;
        });
    }

    /* ************ */

    function postPreferenceRequest(url, headers, data) {
        return fetch(url, {
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'omit',
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error in postPreferenceRequest:', error);
            throw error;
        });
    }

    function deleteDateProps(obj) {
        if (obj) {
            ['createAt', 'updatedAt', 'subscribedAt'].forEach(prop => {
                if (prop in obj) {
                    delete obj[prop];
                }
            });
        }
    }
    /* ************ */
    // Helper function to get user email from login data
    function getUserEmail(loginData) {
        try {
            if (loginData && loginData.id_token) {
                // Decode JWT token to get email
                const tokenParts = loginData.id_token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    return payload.email || payload.sub || null;
                }
            }
        } catch (e) {
            console.error('Error extracting email from token:', e);
        }
        return null;
    }
    
    // Helper function to check if user has completed action
    function hasUserCompletedAction(cookieName, currentUserEmail) {
        const cookieValue = NvCookies.get(cookieName);
        if (!cookieValue) {
            return false;
        }
        
        try {
            const data = JSON.parse(cookieValue);
            // Check if the stored email matches current user
            return data.email === currentUserEmail && data.completed === true;
        } catch (e) {
            // If parsing fails, treat as old format (just 'true')
            // Return false to trigger the action again with new format
            console.log(`Cookie ${cookieName} in old format, will update`);
            return false;
        }
    }
    
    // Helper function to set user completed action
    function setUserCompletedAction(cookieName, userEmail, options = {}) {
        const data = {
            email: userEmail,
            completed: true,
            timestamp: new Date().toISOString()
        };
        NvCookies.set(cookieName, JSON.stringify(data), options);
    }
    
    function checkAndUpdateData() {
        const isOneTrustClosed = OneTrust.IsAlertBoxClosed();

        if (!isOneTrustClosed) {
            const validLoginData = isValidLoginDataAvailable('acctFederationData');
            const gpcEnabled = isGPCEnabled();
            
            if (validLoginData && gpcEnabled) {
                const currentUserEmail = getUserEmail(validLoginData);
                
                if (!currentUserEmail) {
                    console.log('Could not extract user email from login data');
                    return;
                }
                
                console.log(`Checking preferences for user: ${currentUserEmail}`);
                
                // Check if current user has already updated preferences
                const isPrefUpdated = hasUserCompletedAction('isPrefUpdated', currentUserEmail);
                
                if (!isPrefUpdated) {
                const url = 'https://api-prod.nvidia.com/services/preferences-service/api/v1/users/me/preferences';
                let headers = {
                    'idtoken': validLoginData.id_token,
                    'access-token': validLoginData.access_token,
                    'X-Client': 'gpc'
                }
                preferenceGetRequest(url, headers)
                    .then(function (data) {
                        console.log("Preference Data", data);

                        if (data.gpcOverride === null || data.gpcOverride === false) {
                            if (OneTrust.GetDomainData().ConsentModel.Name === 'opt-out') {
                                var prefLoginGpc = document.getElementById('nv-pref-login-gpc-text');
                                var prefLoginGpcOpted = document.getElementById('nv-pref-login-gpc-text-opted');
                                var gpcText = document.getElementById('nv-gpc-text');

                                if (!data.interestBasedAds) {
                                    data.interestBasedAds = { 'subscribed': false };
                                }

                                if (!data.targetedAdsOptIn) {
                                    data.targetedAdsOptIn = { 'subscribed': false };
                                }

                                if (data.interestBasedAds.subscribed === true || data.targetedAdsOptIn.subscribed === true) {
                                    if (gpcText) gpcText.style.display = 'none';
                                    if (prefLoginGpcOpted) prefLoginGpcOpted.style.display = 'block';
                                } else {
                                    if (gpcText) gpcText.style.display = 'none';
                                    if (prefLoginGpc) prefLoginGpc.style.display = 'block';
                                }
                            }

                            data.gpcOverride = true;
                            data.interestBasedAds.subscribed = false;
                            data.targetedAdsOptIn.subscribed = false;
                            let areasOfInterests = data.areasOfInterest.map(area => area.machineName);
                            data.areasOfInterest = areasOfInterests;
                            ['developer', 'enterprise', 'startups', 'gaming'].forEach(key => {
                                deleteDateProps(data[key]);
                            });
                            console.log('Updated Data', data);
                            postPreferenceRequest(url, headers, data)
                                .then(function (res) {
                                    // Store preference updated with user email
                                    setUserCompletedAction('isPrefUpdated', currentUserEmail, { 
                                        expires: 365,
                                        path: '/',
                                        domain: window.location.hostname.includes('.nvidia.com') ? '.nvidia.com' : undefined
                                    });
                                    console.log(`Preference updated successfully for user: ${currentUserEmail}`, res);
                                })
                                .catch(function (error) {
                                    console.error("error", error);
                                });
                        }

                    })
                    .catch(function (error) {
                        console.error("error", error);
                    });
            
                // Call do-not-share API with hCaptcha verification (pass user email)
                loadHCaptchaAndExecute(currentUserEmail);
                }
            }
        }

    }
    
    // Function to dynamically load hCaptcha script and setup container
    function loadHCaptchaAndExecute(userEmail) {
        // Check if hCaptcha script already exists
        const existingScript = document.querySelector('script[src*="hcaptcha.com"]');
        
        if (!existingScript) {
            // Create and append hCaptcha script to head
            const hcaptchaScript = document.createElement('script');
            hcaptchaScript.src = 'https://js.hcaptcha.com/1/api.js';
            hcaptchaScript.async = true;
            hcaptchaScript.defer = true;
            
            // Add onload event to know when script is ready
            hcaptchaScript.onload = function() {
                console.log('hCaptcha script loaded successfully');
                setupContainerAndExecute(userEmail);
            };
            
            hcaptchaScript.onerror = function() {
                console.error('Failed to load hCaptcha script');
            };
            
            document.head.appendChild(hcaptchaScript);
            console.log('hCaptcha script added to head');
        } else {
            console.log('hCaptcha script already exists');
            // If script exists, check if hcaptcha is available
            if (typeof hcaptcha !== 'undefined') {
                setupContainerAndExecute(userEmail);
            } else {
                // Wait for hcaptcha to be available
                waitForHCaptcha(function() {
                    setupContainerAndExecute(userEmail);
                });
            }
        }
    }
    
    // Function to setup container and execute hCaptcha
    function setupContainerAndExecute(userEmail) {
        // Check if container already exists
        let hcaptchaContainer = document.getElementById('hcaptcha-container');
        
        if (!hcaptchaContainer) {
            // Create and append hCaptcha container to body
            hcaptchaContainer = document.createElement('div');
            hcaptchaContainer.id = 'hcaptcha-container';
            hcaptchaContainer.style.display = 'none';
            document.body.appendChild(hcaptchaContainer);
            console.log('hCaptcha container added to body');
        } else {
            console.log('hCaptcha container already exists');
        }
        
        // Wait for hcaptcha to be fully available, then execute
        waitForHCaptcha(function() {
            executeWithHCaptcha(userEmail);
        });
    }
    
    // Function to wait for hCaptcha to be available
    function waitForHCaptcha(callback) {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait time
        
        const checkHCaptcha = setInterval(function() {
            attempts++;
            
            if (typeof hcaptcha !== 'undefined') {
                clearInterval(checkHCaptcha);
                console.log('hCaptcha is ready');
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkHCaptcha);
                console.error('hCaptcha failed to load after 5 seconds');
            }
        }, 100); // Check every 100ms
    }
    
    // Function to execute hCaptcha and call do-not-share API
    function executeWithHCaptcha(userEmail) {
        const hCaptchaSiteKey = '77d885a8-5f36-43b2-96cc-76d21266da74';
        
        // Check if hcaptcha is loaded
        if (typeof hcaptcha === 'undefined') {
            console.error('hCaptcha library not loaded');
            return;
        }
        
        // Render invisible hCaptcha
        const widgetId = hcaptcha.render('hcaptcha-container', {
            sitekey: hCaptchaSiteKey,
            size: 'invisible',
            callback: function(token) {
                // This callback is triggered when hCaptcha is solved
                console.log('hCaptcha token received');
                callDoNotShareAPI(token, hCaptchaSiteKey, userEmail);
            },
            'error-callback': function(error) {
                console.error('hCaptcha error:', error);
            },
            'expired-callback': function() {
                console.warn('hCaptcha token expired');
            }
        });
        
        // Execute the invisible hCaptcha
        hcaptcha.execute(widgetId);
    }
    
    // Function to call do-not-share API with hCaptcha token
    function callDoNotShareAPI(hCaptchaToken, hCaptchaSiteKey, userEmail) {
        const validLoginData = isValidLoginDataAvailable('acctFederationData');
        
        if (!validLoginData) {
            console.error('No valid login data available');
            return;
        }
        
        const doNotShareUrl = 'https://api-prod.nvidia.com/services/voltron/v1/user/do-not-share';
        const doNotShareHeaders = {
            'Content-Type': 'application/json'
        };
        const doNotShareData = {
            'hCaptchaResponse': hCaptchaToken,
            'idtoken': validLoginData.id_token,
            'source': hCaptchaSiteKey
        };
        
        postDoNotShareRequest(doNotShareUrl, doNotShareHeaders, doNotShareData)
            .then(function (res) {
                console.log(`Do-not-share preference updated successfully for user: ${userEmail}`, res);
                // Show success modal with user email
                showDoNotShareSuccessModal(userEmail);
                OneTrust.RejectAll();
            })
            .catch(function (error) {
                console.error('Error updating do-not-share preference', error);
            });
    }
    
    // Add new function to handle do-not-share API call
    function postDoNotShareRequest(url, headers, data) {
        return fetch(url, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'omit',
            mode: 'cors'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Hide banner on success
            const banner = document.getElementById('onetrust-consent-sdk');
            if (banner) {
                banner.style.display = 'none';
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error in postDoNotShareRequest:', error);
            throw error;
        });
    }

    // Function to create and show success modal
    function showDoNotShareSuccessModal(userEmail) {
        // Check if current user has already seen the modal
        const hasSeenModal = hasUserCompletedAction('doNotShareModalShown', userEmail);
        if (hasSeenModal) {
            console.log(`User ${userEmail} has already seen the do-not-share success modal`);
            return;
        }

        // Get current language from HTML lang attribute
        const currentLang = document.documentElement.lang || 'en-us';
        
        // Translations for modal content
        const translations = {
            'cs-cz': {
                title: 'Success!',
                message: 'Nyní jste odhlášeni z „prodeje“ a „sdílení“ osobních údajů (získaných jinak než prostřednictvím souborů cookie) pro účely zájmově orientované reklamy. Chcete-li vyjádřit výslovný nesouhlas s „prodejem“ a „sdílením“ osobních údajů pro účely zájmově orientované reklamy prostřednictvím souborů cookie a dalších sledovacích technologií, aktualizujte <a href="https://www.nvidia.com/cs-cz/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Nastavení souborů cookie</a>.'
            },
            'da-dk': {
                title: 'Success!',
                message: 'Du har nu fravalgt "salg" og "deling" af ikke-cookiebaserede personlige oplysninger til interessebaserede reklameformål. For at fravælge "salg" og "deling" af personlige oplysninger til interessebaserede reklameformål via cookies og andre sporingsteknologier, skal du opdatere din <a href="https://www.nvidia.com/da-dk/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookieindstillinger</a>.'
            },
            'de-de': {
                title: 'Success!',
                message: 'Ihre personenbezogenen Daten, die nicht mit Cookies erfasst werden, sind nun vom „Verkauf“ und der „Weitergabe“ für interessenbezogene Werbezwecke ausgeschlossen. Um den „Verkauf“ und die „Weitergabe“ personenbezogener Daten für interessenbezogene Werbezwecke durch Cookies und andere Tracking-Technologien abzulehnen, aktualisieren Sie bitte Ihre <a href="https://www.nvidia.com/de-de/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie-Einstellungen</a>.'
            },
            'en-gb': {
                title: 'Success!',
                message: 'You are now opted out of non-cookie personal data "sales" and "sharing" for interest-based advertising purposes. To opt out of personal data "sales" and "sharing" for interest-based advertising purposes through cookies and other tracking technologies, please update your <a href="https://www.nvidia.com/en-gb/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a>.'
            },
            'en-in': {
                title: 'Success!',
                message: 'You are now opted out of non-cookie personal data "sales" and "sharing" for interest-based advertising purposes. To opt out of personal data "sales" and "sharing" for interest-based advertising purposes through cookies and other tracking technologies, please update your <a href="https://www.nvidia.com/en-in/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a>.'
            },
            'en-au': {
                title: 'Success!',
                message: 'You are now opted out of non-cookie personal data "sales" and "sharing" for interest-based advertising purposes. To opt out of personal data "sales" and "sharing" for interest-based advertising purposes through cookies and other tracking technologies, please update your <a href="https://www.nvidia.com/en-au/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a>.'
            },
            'en-sg': {
                title: 'Success!',
                message: 'You are now opted out of non-cookie personal data "sales" and "sharing" for interest-based advertising purposes. To opt out of personal data "sales" and "sharing" for interest-based advertising purposes through cookies and other tracking technologies, please update your <a href="https://www.nvidia.com/en-sg/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a>.'
            },
            'en-eu': {
                title: 'Success!',
                message: 'You are now opted out of non-cookie personal data "sales" and "sharing" for interest-based advertising purposes. To opt out of personal data "sales" and "sharing" for interest-based advertising purposes through cookies and other tracking technologies, please update your <a href="https://www.nvidia.com/en-eu/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a>.'
            },
            'en-us': {
                title: 'Success!',
                message: 'You are now opted out of non-cookie personal data "sales" and "sharing" for interest-based advertising purposes. To opt out of personal data "sales" and "sharing" for interest-based advertising purposes through cookies and other tracking technologies, please update your <a href="https://www.nvidia.com/en-us/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a>.'
            },
            'es-es': {
                title: 'Success!',
                message: 'Ahora mismo está de baja en el “uso compartido” y “venta” de datos personales distintos de cookies para fines de publicidad basada en intereses. Para darse de baja en el “uso compartido” y “venta” de datos personales para fines de publicidad basada en intereses a través de cookies y otras tecnologías de seguimiento, actualice su <a href="https://www.nvidia.com/es-es/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Configuración de cookies</a>.'
            },
            'fi-fi': {
                title: 'Success!',
                message: 'Olet nyt kieltäytynyt henkilötietojen "myynnistä" ja "jakamisesta" kiinnostuksen kohteisiin perustuvassa mainonnassa, jossa ei käytetä evästeitä. Jos haluat kieltäytyä henkilötietojen "myynnistä" ja "jakamisesta" kiinnostuksen kohteisiin liittyvässä mainonnassa evästeiden ja muiden seurantatekniikoiden avulla, päivitä <a href="https://www.nvidia.com/fi-fi/about-nvidia/cookie-policy/#choices" target="_blank" style="color: #76b900; text-decoration: none; font-weight: 500;">Evästeasetukset</a>.'
            },
            'fr-fr': {
                title: 'Success!',
                message: 'La vente et le partage des données personnelles non liées aux cookies à des fins de publicité ciblée par centres d\'intérêt ont été désactivés pour votre compte. Pour désactiver la vente et le partage des données personnelles à des fins de publicité ciblée par centres d\'intérêt par le biais de cookies et d’autres technologies de suivi, veuillez mettre à jour votre <a href="https://www.nvidia.com/fr-fr/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Paramètres des cookies</a>.'
            },
            'id-id': {
                title: 'Success!',
                message: 'Anda sekarang tidak ikut serta dalam “penjualan” dan “pembagian” data pribadi non-cookie untuk tujuan periklanan berbasis minat. Untuk tidak ikut serta dalam “penjualan” dan “pembagian” data pribadi untuk tujuan periklanan berbasis minat melalui cookie dan teknologi pelacakan lainnya, perbarui <a href="https://www.nvidia.com/id-id/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a> Anda.'
            },
            'it-it': {
                title: 'Success!',
                message: 'Hai revocato il consenso alla "vendita" e alla "condivisione" di dati personali non cookie per scopi pubblicitari basati sugli interessi. Per revocare il consenso alla “vendita” e alla “condivisione” dei dati personali per scopi pubblicitari basati sugli interessi tramite cookie e altre tecnologie di tracciamento, aggiorna <a href="https://www.nvidia.com/it-it/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Impostazioni dei cookie</a>.'
            },
            'ja-jp': {
                title: 'Success!',
                message: 'あなたはこれで、興味に基づいた広告目的の個人データ (クッキーを除く) の「販売」および「共有」からオプトアウトしたことになります。 クッキーやその他の追跡技術による興味に基づく広告目的の個人データの「販売」および「共有」をオプトアウトするには、<a href="https://www.nvidia.com/ja-jp/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie の設定</a> を更新してください。'
            },
            'ko-kr': {
                title: 'Success!',
                message: '관심사 기반 광고 목적으로 비 쿠키 개인 데이터를 "판매" 및 "공유"하는 것이 거부되었습니다. 쿠키 및 기타 추적 기술을 통한 관심사 기반 광고 목적으로 개인 데이터를 "판매" 및 "공유"하는 것을 거부하려면 <a href="https://www.nvidia.com/ko-kr/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">개인정보 선호 센터</a>을 업데이트하십시오.'
            },
            'nb-no': {
                title: 'Success!',
                message: 'Du har nå valgt bort «salg» og «deling» av personopplysninger for interessebaserte annonser. Hvis du vil velge bort «salg» og «deling» av personopplysninger for interessebaserte annonser gjennom informasjonskapsler og andre sporingsteknologier, må du oppdatere <a href="https://www.nvidia.com/nb-no/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Innstillinger for informasjonskapsler</a>.'
            },
            'nl-nl': {
                title: 'Success!',
                message: 'Je bent nu afgemeld voor de \'verkoop\' en het \'delen\' van persoonlijke gegevens zonder cookies voor op interesses gebaseerde reclamedoeleinden. Om je af te melden voor de \'verkoop\' en het \'delen\' van persoonlijke gegevens voor op interesses gebaseerde advertentiedoeleinden via cookies en andere trackingtechnologieën, moet je je <a href="https://www.nvidia.com/nl-nl/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie-instellingen</a> bijwerken.'
            },
            'pl-pl': {
                title: 'Success!',
                message: 'Zrezygnowano z wykorzystania plików cookie do „sprzedaży” i „udostępniania” danych osobowych w celach reklamowych opartych na zainteresowaniach. Aby zrezygnować z wykorzystywania plików cookie i innych technologii monitorowania do „sprzedaży” i „udostępniania” danych osobowych w celach reklamowych opartych na zainteresowaniach, należy zaktualizować <a href="https://www.nvidia.com/pl-pl/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Ustawienia plików cookie</a>.'
            },
            'pt-pt': {
                title: 'Success!',
                message: 'Agora, desativou a “venda” e a “partilha” de dados pessoais não relacionados com cookies para fins de publicidade baseada em interesses. Para desativar a “venda” e a “partilha” de dados pessoais para fins de publicidade baseada em interesses através de cookies e outras tecnologias de monitorização, atualize o seu <a href="https://www.nvidia.com/pt-pt/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a>.'
            },
            'ro-ro': {
                title: 'Success!',
                message: 'Acum ai renunțat la „vânzarea” și „partajarea” datelor cu caracter personal în scopuri de publicitate bazată pe interese care nu se livrează prin intermediul cookie-urilor. Pentru renunța la „vânzarea” și „partajarea” datelor cu caracter personal în scopuri de publicitate bazată pe interese prin intermediul cookie-urilor și al altor tehnologii de monitorizare, actualizează <a href="https://www.nvidia.com/ro-ro/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Setări cookie-uri</a>.'
            },
            'sv-se': {
                title: 'Success!',
                message: 'Du har nu valt bort "försäljning" och "delning" av personuppgifter som inte är cookies för intressebaserade annonseringsändamål. För att välja bort "försäljning" och "delning" av personuppgifter för intressebaserade annonseringsändamål via cookies och annan spårningsteknik, uppdatera din <a href="https://www.nvidia.com/sv-se/about-nvidia/cookie-policy/#choices" id="openCookieSettings" target="_blank" style="color: #76b900; text-decoration: none; font-weight: 500;">Inställningar för cookies</a>.'
            },
            'th-th': {
                title: 'Success!',
                message: 'คุณได้ยก้เลิกการขายและการแบ่งปันข้อมูลส่วนบุคคลที่ไม่ใช่คุกกี้สําหรับวัตถุประสงค์การโฆษณาตามความสนใจแล้ว หากต้องการยกเลิกการขายและการแบ่งปันข้อมูลส่วนบุคคลเพื่อวัตถุประสงค์การโฆษณาตามความสนใจผ่านคุกกี้และเทคโนโลยีการติดตามอื่น ๆ โปรดอัปเดต <a href="https://www.nvidia.com/th-th/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a> ของคุณ'
            },
            'tr-tr': {
                title: 'Success!',
                message: 'Artık ilgi alanlarına dayalı reklamcılık amaçları için çerez dışı kişisel veri "satışını" ve "paylaşımını" devre dışı bıraktınız. Çerezler ve diğer izleme teknolojileri aracılığıyla ilgi alanlarına dayalı reklamcılık amaçları için kişisel veri "satışını" ve "paylaşımını" devre dışı bırakmak için lütfen <a href="https://www.nvidia.com/tr-tr/about-nvidia/cookie-policy/#choices" id="openCookieSettings" target="_blank" style="color: #76b900; text-decoration: none; font-weight: 500;">Çerez Ayarları</a> güncelleyin.'
            },
            'uk-ua': {
                title: 'Success!',
                message: 'Тепер ви відмовляєтеся від персональних даних щодо «продажу» та «поширення», не пов\'язаних з файлами cookie, з метою реклами на основі вподобань. Щоб відмовитися від персональних даних щодо «продажу» та «поширення» з метою реклами на основі вподобань за допомогою файлів cookie та інших технологій відстеження, оновіть свої налаштування <a href="https://www.nvidia.com/uk-ua/about-nvidia/cookie-policy/#choices" id="openCookieSettings" target="_blank" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a>.'
            },
            'vi-vn': {
                title: 'Success!',
                message: 'Hiện bạn đã từ chối "bán" và "chia sẻ" dữ liệu cá nhân không phải cookie cho mục đích quảng cáo dựa trên sở thích. Để từ chối "bán" và "chia sẻ" dữ liệu cá nhân cho mục đích quảng cáo dựa trên sở thích thông qua cookie và các công nghệ theo dõi khác, vui lòng cập nhật <a href="https://www.nvidia.com/vi-vn/about-nvidia/cookie-policy/#choices" id="openCookieSettings" target="_blank" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a> của bạn.'
            },
            'zh-tw': {
                title: 'Success!',
                message: '你現在已停止透過 Cookie「銷售」和「共享」個人資料來用於興趣導向廣告。 如要停止透過 Cookie 和其他追蹤技術「銷售」和「共享」個人資料來用於興趣導向廣告，請更新你的 <a href="https://www.nvidia.com/zh-tw/about-nvidia/cookie-policy/#choices" id="openCookieSettings" target="_blank" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie 設定</a>。'
            },
            'es-la': {
                title: 'Success!',
                message: 'You are now opted out of non-cookie personal data "sales" and "sharing" for interest-based advertising purposes. To opt out of personal data "sales" and "sharing" for interest-based advertising purposes through cookies and other tracking technologies, please update your <a href="https://www.nvidia.com/es-la/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a>.'
            },
            'pt-br': {
                title: 'Success!',
                message: 'You are now opted out of non-cookie personal data "sales" and "sharing" for interest-based advertising purposes. To opt out of personal data "sales" and "sharing" for interest-based advertising purposes through cookies and other tracking technologies, please update your <a href="https://www.nvidia.com/pt-br/about-nvidia/cookie-policy/#choices" target="_blank" id="openCookieSettings" style="color: #76b900; text-decoration: none; font-weight: 500;">Cookie Settings</a>.'
            }
        };
        
        // Get translation for current language, fallback to en-us if not found
        const t = translations[currentLang] || translations['en-us'];
        
        console.log(`Do-not-share modal using language: ${currentLang}`);

        // Create modal HTML
        const modalHTML = `
            <div id="doNotShareModal" style="
                display: flex;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                justify-content: center;
                align-items: center;
                ">
                <div style="
                    background-color: #ffffff;
                    padding: 32px;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 90%;
                    position: relative;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                ">
                    <button 
                        id="closeDoNotShareModal" 
                        style="
                        position: absolute; 
                        top: 16px; 
                        right: 16px;
                        background: transparent;
                        border: none;
                        font-size: 28px;
                        cursor: pointer;">
                            <span class="fa-light fa-xmark"></span>
                    </button>
                    <p style="
                        margin: 0;
                        font-size: 28px;
                        font-weight: 600;
                        color: #000;
                    ">${t.title}</p>
                    <p style="
                        margin: 0 0 16px 0;
                        font-size: 15px;
                        line-height: 1.6;
                        color: #333;
                    ">
                        ${t.message}
                    </p>
                </div>
            </div>
        `;

        // Insert modal into body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get modal element
        const modal = document.getElementById('doNotShareModal');
        const closeBtn = document.getElementById('closeDoNotShareModal');
        const cookieSettingsLink = document.getElementById('openCookieSettings');

        // Close modal function
        function closeModal() {
            if (modal) {
                modal.style.display = 'none';
                modal.remove();
            }
            // Store modal shown with user email (expires in 1 year)
            setUserCompletedAction('doNotShareModalShown', userEmail, { 
                expires: 365, 
                path: '/',
                domain: window.location.hostname.includes('.nvidia.com') ? '.nvidia.com' : undefined
            });
            console.log(`Modal shown recorded for user: ${userEmail}`);
            OneTrust.RejectAll();
        }

        // Close button event
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Close when clicking outside modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Cookie Settings link event
        //if (cookieSettingsLink) {
        //    cookieSettingsLink.addEventListener('click', function(e) {
        //        e.preventDefault();
        //        closeModal();
        //    });
        //}

        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal) {
                closeModal();
            }
        });
    }

    checkAndUpdateData();

}, false);

/**
 * Function to identify if user agent contains any AI bot identifiers
 * @returns {boolean} True if user agent contains AI bot identifier, false otherwise
 */
function isAIBotUserAgent() {
    const userAgent = navigator.userAgent;

    const aiBotIdentifiers = [
      "GPTBot/1.0",
      "GPTBot/1.1",
      "GPTBot/1.2",
      "OAI-SearchBot/1.0",
      "ChatGPT-User/1.0",
      "ChatGPT-User/2.0",
      "ClaudeBot",
      "ClaudeBot/1.0",
      "claude-web",
      "claude-web/1.0",
      "Claude-SearchBot",
      "Claude/1.0",
      "Claude-User",
      "Anthropic-ai",
      "PerplexityBot",
      "Perplexity",
      "Perplexity-User",
      "ChatGLM-Spider/1.0",
      "Cohere-ai/1.0",
      "Phindbot.1.0",
      "PoeBot",
      "Tongyibot/1.0",
      "Yanbaobot/1.0",
      "DeepseekBot/1.0",
      "Deepseek/1.0",
      "DeepSeek Chat",
      "MetaAIbot",
      "Meta-externalagent",
      "Meta-ExternalFetcher",
      "Meta-llama",
      "Gemini-Deep-Research",
      "Gemini-User",
      "Deepseek-desktop",
      "GoogleAgent-Mariner",
      "NovaAct",
      "ChatGPT Agent",
      "Bedrock-bot",
      "Devin",
      "AI2bot",
      "Applebot-extended",
      "BytespiderBot",
      "CCBot",
      "Cotoyogi",
      "DuckAssistBot",
      "Google-extended",
      "Iaskspider",
      "iaskbot",
      "ICC-Crawler",
      "LinerBot",
      "MistralAI-User",
      "PanguBot",
      "cohere-ai/1.0",
      "anthropic-ai/1.0",
      "Bytespider/1.0",
      "TongyiBot/1.0",
      "YanbaoBot/1.0"
    ];
    
    return aiBotIdentifiers.some(identifier => 
        userAgent.includes(identifier)
    );
}
