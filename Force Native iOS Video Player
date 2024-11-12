// ==UserScript==
// @name         Force Native iOS Video Player on Fullscreen Only
// @namespace    https://tianpurba.com
// @version      1.9
// @description  Memaksa pemutar native iOS saat fullscreen dan pemutar web saat minimize, tanpa menyebabkan double player dan error 224003
// @author       Tian
// @match        :///*
// @exclude      https://www.youtube.com/*
// @exclude      https://www.netflix.com/*
// @exclude      https://vimeo.com/*
// @exclude      https://www.dailymotion.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Daftar domain yang dikecualikan
    const excludedDomains = [
        'youtube.com',
        'youtu.be',
        'netflix.com',
        'vimeo.com',
        'dailymotion.com',
        // Tambahkan domain lain yang ingin dikecualikan
    ];

    // Fungsi untuk memeriksa apakah domain saat ini dikecualikan
    function isExcludedDomain() {
        const hostname = window.location.hostname;
        return excludedDomains.some(domain => hostname.includes(domain));
    }

    if (isExcludedDomain()) {
        console.log('Force Native iOS Player: Skrip tidak dijalankan pada domain ini.');
        return;
    }

    /**
     * Memastikan video diputar menggunakan pemutar native iOS saat fullscreen
     * dan pemutar web saat minimize
     */
    function enforceNativePlayer(video) {
        if (video.dataset.nativePlayerApplied === 'true') {
            // Menghindari penerapan ganda
            return;
        }

        try {
            // Tandai video sebagai telah diproses
            video.dataset.nativePlayerApplied = 'true';
            console.log('Force Native iOS Player: Memproses video:', video);

            // Tambahkan atribut playsinline untuk memungkinkan pemutaran web saat minimize
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');

            // Menghapus atribut autoplay dan mute untuk mencegah konflik
            video.removeAttribute('autoplay');
            video.removeAttribute('muted');
            video.autoplay = false;

            // Pastikan kontrol video ditampilkan
            video.controls = true;

            console.log('Force Native iOS Player: Video diproses berhasil.', video);
        } catch (error) {
            console.error('Force Native iOS Player: Terjadi error saat memproses video.', error);
        }
    }

    /**
     * Proses semua video yang ada saat ini
     */
    function processExistingVideos() {
        const videos = document.querySelectorAll('video');
        console.log(Force Native iOS Player: Menemukan ${videos.length} elemen video.);
        videos.forEach(enforceNativePlayer);
    }

    /**
     * Observasi perubahan pada DOM untuk menangani video yang ditambahkan secara dinamis
     */
    function observeNewVideos() {
        const observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;

                        // Hanya proses elemen video
                        if (node.tagName === 'VIDEO') {
                            console.log('Force Native iOS Player: Elemen video ditemukan dalam node yang ditambahkan.', node);
                            enforceNativePlayer(node);
                        } else {
                            const nestedVideos = node.querySelectorAll('video');
                            if (nestedVideos.length > 0) {
                                console.log(Force Native iOS Player: Menemukan ${nestedVideos.length} elemen video dalam node yang ditambahkan.);
                                nestedVideos.forEach(enforceNativePlayer);
                            }
                        }
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log('Force Native iOS Player: MutationObserver diaktifkan.');
    }

    // Variable untuk melacak video yang sedang fullscreen
    let currentFullscreenVideo = null;

    // Event listener untuk fullscreenchange (Fullscreen API)
    function handleFullscreenChange() {
        const fsVideo = document.fullscreenElement;

        if (fsVideo && fsVideo.tagName === 'VIDEO') {
            if (currentFullscreenVideo !== fsVideo) {
                currentFullscreenVideo = fsVideo;
                console.log('Force Native iOS Player: Video masuk fullscreen. Menggunakan pemutar native iOS.');

                // Remove playsinline attributes to force native player
                fsVideo.removeAttribute('playsinline');
                fsVideo.removeAttribute('webkit-playsinline');

                // Pause web player to prevent double playback
                if (!fsVideo.paused) {
                    fsVideo.pause();
                    console.log('Force Native iOS Player: Video di web player dihentikan untuk mencegah double playback.');
                }
            }
        } else {
            if (currentFullscreenVideo) {
                console.log('Force Native iOS Player: Video keluar fullscreen. Menggunakan pemutar web.');

                // Add playsinline attributes to allow web player
                currentFullscreenVideo.setAttribute('playsinline', '');
                currentFullscreenVideo.setAttribute('webkit-playsinline', '');

                currentFullscreenVideo = null;
            }
        }
    }

    // Event listener untuk webkitfullscreenchange (Safari iOS)
    function handleWebkitFullscreenChange() {
        const fsVideo = document.webkitFullscreenElement;

        if (fsVideo && fsVideo.tagName === 'VIDEO') {
            if (currentFullscreenVideo !== fsVideo) {
                currentFullscreenVideo = fsVideo;
                console.log('Force Native iOS Player: Video masuk fullscreen (webkit). Menggunakan pemutar native iOS.');

                // Remove playsinline attributes to force native player
                fsVideo.removeAttribute('playsinline');
                fsVideo.removeAttribute('webkit-playsinline');

                // Pause web player to prevent double playback
                if (!fsVideo.paused) {
                    fsVideo.pause();
                    console.log('Force Native iOS Player: Video di web player dihentikan untuk mencegah double playback.');
                }
            }
        } else {
            if (currentFullscreenVideo) {
                console.log('Force Native iOS Player: Video keluar fullscreen (webkit). Menggunakan pemutar web.');

                // Add playsinline attributes to allow web player
                currentFullscreenVideo.setAttribute('playsinline', '');
                currentFullscreenVideo.setAttribute('webkit-playsinline', '');

                currentFullscreenVideo = null;
            }
        }
    }

    /**
     * Setup event listeners untuk fullscreenchange
     */
    function setupFullscreenListeners() {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleWebkitFullscreenChange);
        console.log('Force Native iOS Player: Fullscreen event listeners ditambahkan.');
    }

    // Inisialisasi
    window.addEventListener('load', function() {
        console.log('Force Native iOS Player: Window load event dipicu.');
        setTimeout(() => {
            processExistingVideos();
        }, 2000); // Delay 2 detik

        setupFullscreenListeners();
    });

    // Inisialisasi MutationObserver segera
    observeNewVideos();

})();
