/**
 * Created by peterpan on 2018/7/3.
 */
//下拉刷新组件
function DropDownRefresh(cfg) {
    let defaultConfig = {
        loadingCallBack: function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    console.log('我是默认的回调');
                }, 1000);
                resolve()
            })
        },
        loadingTxt: '下拉加载更多',
        bgColor: 'dodgerblue',
        txtColor: 'white',
        height: 100
    };
    let config = cfg;
    for (let item in defaultConfig) {
        config[item] = config[item] || defaultConfig[item];
    }
    this.get = function (n) {
        return config[n];
    };
    this.set = function (n, v) {
        config[n] = v;
    };
    this.getCfg = function () {
        return config;
    };
    this.init();
    this.restoreDom();
}

DropDownRefresh.prototype = {
    loadingSuccess: false,
    isLoading: false,
    init: function () {
        console.log(this.getCfg());
        this.createDom();
        this.loadCssCode('.loading {animation: kfLoading 1s infinite ease-in-out;}\n' +
            '@keyframes kfLoading { 0%, 100% { opacity: 1.0} 50% {opacity: 0.5;} }\n' +
            '.rect { -webkit-animation: stretchdelay 1.2s infinite ease-in-out;animation: stretchdelay 1.2s infinite ease-in-out;}\n' +
            '.rect2 { -webkit-animation-delay: -1.1s;animation-delay: -1.1s;}\n' +
            '.rect3 { -webkit-animation-delay: -1.0s;animation-delay: -1.0s;}\n' +
            '.rect4 { -webkit-animation-delay: -0.9s;animation-delay: -0.9s;}\n' +
            '.rect5 { -webkit-animation-delay: -0.8s;animation-delay: -0.8s;}\n' +
            '@-webkit-keyframes stretchdelay {0%, 40%, 100% { -webkit-transform: scaleY(0.4) }20% { -webkit-transform: scaleY(1.0) }}\n' +
            '@keyframes stretchdelay {0%, 40%, 100% {transform: scaleY(0.4); -webkit-transform: scaleY(0.4);}  20% {transform: scaleY(1.0); -webkit-transform: scaleY(1.0);}}\n'
        );
    },
    restoreDom: function () {
        let _this = this;
        let ddr = document.getElementById('ddr');
        this.loadingSuccess = false;
        this.isLoading = false;
        document.getElementById('ddr_bg').style.borderRadius = '0';
        document.getElementById('ddr_txt').innerText = '下拉可以获取更多';
        ddr.style.top = -(_this.get('height')) + 'px';
    },
    createDom: function () {
        let _this = this;
        let targetEl = document.getElementById(_this.get('el'));
        let ddr = document.createElement('div');
        ddr.id = 'ddr';
        ddr.style.position = 'absolute';
        ddr.style.top = -(_this.get('height')) + 'px';
        ddr.style.width = '100%';
        ddr.style.height = _this.get('height') + 'px';
        ddr.style.transition = 'all .2s';

        let bgStyle = '\"' + "background-color: " + _this.get('bgColor') + ";border: 1px solid lightgray" +
            ";width: 100%;height: 100%;opacity: 1;transition: all .2s;" + '\"';
        let bg = '<div id="ddr_bg" class="loading" ' +
            'style= ' + bgStyle +
            '></div>';

        let spinnerStyle = '\"' + "position:absolute;left: 50%;top: 85%;transform: translate(-50%, -100%);" +
            ";width: 50px;height: 40px;text-align: center;font-size: 10px;" + '\"';
        let rect = '';
        for (let i = 0; i < 5; i++) {
            if (i === 0) {
                rect += '<div class="rect rect' + (i + 1) + '\" ' +
                    'style=" background-color: white;height: 100%;width: 6px;display: inline-block;"></div>'
            } else {
                rect += '<div class="rect rect' + (i + 1) + '\" ' +
                    'style=" margin-left: 4px;background-color: white;height: 100%;width: 6px;display: inline-block;"></div>'
            }

        }
        let spinner = '<div ' +
            'style=' + spinnerStyle +
            '>' + rect +
            '</div>';

        let txtStyle = '\"' + "position: absolute;left: 50%;top: 100%;transform: translate(-50%, -100%);color: " + _this.get('txtColor') + ";" + '\"';
        let txt = '<div id="ddr_txt" ' +
            'style= ' + txtStyle +
            '>' + '下拉可以获取更多' + '</div>';
        ddr.innerHTML = bg + spinner + txt;
        targetEl.appendChild(ddr);


        //定义变量，用于记录坐标和角度
        let startx, starty, movex, movey, endx, endy, nx, ny, angle;

        function touches(target) {
            //通过if语句判断event.type执行了哪个触摸事件
            if (event.type === "touchstart") {
                //获取开始的位置数组的第一个触摸位置
                let touch = event.touches[0];

                //获取第一个坐标的X轴
                startx = Math.floor(touch.pageX);
                //获取第一个坐标的Y轴
                starty = Math.floor(touch.pageY);

                //触摸中的坐标获取
            } else if (event.type === "touchmove") {
                if (!_this.isLoading) {
                    let touch = event.touches[0];
                    movex = Math.floor(touch.pageX);
                    movey = Math.floor(touch.pageY);
                    let offsetY = (movey - starty);
                    if (offsetY <= 0.55 * _this.get('height')) {
                        document.getElementById('ddr').style.top = -(_this.get('height')) + (movey - starty) + 'px';
                        document.getElementById('ddr_bg').style.borderRadius = offsetY + "%";
                    } else if (offsetY > 0.55 * _this.get('height')) {
                        if (!_this.loadingSuccess) {
                            _this.isLoading = true;
                            document.getElementById('ddr_bg').style.borderRadius = "50%";
                            console.log('达到加载位置');
                        } else {
                            console.log('正在加载中');
                        }
                    }
                } else {
                    console.log('loading');
                }
                //当手指离开屏幕或系统取消触摸事件的时候
            } else if (event.type === "touchend" || event.type === "touchcancel") {
                //获取最后的坐标位置
                endx = Math.floor(event.changedTouches[0].pageX);
                endy = Math.floor(event.changedTouches[0].pageY);

                //获取开始位置和离开位置的距离
                nx = endx - startx;
                ny = endy - starty;

                //通过坐标计算角度公式 Math.atan2(y,x)*180/Math.PI
                angle = Math.atan2(ny, nx) * 180 / Math.PI;
                //通过滑动的角度判断触摸的方向
                if (angle < 45 && angle >= -45) {
                    console.log('右滑动');
                } else if (angle < 135 && angle >= 45) {
                    console.log('下滑动');
                } else if ((angle <= 180 && angle >= 135) || (angle >= -180 && angle < -135 )) {
                    console.log('左滑动');
                } else if (angle <= -45 && angle >= -135) {
                    console.log('上滑动');
                }

                if (_this.isLoading) {
                    console.log('即将开始加载数据');
                    document.getElementById('ddr_txt').innerText = _this.get('loadingTxt');
                    //执行加载操作
                    _this.get('loadingCallBack')().then(function () {
                        console.log('加载操作完成');
                        _this.loadingSuccess = true;
                        _this.restoreDom();
                    }, function () {
                        console.log('加载操作失败');
                    });
                } else {
                    //未达到加载数据位置，还原到初始化
                    _this.restoreDom();
                }
            }
        }

        targetEl.addEventListener('touchstart', touches, false);
        targetEl.addEventListener('touchmove', touches, false);
        targetEl.addEventListener('touchend', touches, false);
    },
    loadCssCode: function (code) {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        //for Chrome Firefox Opera Safari
        style.appendChild(document.createTextNode(code));
        //for IE
        //style.styleSheet.cssText = code;
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    },
    stopBrowsScroll: function () {
        // 首先禁止body
        document.body.ontouchmove = function (e) {
            console.log('body ontouchmove preventDefault');
            e.preventDefault();
        };
        // 然后取得触摸点的坐标
        let startX = 0, startY = 0;
        //touchstart事件
        function touchStartFunc(evt) {
            try {
                //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
                let touch = evt.touches[0]; //获取第一个触点
                let x = Number(touch.pageX); //页面触点X坐标
                let y = Number(touch.pageY); //页面触点Y坐标
                //记录触点初始位置
                startX = x;
                startY = y;

            } catch (e) {
                alert('touchStartFunc：' + e.message);
            }
        }

        document.addEventListener('touchstart', touchStartFunc, false);
    }
    ,
    otherMethod: function () {
    }
};

export default DropDownRefresh;
