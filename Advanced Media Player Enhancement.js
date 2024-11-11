// ==UserScript==
// @name         Prevent Overlapping Objects & Use Native iOS Media Player
// @namespace    https://tianpurba.com
// @version      1.1
// @description  Mencegah objek lain menutupi pemutar media dan memastikan video diputar dengan pemutar native iOS.
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
        }
    });

    // Konfigurasi observer untuk memantau perubahan subtree dan penambahan anak
    observer.observe(document.body, { childList: true, subtree: true });

    // Jalankan inisialisasi saat skrip dijalankan
    init();

})();
