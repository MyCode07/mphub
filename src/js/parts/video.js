const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            playVideo(entry.target);
        }
    })
});

function playVideo(video) {
    if (video) {
        video.play();
    }
}

const videos = document.querySelectorAll('._video');

export const playVideoAction = () => {
    if (!videos.length) return;

    videos.forEach(video => {
        observer.observe(video);
    })
}
