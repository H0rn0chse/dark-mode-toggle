const ASC = 1;
const DESC = -1;

export class ToggleAnimation {
    constructor (lottie) {
        this.lottie = lottie;
        this.lottie.setLooping(false);
        this.lottie.addEventListener("frame", (evt) => {
            this.onFrame(evt);
        });
        this.lottie.addEventListener("complete", (evt) => {
            this.onComplete(evt);
        });

        this.targetFrame = null;
        this.dir = ASC;
        this.isPlaying = false;
    }

    onFrame (evt) {
        const currentFrame = Math.round(evt.detail.frame);
        if (currentFrame === this.targetFrame) {
            this.lottie.pause();
            this.isPlaying = false;
        }
    }

    onComplete (evt) {
        this.isPlaying = false;
    }

    play (fromFrame, toFrame) {
        if (this.isPlaying) {
            // Allow fast toggling
            this.dir = this.dir === ASC ? DESC : ASC;
            this.lottie.setDirection(this.dir);
        } else {
            // start fresh animation
            this.dir = ASC;
            this.lottie.seek(fromFrame);
            this.lottie.setDirection(this.dir);

            this.lottie.play();
        }

        this.targetFrame = toFrame
        this.isPlaying = true;
    }
}