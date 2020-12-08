/*
 * @Descripttion: 
 * @version: 
 * @Author: rodrick
 * @Date: 2020-12-08 23:21:18
 * @LastEditors: rodrick
 * @LastEditTime: 2020-12-08 23:22:00
 */
let currentDroppable = null;

    ball.onmousedown = function(event) {
      // 单击的X - ball的x = 球内边最左侧距离点击位置
      let shiftX = event.clientX - ball.getBoundingClientRect().left;
      let shiftY = event.clientY - ball.getBoundingClientRect().top;
      // 绝对定位嵌入body[方便定位]  且保持在最上方
      ball.style.position = 'absolute';
      ball.style.zIndex = 1000;
      document.body.append(ball);

      moveAt(event.pageX, event.pageY);

      function moveAt(pageX, pageY) {
        // 文档x - 刚才计算的内部距离x
        ball.style.left = pageX - shiftX + 'px';
        ball.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
        // 隐藏球是为了elementFromPoint能获取球以外最深元素，否则会一直获取到球
        ball.hidden = true;
        // elementFromPoint获取除了ball以外最深(最上层的元素)[一开始是body，后面变为gate]
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        // 记得把球显示出来 不然画面上球消失了
        ball.hidden = false;
        // 移出画面了
        if (!elemBelow) return;
        // 查找当前最深元素的父级有没有目标元素gate，有就拿到他
        let droppableBelow = elemBelow.closest('.droppable');
        // 当球移入gate瞬间 currentDroppable=null，droppableBelow=gate
        // 然后不走if1 currentDroppable=droppableBelow=gate
        // 然后走if2 设置背景色
        // 在离开前都不会走 大if
        // 当球离开gate瞬间 currentDroppable=gate，droppableBelow=null
        // 此时走 if1,去除背景色，然后currentDroppable=droppableBelow=null
        if (currentDroppable != droppableBelow) {
          console.log(currentDroppable,droppableBelow)
          if (currentDroppable) { // 当我们在此事件之前没有超过可放置对象时为null
            leaveDroppable(currentDroppable);
          }
          currentDroppable = droppableBelow;
          if (currentDroppable) { // 如果我们现在不通过droppable，则返回null
            // (maybe just left the droppable)
            enterDroppable(currentDroppable);
          }
        }
      }

      document.addEventListener('mousemove', onMouseMove);

      ball.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        ball.onmouseup = null;
      };

    };

    function enterDroppable(elem) {
      elem.style.background = 'pink';
      document.querySelector('p').textContent="球进啦！"
    }

    function leaveDroppable(elem) {
      elem.style.background = '';
      document.querySelector('p').textContent="球跑啦！"
    }

    ball.ondragstart = function() {
      return false;
    };