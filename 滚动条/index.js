/*
 * @Descripttion: 
 * @version: 
 * @Author: rodrick
 * @Date: 2020-12-08 23:17:25
 * @LastEditors: rodrick
 * @LastEditTime: 2020-12-08 23:19:00
 */
let thumb = document.querySelector(".thumb");

thumb.onmousedown = function (e) {
  // 获取鼠标点击坐标与内边距差值
  let shiftX = e.clientX - thumb.getBoundingClientRect().left;

  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", mouseup);

  function mousemove(e) {
    // 获取子元素当前距离父元素的最左侧有多远
    // 点击坐标 - 内边距 - 父元素坐标left
    let leftVal = e.clientX - shiftX - slider.getBoundingClientRect().left;
    // 判断左右极限位置
    if (leftVal < 0) {
      leftVal = 0;
    }

    if (leftVal > slider.offsetWidth - thumb.offsetWidth) {
      leftVal = slider.offsetWidth - thumb.offsetWidth;
    }
    // 给子元素赋值位置left
    thumb.style.left = leftVal + "px";
  }

  function mouseup() {
    // mouseup 时，移除所有的刚才绑定的事件，包括 mouseup 本身
    document.removeEventListener("mouseup", mouseup);
    document.removeEventListener("mousemove", mousemove);
  }
};

// 禁用原生方法
thumb.ondragstart = function () {
  return false;
};
