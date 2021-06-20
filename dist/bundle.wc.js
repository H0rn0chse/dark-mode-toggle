(function () {
    'use strict';

    class EventBus {
        constructor (description = "") {
            this.description = description;

            this.eventHandler = new Map();
        }

        on (eventName, callback, scope) {
            if (!this.has(eventName, callback, scope)) {
                const key = {
                    eventName,
                    callback,
                    scope,
                };

                const value = {
                    once: false,
                    eventName,
                };

                this.eventHandler.set(key, value);
            }
        }

        _getKey (searchKey) {
            return Array.from(this.eventHandler.keys()).find((key) => {
                return searchKey.eventName === key.eventName
                && searchKey.callback === key.callback
                && searchKey.scope === key.scope;
            });
        }

        once (eventName, callback, scope) {
            if (!this.has(eventName, callback, scope)) {
                const key = {
                    eventName,
                    callback,
                    scope,
                };

                const value = {
                    once: true,
                    eventName,
                };

                this.eventHandler.set(key, value);
            }
        }

        has (eventName, callback, scope) {
            const key = {
                eventName,
                callback,
                scope,
            };
            return !!this._getKey(key);
        }

        off (eventName, callback, scope) {
            const searchKey = {
                eventName,
                callback,
                scope,
            };

            const key = this._getKey(searchKey);
            this.eventHandler.delete(key);
        }

        emit (eventName, ...args) {
            this.eventHandler.forEach((value, key, map) => {
                if (value.eventName !== eventName) {
                    return;
                }

                const boundHandler = key.scope ? key.callback.bind(key.scope) : key.callback;

                if (value.once) {
                    map.delete(key);
                }

                try {
                    boundHandler(...args);
                } catch (err) {
                    console.error(err);
                }
            });
        }
    }

    class _ThemeHandler extends EventBus {
        constructor () {
            super("ThemeBus");

            this.themes = {
                light: document.querySelector("#light"),
                dark: document.querySelector("#dark"),
            };
            this.initialized = false;
        }

        init () {
            if (this.initialized) {
                return
            }

            this.initialized = true;
            const savedTheme = localStorage.getItem("theme");
            const systemTheme = this._initWatcher();
            this._initThemes(savedTheme || systemTheme);
        }

        _getInverseTheme (theme) {
            switch (theme) {
                case "light":
                    return this.themes.dark;
                case "dark":
                    return this.themes.light;
            }
        }

        _initWatcher () {
            const colorSchemeQueryList = globalThis.matchMedia("(prefers-color-scheme: dark)");
            colorSchemeQueryList.addEventListener("change", (evt) => {
                const preferDark = colorSchemeQueryList.matches;
                this.setTheme(preferDark ? "dark" : "light");
            });
            const preferDark = colorSchemeQueryList.matches;
            return preferDark ? "dark" : "light";
        }

        _initThemes (theme) {
            this.currentTheme = theme;
            const inverseTheme = this._getInverseTheme(theme);
            inverseTheme.remove();
        }

        setTheme (theme) {
            if (this.currentTheme === theme) {
                return;
            }

            const activeTheme = this._getInverseTheme(theme);

            const targetTheme = this.themes[theme].cloneNode();
            targetTheme.addEventListener("load", (evt) => {
                activeTheme.remove();
                // theme is ready
                this.emit("themeLoaded", { theme });
            }, { once: true });
            document.head.appendChild(targetTheme);

            // save new theme and it's node
            this.themes[theme] = targetTheme;
            this.currentTheme = theme;

            localStorage.setItem("theme", theme);
            this.emit("themeChanged", { theme });
        }

        getTheme () {
            return this.currentTheme;
        }
    }

    const ThemeHandler = new _ThemeHandler();

    const ASC = 1;
    const DESC = -1;

    class ToggleAnimation extends EventBus {
        constructor (button, player) {
            super("ToggleBus");

            this.button = button;
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
            this.emit("animationComplete", {});
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

    var v="5.3.4";var fr=24;var ip=0;var op=96;var w=500;var h=500;var nm="Toggle";var ddd=0;var assets=[];var layers=[{ddd:0,ind:1,ty:4,nm:"Shutting Star",sr:1,ks:{o:{a:0,k:100,ix:11},r:{a:0,k:0,ix:10},p:{a:0,k:[250,250,0],ix:2},a:{a:0,k:[0,0,0],ix:1},s:{a:0,k:[100,100,100],ix:6}},ao:0,shapes:[{ty:"gr",it:[{ind:0,ty:"sh",ix:1,ks:{a:0,k:{i:[[-11.168,-2.743],[-25,-28]],o:[[28.5,7],[28.361,31.764]],v:[[-126,-24.5],[-27,37.5]],c:false},ix:2},nm:"Path 1",mn:"ADBE Vector Shape - Group",hd:false},{ty:"tm",s:{a:1,k:[{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:32,s:[0],e:[100]},{t:40}],ix:1},e:{a:1,k:[{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:30,s:[0],e:[100]},{t:37}],ix:2},o:{a:0,k:0,ix:3},m:1,ix:2,nm:"Trim Paths 1",mn:"ADBE Vector Filter - Trim",hd:false},{ty:"st",c:{a:0,k:[0.933333333333,0.992156862745,1,1],ix:3},o:{a:0,k:100,ix:4},w:{a:0,k:1,ix:5},lc:2,lj:2,nm:"Stroke 1",mn:"ADBE Vector Graphic - Stroke",hd:false},{ty:"tr",p:{a:0,k:[0,0],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Shape 1",np:3,cix:2,ix:1,mn:"ADBE Vector Group",hd:false}],ip:30,op:41,st:30,bm:0},{ddd:0,ind:2,ty:4,nm:"Moon",sr:1,ks:{o:{a:0,k:100,ix:11},r:{a:1,k:[{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:0,s:[-175.595],e:[0]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:24,s:[0],e:[0]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:48,s:[0],e:[-175.595]},{t:72}],ix:10},p:{s:true,x:{a:1,k:[{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:0,s:[170],e:[330]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:24,s:[330],e:[330]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:48,s:[330],e:[170]},{t:72}],ix:3},y:{a:0,k:250,ix:4}},a:{a:0,k:[60.25,60.25,0],ix:1},s:{a:0,k:[100,100,100],ix:6}},ao:0,shapes:[{ty:"gr",it:[{ind:0,ty:"sh",ix:1,ks:{a:0,k:{i:[[4.981,1.834],[0,7.828],[11.632,0],[2.39,-0.941],[-1.477,0],[0,-11.632],[6.338,-3.63],[0,-5.618],[4.49,-2.06],[0,6.513]],o:[[6.338,-3.63],[0,-11.632],[-2.724,0],[1.391,-0.289],[11.632,0],[0,7.828],[4.981,1.834],[0,5.263],[6.24,-0.973],[0,-5.619]],v:[[3.775,7.124],[14.388,-11.16],[-6.674,-32.221],[-14.388,-30.757],[-10.079,-31.2],[10.983,-10.137],[0.37,8.146],[8.911,20.374],[1.297,32.221],[12.317,19.353]],c:true},ix:2},nm:"Path 1",mn:"ADBE Vector Shape - Group",hd:false},{ind:1,ty:"sh",ix:2,ks:{a:0,k:{i:[[1.534,0],[0,5.888],[-1.927,1.929],[0,-4.354],[-5.888,0],[-1.93,1.933]],o:[[-5.887,0],[0,-2.941],[-3.74,1.656],[0,5.887],[2.946,0],[-1.319,0.584]],v:[[-57.252,37.674],[-67.912,27.014],[-64.794,19.481],[-71.147,29.228],[-60.487,39.888],[-52.944,36.76]],c:true},ix:2},nm:"Path 2",mn:"ADBE Vector Shape - Group",hd:false},{ty:"fl",c:{a:1,k:[{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:0,s:[1,0.940106153488,0.53420650959,1],e:[0.783999992819,0.944999964097,0.969000004787,1]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:24,s:[0.783999992819,0.944999964097,0.969000004787,1],e:[0.783999992819,0.944999964097,0.969000004787,1]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:48,s:[0.783999992819,0.944999964097,0.969000004787,1],e:[1,0.940106153488,0.53420650959,1]},{t:72}],ix:4},o:{a:0,k:100,ix:5},r:1,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false},{ty:"tr",p:{a:0,k:[86.845,53.361],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Shadow",np:3,cix:2,ix:1,mn:"ADBE Vector Group",hd:false},{ty:"gr",it:[{ind:0,ty:"sh",ix:1,ks:{a:0,k:{i:[[4.981,1.834],[0,7.828],[11.632,0],[0,-11.632],[-10.302,-1.374],[0,-3.827],[-7.202,0],[0,7.202]],o:[[6.338,-3.63],[0,-11.632],[-11.632,0],[0,10.679],[-2.624,2.386],[0,7.202],[7.203,0],[0,-5.619]],v:[[10.449,7.038],[21.061,-11.246],[0,-32.307],[-21.061,-11.246],[-2.81,9.623],[-7.092,19.266],[5.949,32.307],[18.991,19.266]],c:true},ix:2},nm:"Path 1",mn:"ADBE Vector Shape - Group",hd:false},{ind:1,ty:"sh",ix:2,ks:{a:0,k:{i:[[0,-5.888],[5.887,0],[0,5.887],[-5.888,0]],o:[[0,5.887],[-5.888,0],[0,-5.888],[5.887,0]],v:[[-43.153,29.141],[-53.813,39.801],[-64.473,29.141],[-53.813,18.481]],c:true},ix:2},nm:"Path 2",mn:"ADBE Vector Shape - Group",hd:false},{ty:"fl",c:{a:1,k:[{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:0,s:[1,0.940106153488,0.53420650959,1],e:[0.862999949736,0.957000014361,0.969000004787,1]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:24,s:[0.862999949736,0.957000014361,0.969000004787,1],e:[0.862999949736,0.957000014361,0.969000004787,1]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:48,s:[0.862999949736,0.957000014361,0.969000004787,1],e:[1,0.940106153488,0.53420650959,1]},{t:72}],ix:4},o:{a:0,k:100,ix:5},r:1,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false},{ty:"tr",p:{a:0,k:[80.171,53.448],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Crater",np:3,cix:2,ix:2,mn:"ADBE Vector Group",hd:false},{ty:"gr",it:[{ind:0,ty:"sh",ix:1,ks:{a:0,k:{i:[[0,-33.137],[33.137,0],[0,33.137],[-33.137,0]],o:[[0,33.137],[-33.137,0],[0,-33.137],[33.137,0]],v:[[60,0],[0,60],[-60,0],[0,-60]],c:true},ix:2},nm:"Path 1",mn:"ADBE Vector Shape - Group",hd:false},{ty:"fl",c:{a:1,k:[{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:0,s:[1,0.940106153488,0.53420650959,1],e:[0.933000033509,0.991999966491,1,1]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:24,s:[0.933000033509,0.991999966491,1,1],e:[0.933000033509,0.991999966491,1,1]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:48,s:[0.933000033509,0.991999966491,1,1],e:[1,0.940106153488,0.53420650959,1]},{t:72}],ix:4},o:{a:0,k:100,ix:5},r:1,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false},{ty:"tr",p:{a:0,k:[60.25,60.25],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Moon",np:2,cix:2,ix:3,mn:"ADBE Vector Group",hd:false}],ip:0,op:1224,st:0,bm:0},{ddd:0,ind:3,ty:4,nm:"Stars",sr:1,ks:{o:{a:1,k:[{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:11,s:[0],e:[100]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:13,s:[100],e:[100]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:59,s:[100],e:[0]},{t:61}],ix:11},r:{a:0,k:0,ix:10},p:{s:true,x:{a:1,k:[{i:{x:[0.101],y:[0.954]},o:{x:[0.9],y:[0]},n:["0p101_0p954_0p9_0"],t:0,s:[304.75],e:[190.55]},{i:{x:[0.438],y:[0.439]},o:{x:[0.397],y:[0.396]},n:["0p438_0p439_0p397_0p396"],t:24,s:[190.55],e:[184.75]},{i:{x:[0.1],y:[1]},o:{x:[0.899],y:[-0.043]},n:["0p1_1_0p899_-0p043"],t:48,s:[184.75],e:[304.75]},{t:72}],ix:3},y:{a:0,k:212.75,ix:4}},a:{a:0,k:[0,0,0],ix:1},s:{a:0,k:[100,100,100],ix:6}},ao:0,shapes:[{ty:"gr",it:[{d:1,ty:"el",s:{a:0,k:[10,10],ix:2},p:{a:0,k:[0,0],ix:3},nm:"Ellipse Path 1",mn:"ADBE Vector Shape - Ellipse",hd:false},{ty:"st",c:{a:0,k:[1,1,1,1],ix:3},o:{a:0,k:100,ix:4},w:{a:0,k:32,ix:5},lc:1,lj:1,ml:4,ml2:{a:0,k:4,ix:8},nm:"Stroke 1",mn:"ADBE Vector Graphic - Stroke",hd:true},{ty:"fl",c:{a:0,k:[0.933333333333,0.992156862745,1,1],ix:4},o:{a:0,k:100,ix:5},r:1,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false},{ty:"tr",p:{a:0,k:[-32.5,65],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Star 03",np:3,cix:2,ix:1,mn:"ADBE Vector Group",hd:false},{ty:"gr",it:[{d:1,ty:"el",s:{a:0,k:[6,6],ix:2},p:{a:0,k:[0,0],ix:3},nm:"Ellipse Path 1",mn:"ADBE Vector Shape - Ellipse",hd:false},{ty:"st",c:{a:0,k:[1,1,1,1],ix:3},o:{a:0,k:100,ix:4},w:{a:0,k:32,ix:5},lc:1,lj:1,ml:4,ml2:{a:0,k:4,ix:8},nm:"Stroke 1",mn:"ADBE Vector Graphic - Stroke",hd:true},{ty:"fl",c:{a:0,k:[0.933333333333,0.992156862745,1,1],ix:4},o:{a:0,k:100,ix:5},r:1,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false},{ty:"tr",p:{a:0,k:[47.5,45],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Star 02",np:3,cix:2,ix:2,mn:"ADBE Vector Group",hd:false},{ty:"gr",it:[{d:1,ty:"el",s:{a:0,k:[8,8],ix:2},p:{a:0,k:[0,0],ix:3},nm:"Ellipse Path 1",mn:"ADBE Vector Shape - Ellipse",hd:false},{ty:"st",c:{a:0,k:[1,1,1,1],ix:3},o:{a:0,k:100,ix:4},w:{a:0,k:32,ix:5},lc:1,lj:1,ml:4,ml2:{a:0,k:4,ix:8},nm:"Stroke 1",mn:"ADBE Vector Graphic - Stroke",hd:true},{ty:"fl",c:{a:0,k:[0.933333333333,0.992156862745,1,1],ix:4},o:{a:0,k:100,ix:5},r:1,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false},{ty:"tr",p:{a:0,k:[0,0],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Star 01",np:3,cix:2,ix:3,mn:"ADBE Vector Group",hd:false}],ip:0,op:96,st:0,bm:0},{ddd:0,ind:4,ty:4,nm:"Cloud 1",sr:1,ks:{o:{a:1,k:[{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:11,s:[100],e:[0]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:13,s:[0],e:[0]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:59,s:[0],e:[100]},{t:61}],ix:11},r:{a:0,k:0,ix:10},p:{s:true,x:{a:1,k:[{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:0,s:[275.5],e:[184]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:24,s:[184],e:[184]},{i:{x:[0.102],y:[0.92]},o:{x:[0.9],y:[0]},n:["0p102_0p92_0p9_0"],t:48,s:[184],e:[269.054]},{i:{x:[0.731],y:[1]},o:{x:[0.225],y:[0.253]},n:["0p731_1_0p225_0p253"],t:72,s:[269.054],e:[275.5]},{t:95}],ix:3},y:{a:0,k:220,ix:4}},a:{a:0,k:[0,0,0],ix:1},s:{a:0,k:[100,100,100],ix:6}},ao:0,shapes:[{ty:"gr",it:[{ind:0,ty:"sh",ix:1,ks:{a:0,k:{i:[[4.193,0.263],[4.158,0],[0,0],[0.688,-3.952],[0,0],[0,-4.43],[0,0],[-4.43,0],[0,0],[0,4.43],[0,0]],o:[[-0.677,-3.965],[0,0],[-4.149,0],[0,0],[-4.43,0],[0,0],[0,4.43],[0,0],[4.43,0],[0,0],[0,-4.259]],v:[[11.887,-4.516],[3.601,-11.5],[3.601,-11.5],[-4.68,-4.542],[-11.38,-4.542],[-19.401,3.479],[-19.401,3.479],[-11.38,11.5],[11.38,11.5],[19.401,3.479],[19.401,3.479]],c:true},ix:2},nm:"Path 1",mn:"ADBE Vector Shape - Group",hd:false},{ty:"st",c:{a:0,k:[1,1,1,1],ix:3},o:{a:0,k:100,ix:4},w:{a:0,k:32,ix:5},lc:1,lj:1,ml:4,ml2:{a:0,k:4,ix:8},nm:"Stroke 1",mn:"ADBE Vector Graphic - Stroke",hd:true},{ty:"fl",c:{a:0,k:[1,1,1,1],ix:4},o:{a:0,k:100,ix:5},r:1,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false},{ty:"tr",p:{a:0,k:[0,0],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Shape 1",np:3,cix:2,ix:1,mn:"ADBE Vector Group",hd:false}],ip:0,op:96,st:0,bm:0},{ddd:0,ind:5,ty:4,nm:"Cloud 2",sr:1,ks:{o:{a:1,k:[{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:11,s:[100],e:[0]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:13,s:[0],e:[0]},{i:{x:[0.833],y:[0.833]},o:{x:[0.167],y:[0.167]},n:["0p833_0p833_0p167_0p167"],t:59,s:[0],e:[100]},{t:61}],ix:11},r:{a:0,k:0,ix:10},p:{s:true,x:{a:1,k:[{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:0,s:[330.5],e:[167.5]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:24,s:[167.5],e:[167.5]},{i:{x:[0.101],y:[0.95]},o:{x:[0.9],y:[0]},n:["0p101_0p95_0p9_0"],t:48,s:[167.5],e:[324.054]},{i:{x:[0.731],y:[1]},o:{x:[0.218],y:[0.284]},n:["0p731_1_0p218_0p284"],t:72,s:[324.054],e:[330.5]},{t:95}],ix:3},y:{a:0,k:265,ix:4}},a:{a:0,k:[0,0,0],ix:1},s:{a:0,k:[100,100,100],ix:6}},ao:0,shapes:[{ty:"gr",it:[{ind:0,ty:"sh",ix:1,ks:{a:0,k:{i:[[6.375,0.399],[6.322,0],[0,0],[1.046,-6.009],[0,0],[0,-6.736],[0,0],[-6.736,0],[0,0],[0,6.736],[0,0]],o:[[-1.03,-6.029],[0,0],[-6.308,0],[0,0],[-6.736,0],[0,0],[0,6.736],[0,0],[6.736,0],[0,0],[0,-6.476]],v:[[16.075,-1.367],[3.476,-11.986],[3.476,-11.986],[-9.116,-1.406],[-19.304,-1.406],[-31.5,10.79],[-31.5,10.79],[-19.304,22.986],[15.304,22.986],[27.5,10.79],[27.5,10.79]],c:true},ix:2},nm:"Path 1",mn:"ADBE Vector Shape - Group",hd:false},{ty:"st",c:{a:0,k:[1,1,1,1],ix:3},o:{a:0,k:100,ix:4},w:{a:0,k:32,ix:5},lc:1,lj:1,ml:4,ml2:{a:0,k:4,ix:8},nm:"Stroke 1",mn:"ADBE Vector Graphic - Stroke",hd:true},{ty:"fl",c:{a:0,k:[1,1,1,1],ix:4},o:{a:0,k:100,ix:5},r:1,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false},{ty:"tr",p:{a:0,k:[0,0],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Shape 1",np:3,cix:2,ix:1,mn:"ADBE Vector Group",hd:false}],ip:0,op:96,st:0,bm:0},{ddd:0,ind:6,ty:4,nm:"Shadow",sr:1,ks:{o:{a:0,k:15,ix:11},r:{a:0,k:0,ix:10},p:{a:0,k:[250,180,0],ix:2},a:{a:0,k:[0,-37.154,0],ix:1},s:{a:0,k:[100,100,100],ix:6}},ao:0,shapes:[{ty:"gr",it:[{ind:0,ty:"sh",ix:1,ks:{a:0,k:{i:[[37.432,0],[0,0],[0,-37.432],[0,0],[-0.021,-0.694],[-36.733,0],[0,0],[-1.105,-36.465],[0,0.699],[0,0]],o:[[0,0],[-37.432,0],[0,0],[0,0.699],[1.105,-36.465],[0,0],[36.733,0],[0.021,-0.694],[0,0],[0,-37.432]],v:[[82.223,-37.154],[-82.223,-37.154],[-150,30.623],[-150,35.069],[-149.947,37.154],[-82.223,-28.538],[82.223,-28.538],[149.947,37.154],[150,35.069],[150,30.623]],c:true},ix:2},nm:"Path 1",mn:"ADBE Vector Shape - Group",hd:false},{ty:"st",c:{a:0,k:[0.933333333333,0.992156862745,1,1],ix:3},o:{a:0,k:100,ix:4},w:{a:0,k:1,ix:5},lc:1,lj:1,ml:4,ml2:{a:0,k:4,ix:8},nm:"Stroke 1",mn:"ADBE Vector Graphic - Stroke",hd:true},{ty:"fl",c:{a:0,k:[0,0,0,1],ix:4},o:{a:0,k:100,ix:5},r:1,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false},{ty:"tr",p:{a:0,k:[0,0],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Shape 1",np:3,cix:2,ix:1,mn:"ADBE Vector Group",hd:false}],ip:0,op:96,st:0,bm:0},{ddd:0,ind:7,ty:4,nm:"Base",sr:1,ks:{o:{a:0,k:100,ix:11},r:{a:0,k:0,ix:10},p:{a:0,k:[250,180,0],ix:2},a:{a:0,k:[0,-70,0],ix:1},s:{a:0,k:[100,100,100],ix:6}},ao:0,shapes:[{ty:"gr",it:[{ty:"rc",d:1,s:{a:0,k:[300,140],ix:2},p:{a:0,k:[0,0],ix:3},r:{a:0,k:320,ix:4},nm:"Rectangle Path 1",mn:"ADBE Vector Shape - Rect",hd:false},{ty:"fl",c:{a:1,k:[{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:0,s:[0.413832724094,0.784281790257,1,1],e:[0.0580506064,0.077281616628,0.256188720465,1]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:24,s:[0.0580506064,0.077281616628,0.256188720465,1],e:[0.0580506064,0.077281616628,0.256188720465,1]},{i:{x:[0.1],y:[1]},o:{x:[0.9],y:[0]},n:["0p1_1_0p9_0"],t:48,s:[0.0580506064,0.077281616628,0.256188720465,1],e:[0.413832724094,0.784281790257,1,1]},{t:72}],ix:4},o:{a:0,k:100,ix:5},r:1,nm:"Fill 1",mn:"ADBE Vector Graphic - Fill",hd:false},{ty:"tr",p:{a:0,k:[0,0],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Rectangle 1",np:2,cix:2,ix:1,mn:"ADBE Vector Group",hd:false}],ip:0,op:96,st:0,bm:0},{ddd:0,ind:8,ty:4,nm:"BG",sr:1,ks:{o:{a:0,k:100,ix:11},r:{a:0,k:0,ix:10},p:{a:0,k:[250,250,0],ix:2},a:{a:0,k:[0,0,0],ix:1},s:{a:0,k:[100,100,100],ix:6}},ao:0,shapes:[{ty:"gr",it:[{ty:"rc",d:1,s:{a:0,k:[500,500],ix:2},p:{a:0,k:[0,0],ix:3},r:{a:0,k:0,ix:4},nm:"Rectangle Path 1",mn:"ADBE Vector Shape - Rect",hd:false},{ty:"st",c:{a:0,k:[1,1,1,1],ix:3},o:{a:0,k:100,ix:4},w:{a:0,k:18.8,ix:5},lc:1,lj:1,ml:4,ml2:{a:0,k:4,ix:8},nm:"Stroke 1",mn:"ADBE Vector Graphic - Stroke",hd:true},{ty:"tr",p:{a:0,k:[0,0],ix:2},a:{a:0,k:[0,0],ix:1},s:{a:0,k:[100,100],ix:3},r:{a:0,k:0,ix:6},o:{a:0,k:100,ix:7},sk:{a:0,k:0,ix:4},sa:{a:0,k:0,ix:5},nm:"Transform"}],nm:"Rectangle 1",np:3,cix:2,ix:1,mn:"ADBE Vector Group",hd:false}],ip:0,op:96,st:0,bm:0}];var markers=[];var animationData = {v:v,fr:fr,ip:ip,op:op,w:w,h:h,nm:nm,ddd:ddd,assets:assets,layers:layers,markers:markers};

    const { lottie } = globalThis;

    const RATIO = 320 / 149.3333;
    const OUTER_RATIO = 320 / 192;

    const defaultOptions = {
        width: 320,
        //height: 150,
        useThemeHandler: true,
        initialTheme: undefined,
    };

    class Button extends EventBus {
        constructor (container, options) {
            super("ButtonBus");

            this.options = Object.assign({}, defaultOptions, options);
            if (this.options.height) {
                this.options.width = this._getOuterWidth();
            }
            if (this.options.useThemeHandler) {
                ThemeHandler.init();
                ThemeHandler.on("themeChanged", this.onThemeChanged, this);
            }

            this.outerContainer = document.createElement("div");
            this.outerContainer.classList.add("toggleContainer", "toggleButton");

            const innerWidth = this._getInnerWidth();
            this.innerContainer = document.createElement("div");
            this.innerContainer.style.width = `${innerWidth}px`;
            this.innerContainer.style.height = `${innerWidth}px`;

            this.outerContainer.appendChild(this.innerContainer);
            container.appendChild(this.outerContainer);

            this.outerContainer.addEventListener("click", (evt) => {
                this._toggle();
            });

            this.player = lottie.loadAnimation({
                container: this.innerContainer,
                renderer: "svg",
                animationData: animationData,
                loop: false,
                autoplay: false,
            });
            this.player.addEventListener("DOMLoaded", (evt) => {
                this._setContainerWidth();
            });
            this.player.setSpeed(2);

            this.wrapper = new ToggleAnimation(this, this.player);
            this.wrapper.on("animationComplete", this.onAnimationComplete, this);

            this.animations = {
                toDark: {
                    start: 2,
                    end: 50,
                },
                toLight: {
                    start: 51,
                    end: 80,
                    // end: 96
                },
            };

            const { useThemeHandler, initialTheme } = this.options;
            const theme = initialTheme || (useThemeHandler && ThemeHandler.getTheme());

            switch (theme) {
                case "light":
                    this.player.goToAndStop(this.animations.toLight.end, true);
                    this.currentAnimation = "toLight";
                    break;

                // case "dark":
                default:
                    this.player.goToAndStop(this.animations.toDark.end, true);
                    this.currentAnimation = "toDark";
                    break;
            }
        }

        _getOuterWidth () {
            return this.options.height * RATIO;
        }

        _getInnerWidth () {
            return this.options.width * OUTER_RATIO;
        }

        _setContainerWidth () {
            const width = this.options.width;
            const height = this.options.width / RATIO;
            this.outerContainer.style.width = `${width}px`;
            this.outerContainer.style.height = `${height}px`;
        }

        _getInverseAnimation () {
            return this.currentAnimation === "toDark" ? "toLight" : "toDark";
        }

        _getTheme () {
            return this.currentAnimation === "toDark" ? "dark" : "light";
        }

        _toggle () {
            const nextAnim = this._getInverseAnimation();
            const data = this.animations[nextAnim];

            this.wrapper.play(data.start, data.end);

            this.currentAnimation = nextAnim;
            const theme = this._getTheme();

            this.emit("click", { theme });
            this.emit("animationStart", { theme });

            if (this.options.useThemeHandler) {
                ThemeHandler.setTheme(theme);
            }
        }

        onAnimationComplete () {
            const theme = this._getTheme();

            this.emit("animationComplete", { theme });
        }

        onThemeChanged (evt) {
            const theme = this._getTheme();
            if (evt.theme !== theme) {
                this._toggle();
            }
        }
    }

    const styleTemplate = document.createElement("template");
    styleTemplate.innerHTML = `<style>.toggleContainer {
    margin: 0.5em;
    cursor: pointer;

    /* The animation button occupys a larger square
    You can get the button size by looking at the size
    of the inner svg elements via the debugger */
    /* width: 192px;
    height: 90px; */
    overflow: hidden;

    /* center content */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}</style>`;

    class Toggle extends HTMLElement {
        connectedCallback() {
            // Create a shadow root
            this.attachShadow({mode: "open"});

            const options = {
                width: this.getAttribute("width")
            };

            this.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
            this.button = new Button(this.shadowRoot, options);
        }

        on (...args) {
            return this.button?.on(...args);
        }

        once (...args) {
            return this.button?.once(...args);
        }

        off (...args) {
            return this.button?.off(...args);
        }
    }

    window.customElements.define("dark-mode-toggle", Toggle);

    globalThis.darkModeToggle = {
        Button,
        ThemeHandler,
    };

}());
