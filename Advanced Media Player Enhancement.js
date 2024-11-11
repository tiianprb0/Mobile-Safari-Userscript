// ==UserScript==
// @name         Advanced Media Player Enhancement for iOS
// @namespace    https://tianpurba.com
// @version      2.1
// @description  Mencegah objek menutupi pemutar media dan memastikan video diputar dengan pemutar native iOS. Juga menghapus iklan yang mengganggu.
// @author       Tian | tianpurba.com
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Menghapus atribut agar video diputar dengan pemutar native iOS
     */
    function enforceNativeMediaPlayer(video) {
        if (video.hasAttribute('playsinline')) {
            video.removeAttribute('playsinline');
        }
        if (video.hasAttribute('webkit-playsinline')) {
            video.removeAttribute('webkit-playsinline');
        }
        // Menambahkan atribut controls jika belum ada
        if (!video.hasAttribute('controls')) {
            video.setAttribute('controls', '');
        }
    }

    /**
     * Menyesuaikan z-index pemutar media agar selalu di atas
     */
    function bringMediaToFront() {
        const mediaElements = document.querySelectorAll('video, audio, iframe, embed, object');

        mediaElements.forEach(media => {
            media.style.position = 'relative';
            media.style.zIndex = '9999';
        });

        // Mengurangi z-index elemen lain
        const allElements = document.body.getElementsByTagName("*");
        for (let el of allElements) {
            if (!['VIDEO', 'AUDIO', 'IFRAME', 'EMBED', 'OBJECT'].includes(el.tagName.toUpperCase())) {
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.zIndex && computedStyle.zIndex !== 'auto') {
                    el.style.zIndex = '1';
                }
            }
        }
    }

    /**
     * Menghapus atau menyembunyikan elemen iklan berdasarkan pola umum
     */
    function removeAds() {
        // Daftar selector umum untuk iklan
        const adSelectors = [
            '[id*="ad"]',
            '[class*="ad"]',
            '[id*="ads"]',
            '[class*="ads"]',
            '[id*="banner"]',
            '[class*="banner"]',
            '[id*="promo"]',
            '[class*="promo"]',
            '.advertisement',
            '.adsbygoogle',
            '.ad-container',
            '.ad-slot',
            '.ad-wrapper',
            '.sponsored',
            'iframe[src*="ads"]',
            'iframe[src*="doubleclick"]'
        ];

        adSelectors.forEach(selector => {
            const ads = document.querySelectorAll(selector);
            ads.forEach(ad => {
                ad.remove();
            });
        });

        // Menambahkan aturan CSS tambahan untuk menyembunyikan iklan secara lebih efektif
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            [id*="ad"], [class*="ad"], [id*="ads"], [class*="ads"],
            [id*="banner"], [class*="banner"], [id*="promo"], [class*="promo"],
            .advertisement, .adsbygoogle, .ad-container, .ad-slot, .ad-wrapper,
            .sponsored, iframe[src*="ads"], iframe[src*="doubleclick"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Mengatur semua video di halaman
     */
    function processVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            enforceNativeMediaPlayer(video);
        });
    }

    /**
     * Inisialisasi skrip
     */
    function init() {
        processVideos();
        bringMediaToFront();
        removeAds();
    }

    /**
     * Mengamati perubahan DOM untuk menangani elemen yang dimuat dinamis
     */
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                shouldRun = true;
            }
        });
        if (shouldRun) {
            processVideos();
            bringMediaToFront();
            removeAds();
        }
    });

    // Konfigurasi observer untuk memantau perubahan subtree dan penambahan anak
    observer.observe(document.body, { childList: true, subtree: true });

    // Jalankan inisialisasi saat skrip dijalankan
    init();

})();
