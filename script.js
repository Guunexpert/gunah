const stripThemes = {
    1: {
        name: 'gunahd',
        bgVideo: 'videos/Carlotta.mp4',
        bgColor: '#ec9ed9',
        accentColor: '#b14b7b',
        animationFrom: 'right'
    },
    2: { 
        name: 'mikanoshika',
        bgVideo: 'videos/vergil.mp4',
        bgColor: '#55dfdf',
        accentColor: '#387b8b',
        animationFrom: 'right'
    },
    3: {
        name: 'renn',
        bgVideo: 'videos/furina.mp4',
        bgColor: '#327abe',
        accentColor: '#478baa',
        animationFrom: 'right'
    }
};

const strips = document.querySelectorAll('.strip');
const videoContainer = document.querySelector('.theme-video-container');
const videoKarakter = document.querySelector('.theme-video');
const bgVideoContainer = document.querySelector('.theme-bg-video-container');
const bgVideoElement = document.querySelector('.theme-bg-video');

let currentActiveStrip = null;

const playVideoWithEase = (videoEl, containerEl, src) => {
    if (videoEl.src.includes(src) && containerEl.classList.contains('active')) {
        return; 
    }
    containerEl.classList.remove('active');

    const showVideo = () => {
        requestAnimationFrame(() => {
            containerEl.classList.add('active');
        });
    };

    if (!videoEl.src.includes(src)) {
        videoEl.src = src;
        videoEl.load();
        videoEl.addEventListener('loadeddata', showVideo, { once: true });
    } else {
        showVideo();
    }
    videoEl.currentTime = 0;
    videoEl.play().catch(e => console.log("Play error:", e));
};

strips.forEach((strip, index) => {
    strip.addEventListener('mouseenter', () => {
        const themeIndex = index + 1;
        const theme = stripThemes[themeIndex];
        
        if (!theme) return;

        strips.forEach((s) => {
            if (s !== strip) {
                s.style.opacity = '0.1';
                s.style.pointerEvents = 'none';
            }
        });

        if (currentActiveStrip) {
            currentActiveStrip.classList.remove('active-theme');
        }

        if (theme.bgVideo) {
            playVideoWithEase(bgVideoElement, bgVideoContainer, theme.bgVideo);
            document.body.style.backgroundColor = "transparent";
        } else {
            bgVideoContainer.classList.remove('active');
            bgVideoElement.pause();
            document.body.style.backgroundColor = theme.bgColor;
        }

        if (theme.videoFile) {
            if (!videoKarakter.src.includes(theme.videoFile)) {
                videoKarakter.src = theme.videoFile;
                videoKarakter.load();
            }
            videoKarakter.currentTime = 0;
            videoKarakter.play().catch(e => console.log("Char error:", e));
            videoContainer.classList.add('active');
        }

        document.body.classList.add('theme-active');
        strip.classList.add('active-theme');
        currentActiveStrip = strip;
    });

    strip.addEventListener('mouseleave', () => {

        strips.forEach((s) => {
            s.style.opacity = '1';
            s.style.pointerEvents = 'auto';
        });

        strip.classList.remove('active-theme');
        if(videoContainer) videoContainer.classList.remove('active');
        bgVideoContainer.classList.remove('active');
        document.body.classList.remove('theme-active');
        document.body.style.backgroundColor = '#050505';

        setTimeout(() => {
            if (!document.querySelector('.strip:hover')) {
                if(videoKarakter) videoKarakter.pause();
                if(bgVideoElement) bgVideoElement.pause();
            }
        }, 600);
        currentActiveStrip = null;
    });
});

window.addEventListener('load', () => {
    [bgVideoElement, videoKarakter].forEach(vid => {
        if (vid) {
            vid.muted = true;
            vid.preload = "auto";
            vid.load();
        }
    });

    if(bgVideoElement) {
        bgVideoElement.play().then(() => {
            setTimeout(() => {
                if (!bgVideoContainer.classList.contains('active')) {
                    bgVideoElement.pause();
                }
            }, 200);
        }).catch(e => console.log("Preload warmup logic"));
    }
});