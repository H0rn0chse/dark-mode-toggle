const ASC = 1;
const DESC = -1;

export class ToggleAnimation {
    constructor (player) {
        this.player = player;
        this.player.loop = false;

        this.player.addEventListener("complete", (evt) => {
            this.onComplete(evt);
        });

        this.dir = ASC;
        this.isPlaying = false;
    }

    onComplete (evt) {
        this.isPlaying = false;
        this.originalFrom = null;
        this.originalTo = null;
    }

    play (fromFrame, toFrame) {
        if (this.isPlaying) {
            // Allow fast toggling by reversing the anmiation
            const deltaFrame = Math.round(this.player.currentFrame);

            if (this.dir === ASC) {
                // reverse
                this.dir = DESC;
                fromFrame = deltaFrame + this.fromFrame;
                toFrame = this.originalFrom || this.fromFrame;

                this.player.setDirection(this.dir);
                this.player.playSegments([fromFrame, toFrame], true);
            } else {
                // re-reverse
                this.dir = ASC;
                fromFrame = this.fromFrame - deltaFrame;

                this.player.setDirection(this.dir);
                this.player.playSegments([fromFrame, toFrame], true);
            }
        } else {
            // start fresh animation
            this.dir = ASC;
            this.player.setDirection(this.dir);
            this.player.playSegments([fromFrame, toFrame], true);

            this.originalFrom = fromFrame;
            this.originalTo = toFrame;
        }

        this.isPlaying = true;
        this.fromFrame = fromFrame;
        this.toFrame = toFrame;
    }
}