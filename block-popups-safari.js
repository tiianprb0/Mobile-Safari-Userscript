// ==UserScript==
// @name         Simple Popup and Navigation Blocker
// @namespace    https://tianpurba.com
// @version      1.0
// @description  Block popups and navigations to specific domains while allowing whitelisted domains and media player popups.
// @author       Tian | tianpurba.com
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Daftar pola domain yang **diblokir secara absolut**.
     * Navigasi atau popup ke domain ini akan selalu diblokir, tanpa pengecualian.
     */
    const blockedDomains = [
        /shopee\./,
        /tokopedia\./,
        /lazada\./,
        /bukalapak\./,
        /blibli\./,
        /involvo\.co/,
        /shp\.ee/,
        /dotyruntchan\.com/,
        /terrificdark\.com/,
        /invl\.co/,
        /s\.shopee\.co\.id/,
        /atid\.me/
        // Tambahkan domain lain sesuai kebutuhan
    ];

    /**
     * Daftar pola domain yang **diizinkan (whitelist)**.
     * Popup dan navigasi normal di situs ini diizinkan.
     */
    const whitelistedDomains = [
        /facebook\.com/,
        /twitter\.com/,
        /instagram\.com/,
        /linkedin\.com/,
        /freepik\.com/,
        /unsplash\.com/,
        /pngtree\.com/,
        /eskagroup\.co\.id/,
        /blogspot\.com/,
        /\.go\.id$/,
        /google\./,
        /youtube\.com/,
        /reddit\.com/,
        /medium\.com/,
        /github\.com/,
        /stackoverflow\.com/,
        /quora\.com/,
        /whatsapp\.com/,
        /telegram\.org/,
        /discord\.com/,
        /tiktok\.com/,
        /pinterest\.com/,
        /tumblr\.com/,
        /dropbox\.com/,
        /wikipedia\.org/,
        /wordpress\.com/,
        /weebly\.com/,
        /behance\.net/,
        /dribbble\.com/,
        /etsy\.com/,
        /vimeo\.com/,
        /spotify\.com/
        // Tambahkan domain lain sesuai kebutuhan
    ];

    /**
     * Daftar pola URL atau karakteristik yang **diizinkan untuk popup media player**.
     * Popup yang diarahkan ke URL dengan karakteristik ini tidak akan diblokir meskipun situs saat ini tidak di-whitelist.
     */
    const allowedMediaPatterns = [
        // Pola URL untuk media player spesifik
        /terabox\.com/,
        /dood\.sh/,
        /streaming\.dood\.sh/,
        /player\.terabox\.com/,
        /media\.dood\.sh/,
        // Tambahkan domain atau pola URL media player lainnya sesuai kebutuhan

        // Pola URL yang mengandung path atau parameter khusus untuk media
        /\/player\//,
        /\/embed\//,
        /\/media\//,
        /\/stream\//,
        /\?video=/,
        /\?track=/,
        /\?image=/
        // Tambahkan pola URL lainnya sesuai kebutuhan
    ];

    /**
     * Daftar ekstensi file media yang **diizinkan untuk popup**.
     * Popup yang diarahkan ke URL dengan ekstensi ini tidak akan diblokir meskipun situs saat ini tidak di-whitelist.
     */
    const allowedMediaExtensions = [
        '.mp4', '.webm', '.ogg', // Video
        '.mp3', '.wav', '.flac', // Audio
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', // Gambar
        '.avi', '.mov', '.wmv', '.mkv', // Video tambahan
        '.m4a', '.aac', '.wma', // Audio tambahan
        '.webp', '.tiff' // Gambar tambahan
        // Tambahkan ekstensi lain sesuai kebutuhan
    ];

    /**
     * Cek apakah hostname termasuk dalam daftar **diblokir**.
     * @param {string} hostname - Hostname dari URL yang akan dicek.
     * @returns {boolean} - True jika diblokir, false jika tidak.
     */
    function isBlocked(hostname) {
        return blockedDomains.some(pattern => pattern.test(hostname));
    }

    /**
     * Cek apakah hostname termasuk dalam **whitelist**.
     * @param {string} hostname - Hostname dari URL yang akan dicek.
     * @returns {boolean} - True jika diizinkan, false jika tidak.
     */
    function isWhitelisted(hostname) {
        return whitelistedDomains.some(pattern => pattern.test(hostname));
    }

    /**
     * Cek apakah URL sesuai dengan pola media player yang diizinkan.
     * @param {string} url - URL yang akan dicek.
     * @returns {boolean} - True jika sesuai pola media player yang diizinkan, false jika tidak.
     */
    function isAllowedMediaPlayer(url) {
        return allowedMediaPatterns.some(pattern => pattern.test(url));
    }

    /**
     * Cek apakah URL memiliki ekstensi media yang **diizinkan**.
     * @param {string} url - URL yang akan dicek.
     * @returns {boolean} - True jika memiliki ekstensi media yang diizinkan, false jika tidak.
     */
    function hasAllowedMediaExtension(url) {
        try {
            const urlObj = new URL(url, window.location.href);
            const pathname = urlObj.pathname.toLowerCase();
            return allowedMediaExtensions.some(ext => pathname.endsWith(ext));
        } catch (e) {
            return false;
        }
    }

    /**
     * Cek apakah URL sesuai dengan pola media player yang diizinkan atau memiliki ekstensi file media yang diizinkan.
     * @param {string} url - URL yang akan dicek.
     * @returns {boolean} - True jika sesuai dengan salah satu kriteria, false jika tidak.
     */
    function isMediaURL(url) {
        return isAllowedMediaPlayer(url) || hasAllowedMediaExtension(url);
    }

    /**
     * Dapatkan hostname dari URL.
     * @param {string} url - URL lengkap.
     * @returns {string} - Hostname dari URL.
     */
    function getHostname(url) {
        try {
            return new URL(url, window.location.href).hostname;
        } catch (e) {
            return '';
        }
    }

    /**
     * Fungsi utama untuk memblokir navigasi ke domain yang diblokir.
     * @param {string} url - URL yang akan dicek.
     * @returns {boolean} - True jika diblokir, false jika tidak.
     */
    function blockNavigation(url) {
        const hostname = getHostname(url);
        if (isBlocked(hostname)) {
            console.warn('Navigasi menuju aplikasi diblokir:', url);
            return true;  // Indikator bahwa navigasi harus diblokir
        }
        return false;
    }

    /**
     * Blokir navigasi saat ini jika berada di domain yang diblokir.
     */
    function enforceBlockOnLoad() {
        const currentURL = window.location.href;
        if (blockNavigation(currentURL)) {
            window.stop();  // Menghentikan loading halaman
            document.documentElement.innerHTML = '';  // Mengosongkan konten halaman
        }
    }

    /**
     * Override window.open untuk mencegah semua popup jika situs saat ini tidak di-whitelist,
     * kecuali popup diarahkan ke media player (berdasarkan pola URL atau ekstensi file).
     */
    const originalWindowOpen = window.open;
    window.open = function(url, name, specs, replace) {
        const currentHostname = getHostname(window.location.href);
        const targetURL = url;

        // Jika situs saat ini di-whitelist, izinkan semua popup
        if (isWhitelisted(currentHostname)) {
            return originalWindowOpen.call(window, url, name, specs, replace);
        }

        // Jika popup diarahkan ke media player (berdasarkan pola URL atau ekstensi file), izinkan popup
        if (isMediaURL(targetURL)) {
            return originalWindowOpen.call(window, url, name, specs, replace);
        }

        // Jika tidak, blokir popup
        console.warn('Popup diblokir:', url);
        return null;
    };

    /**
     * Override history.pushState dan history.replaceState untuk mencegah redirect ke domain yang diblokir.
     */
    (function() {
        const originalPushState = history.pushState;
        history.pushState = function(state, title, url) {
            if (url && blockNavigation(url)) {
                console.warn('Redirect via pushState diblokir:', url);
                return;
            }
            return originalPushState.apply(this, arguments);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(state, title, url) {
            if (url && blockNavigation(url)) {
                console.warn('Redirect via replaceState diblokir:', url);
                return;
            }
            return originalReplaceState.apply(this, arguments);
        };
    })();

    /**
     * Override EventTarget.prototype.addEventListener untuk mencegah penambahan event listener tertentu pada domain yang diblokir.
     */
    (function() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            const blockedEvents = ['beforeunload', 'unload', 'popstate'];
            const currentHostname = getHostname(window.location.href);
            if (isBlocked(currentHostname) && blockedEvents.includes(type)) {
                console.warn(`Penambahan event listener untuk "${type}" diblokir pada domain ini.`);
                return;
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    })();

    /**
     * Blokir link yang mengarah ke domain yang diblokir, terlepas dari situs asalnya.
     */
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');

        if (target && target.href) {
            const targetHostname = getHostname(target.href);

            // Jika domain target diblokir, blokir navigasi
            if (isBlocked(targetHostname)) {
                e.preventDefault();
                console.warn('Navigasi menuju aplikasi diblokir:', target.href);
            }
        }
    }, true);

    /**
     * Monitor perubahan URL dan DOM untuk memblokir navigasi dinamis.
     */
    (function() {
        // Cek URL setiap 500ms
        const urlCheckInterval = setInterval(() => {
            enforceBlockOnLoad();
        }, 500);

        // MutationObserver untuk memantau perubahan DOM
        const observer = new MutationObserver(() => {
            enforceBlockOnLoad();
        });

        observer.observe(document, {
            subtree: true,
            childList: true,
            attributes: true,
            characterData: true
        });

        // Blokir event 'beforeunload' untuk mencegah redirect
        window.addEventListener('beforeunload', function(e) {
            if (isBlocked(getHostname(window.location.href))) {
                console.warn('Redirect via beforeunload diblokir.');
            }
        }, true);
    })();

    /**
     * Tambahkan aturan CSS untuk menyembunyikan elemen popup umum.
     */
    function addCSSBlocker() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            /* Menyembunyikan elemen popup yang umum digunakan */
            .popup, .modal, .advertisement, .ad-popup, .popup-window, .lightbox, .overlay, .popup-content, .modal-dialog, .banner-ad, .interstitial, .subscribe-popup {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Jalankan fungsi untuk menambahkan CSS blocker
    addCSSBlocker();

    /**
     * Blokir popups secara global kecuali pada domain yang di-whitelist atau diarahkan ke media player (video/music/image).
     */
    function blockPopupsGlobally() {
        // Override target="_blank" links untuk mencegah popup jika situs saat ini tidak di-whitelist
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a');

            if (target && target.href && target.target === '_blank') {
                const currentHostname = getHostname(window.location.href);
                const targetURL = target.href;

                // Jika situs saat ini di-whitelist, izinkan popup
                if (isWhitelisted(currentHostname)) {
                    return;
                }

                // Jika popup diarahkan ke media player (berdasarkan pola URL atau ekstensi file), izinkan popup
                if (isMediaURL(targetURL)) {
                    return;
                }

                // Jika tidak, blokir popup
                e.preventDefault();
                console.warn('Popup diblokir:', target.href);
            }
        }, true);
    }

    // Jalankan fungsi untuk memblokir popups secara global
    blockPopupsGlobally();

})();
