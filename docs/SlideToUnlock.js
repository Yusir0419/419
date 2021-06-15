/* Library */
(function () {
    var doc = document,
        div = document.createElement("div"),
        ctn = document.createElement("div"),
        slidectn = document.createElement("div"),
        innerctn = document.createElement("div");

    innerctn.innerHTML = "";
    ctn.style.cssText = "position: absolute;top:25px;left:5px;width: 250px;height: 28px;background-color:rgba(0,0,0,0.5);border: 1px solid rgba(0,0,0,1);border-radius: 99px;";
    ctn.id = "containerSlideTo";
    slidectn.style.cssText = "border: 1px solid rgba(255,255,255,0.2);position: absolute;background-color:#676767;width:70px;height:20px;top:3px;left:3px;border-radius:10px;";
    innerctn.style.cssText = "pointer-events:none;margin-left:40px;line-height:20px;font-size: 20px;color:#676767;text-shadow: 1px 1px rgba(255,255,255,0.2);";
    slidectn.id = "sliderSlideTo";

    slidectn.appendChild(innerctn);
    ctn.appendChild(slidectn);
    div.appendChild(ctn);

    div.id = "SlideToUnlock";
    div.style.cssText = "position:absolute;width:320px;height:60px;background-color:transparent;overflow:hidden;";



    doc.getElementById('screenElements').appendChild(div);




    var getEL = function (el) {
        return document.getElementById(el);
    };

    var acceptsTouch = function () {
        return 'ontouchstart' in document.documentElement;
    };
    var unlockCalled = false;

    function getStyle(oElm, strCssRule) {
        var strValue = "";
        if (document.defaultView && document.defaultView.getComputedStyle) {
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        } else if (oElm.currentStyle) {
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
            strValue = oElm.currentStyle[strCssRule];
        }
        return strValue;
    }

    var drag = function () {
        return {
            move: function (div, xpos, ypos) {
                div.style.left = xpos + "px";
                //div.style.top = ypos + "px"; //not moving y axis in this case
            },
            startMoving: function (div, container, evt) {
                evt = evt || window.event;
                var posX = ((acceptsTouch()) ? evt.touches[0].clientX : evt.clientX),
                    posY = ((acceptsTouch()) ? evt.touches[0].clientY : evt.clientY),
                    divTop = div.style.top.replace('px', ''),
                    divLeft = div.style.left.replace('px', ''),
                    offsetX = posX - divLeft,
                    offsetY = posY - divTop;
                if (acceptsTouch()) {
                    document.getElementById('containerSlideTo').ontouchmove = function (evt) {
                        evt.preventDefault();
                        evt = evt || window.event;
                        var posX = evt.touches[0].clientX,
                            posY = evt.touches[0].clientY,
                            cWidth = getStyle(getEL('containerSlideTo'), 'width').replace('px', ''),
                            dWidth = getStyle(getEL('sliderSlideTo'), 'width').replace('px', ''),
                            finalX = posX - offsetX,
                            finalY = posY - offsetY;
                        if (finalX < 0) {
                            finalX = 0;
                        }
                        if (finalY < 0) {
                            finalY = 0;
                        }
                        if (finalX <= cWidth - dWidth - 8) {
                            drag.move(div, finalX, finalY);
                        }else{
                           //webviewUnlock();
                           if(!unlockCalled){
                                unlockCalled = true;
                                
                               setTimeout(function(){
                                unlockCalled = false;
                                doc.getElementById('sliderSlideTo').style.left = '3px';
                               }, 2000);
                               webviewUnlock();
                           }
                        }
                    };
                } else {
                    document.onmousemove = function (evt) {
                        evt.preventDefault();
                        evt = evt || window.event;
                        var posX = evt.clientX,
                            posY = evt.clientY,
                            cWidth = getStyle(getEL('containerSlideTo'), 'width').replace('px', ''), //container width
                            dWidth = getStyle(getEL('sliderSlideTo'), 'width').replace('px', ''), //slider width
                            finalX = posX - offsetX,
                            finalY = posY - offsetY;
                        if (finalX < 0) {
                            finalX = 0;
                        }
                        if (finalY < 0) {
                            finalY = 0;
                        }
                        if (finalX <= cWidth - dWidth - 8) {
                            drag.move(div, finalX, finalY);
                        }
                    };
                }

            },
            stopMoving: function (div, container, evt) {
                if (acceptsTouch()) {
                    //evt.changedTouches[0].clientX
                    div.style.left = "3px";
                } else {
                    document.getElementById(container).style.cursor = 'default';
                    document.onmousemove = function () {};
                    //evt.clientX
                    div.style.left = "3px";
                }
            },

        };
    }();

    (function () {
        var el = getEL("sliderSlideTo");
        if (acceptsTouch()) {
            el.addEventListener('touchstart', function (e) {
                drag.startMoving(this, 'containerSlideTo', event);
            }, false);

            el.addEventListener('touchend', function (e) {
                drag.stopMoving(this, 'containerSlideTo', event);
                e.preventDefault();
            }, false);

            el.addEventListener('touchcancel', function (e) {
                e.preventDefault();
                drag.stopMoving(this, 'containerSlideTo', event);
            }, false);
        } else {
            el.addEventListener('mousedown', function (e) {
                drag.startMoving(this, 'containerSlideTo', event);
            }, false);

            el.addEventListener('mouseup', function (e) {
                drag.stopMoving(this, 'containerSlideTo', event);
            }, false);
        }
    })();

}());



