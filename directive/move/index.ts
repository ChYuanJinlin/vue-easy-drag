import { App, DirectiveBinding, nextTick } from "vue";
type elementsType = { currentEL: HTMLElement, currentPar?: HTMLElement }
const elements: elementsType[] = []
export default {
    install(app: App<Element>, options: { name: string }) {
        app.directive(options?.name || 'move', {
            mounted(el: HTMLElement, obj: DirectiveBinding<{ isMove: boolean, target: string }>) {
                if (obj?.value?.isMove == false) {
                    return
                }

                if (obj?.value?.target) {
                    elements.push({ currentEL: el })

                    function getNeedParent(parent: HTMLElement, element: elementsType) {

                        if (parent.className != obj.value.target) {
                            nextTick(() => {
                                if (parent.offsetParent != null) {

                                    getNeedParent((parent.offsetParent as HTMLElement), element)
                                }
                            }).then(() => {

                                elements.forEach(item => {


                                    if (item.currentPar != null) {
                                        item.currentEL.onmousedown = function (e: MouseEvent) {

                                            item.currentEL.style.cursor = 'move'
                                            //div的偏移量 鼠标.clentX - 元素.offsetLeft
                                            //div的偏移量 鼠标.clentY - 元素.offsetTop
                                            var ol = e.clientX - item.currentPar.offsetLeft;
                                            var ot = e.clientY - item.currentPar.offsetTop;

                                            document.onmousemove = function (e) {
                                                var left = e.clientX - ol;
                                                var top = e.clientY - ot;
                                                item.currentPar.style.left = left + "px";
                                                item.currentPar.style.top = top + "px";
                                                e.stopPropagation()
                                            };

                                            document.onmouseup = function (e: MouseEvent) {
                                                //当鼠标松开时，被拖拽元素固定在当前位置	onmouseup
                                                //取消document的onmousemove事件
                                                document.onmousemove = null;
                                                //取消document的onmouseup事件
                                                document.onmouseup = null;
                                                // //当鼠标松开时，取消对事件的捕获
                                                // el.releaseCapture && el.releaseCapture();
                                                item.currentEL.style.cursor = 'auto'
                                                e.stopPropagation()
                                            };
                                            e.stopPropagation()
                                        };

                                    }




                                })


                            })


                        } else {
                            element.currentPar = parent
                        }
                    }
                    elements.forEach(el => {
                        getNeedParent(el.currentEL, el)
                    })




                } else {
                    el.onmousedown = function (e: MouseEvent) {

                        el.style.cursor = 'move'
                        //div的偏移量 鼠标.clentX - 元素.offsetLeft
                        //div的偏移量 鼠标.clentY - 元素.offsetTop
                        var ol = e.clientX - el.offsetLeft;
                        var ot = e.clientY - el.offsetTop;

                        document.onmousemove = function (e) {
                            var left = e.clientX - ol;
                            var top = e.clientY - ot;
                            el.style.left = left + "px";
                            el.style.top = top + "px";
                            e.stopPropagation()
                        };

                        document.onmouseup = function (e: MouseEvent) {
                            //当鼠标松开时，被拖拽元素固定在当前位置	onmouseup
                            //取消document的onmousemove事件
                            document.onmousemove = null;
                            //取消document的onmouseup事件
                            document.onmouseup = null;
                            // //当鼠标松开时，取消对事件的捕获
                            // el.releaseCapture && el.releaseCapture();
                            el.style.cursor = 'auto'
                            e.stopPropagation()
                        };
                        e.stopPropagation()
                    };


                }
            },
        })
        return app
    }
}
