# dropDownRefresh
简单的移动端下拉刷新实现
使用方法：
1.import封装的js文件
import DropDownRefresh from '../extends/myDropDownRefresh'
2.声明一个DropDownRefresh对象并进行初始化
let ddr = new DropDownRefresh({
                el: 'abc',  //下拉刷新控件绑定的元素，将在此元素的上方添加刷新控件，并通过监听此元素的下拉事件
                loadingTxt: '正在拼命加载中 ...',  //下拉加载时显示的文字
                height: 150,  //下拉控件的高度，宽度默认为父元素的100%
                loadingCallBack: function () {  //下拉执行的刷新操作，通过返回一个promise实例进行异步操作
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            console.log('我是自定义的回调');
                            resolve();
                        }, 3000)
                    }).then(function () {
                        console.log('外面也完成了哦');
                    }, function () {

                    });
                }
            });
