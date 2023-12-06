import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./NineBoxLottery.scss";
import Tween from "../utils/tween.js";

// 调动的下标顺序
const lotterySort = [0, 1, 2, 5, 8, 7, 6, 3];

/**
 * 九宫格抽奖组件
 * activeStyle:滚动格子的样式
 * lotteryList:Array<{prizeId,prizePic,prizeName,customRender,...other}>, customRender有的时候优先使用 第五个固定为抽奖按钮图片, 只需要prizePic或者customRender就可以
 * winId:中奖的奖品id, 对应lotteryList中的prizeId
 * endCb:抽奖结束回调
 * startClickCb:抽奖按钮点击回调, 返回true才会开始抽奖, 用于业务校验等逻辑
 * initSpeed:初始开始的跳转速度
 * fastSpeed: 最快时候的速度(速度越快 这个值越小)
 * slowSpeed: 最慢时候的速度(速度越慢 这个值越大)
 * numberOfTurns: 转动总圈数
 */
const NineBoxLottery = (
  {
    activeStyle = {},
    lotteryList,
    winPrizeIndex,
    endCb = () => {},
    startClickCb = () => {
      return true;
    },
    initSpeed = 300,
    fastSpeed = 50,
    slowSpeed = 1000,
    numberOfTurns = 8,
  },
  ref
) => {
  const [isStart, setIsStart] = useState(false); // 是否开始抽奖
  const [curIndex, setCurIndex] = useState(-1); // 当前旋转到的下标  初始-1
  const speed = useRef(initSpeed); // 调动的延时器时长
  const totalStep = useRef(0); // 总共多少步
  const curStep = useRef(0); // 当前走了多少步
  const timer = useRef(null); // 定时器

  useImperativeHandle(
    ref,
    () => ({
      // 暴露重置方法
      reset() {
        setIsStart(false);
        setCurIndex(-1);
        speed.current = initSpeed;
        totalStep.current = 0;
        curStep.current = 0;
        timer.current && clearTimeout(timer.current);
      },
    }),
    []
  );

  // 点击抽奖按钮
  const handleStart = () => {
    const checkPass = handleCheck();
    if (checkPass && !isStart) {
      const canStart = startClickCb();
      if (canStart) {
        setIsStart(true);

        // 计算总共多少步 圈数*8 + 奖品所在下标 = 总步数
        const total = numberOfTurns * 8 + lotterySort.indexOf(winPrizeIndex);
        totalStep.current = total;

        startRun();
      }
    }
  };

  // 抽奖前校验
  const handleCheck = () => {
    if (lotterySort.indexOf(winPrizeIndex) < 0) {
      console.error("[九宫格] 中奖下标不在抽奖列表中");
      return false;
    }

    if (lotteryList.length !== 9) {
      console.error("[九宫格] 抽奖列表长度不为9");
      return false;
    }

    // 检查是否都有图片
    const hasImg = lotteryList.every((item) => {
      return item.prizePic;
    });

    if (!hasImg) {
      console.error("[九宫格] 抽奖列表中有图片为空");
      return false;
    }

    return true;
  };

  const startRun = () => {
    // 延时器的速度要动态调节
    timer.current && clearTimeout(timer.value);

    // console.log(`已走步数=${curStep.current}, 执行总步数=${totalStep.current}`);

    // 已走步数超过要执行总步数, 则停止
    if (curStep.current >= totalStep.current) {
      setIsStart(false);
      setCurIndex(winPrizeIndex);
      endCb();
      return;
    }

    // 高亮抽奖格子序号
    setCurIndex(lotterySort[curStep.current % 8]);
    // 速度调整
    speed.current = calcSpeed(speed.current);

    console.log("当前速度", speed.current);

    timer.current = setTimeout(() => {
      curStep.current++;
      startRun();
    }, speed.current);
  };

  // 计算当前的速度
  // https://www.zhangxinxu.com/wordpress/2016/12/how-use-tween-js-animation-easing/
  const calcSpeed = (speed) => {
    // 需要加速的前段步数 加速到三分之一
    const frontSteps = Math.floor(totalStep.current * (1 / 3));
    // 需要减速的后段步数 六分之一开始减速
    const midSteps = Math.floor(totalStep.current * (5 / 6));
    // 前段加速，中段匀速，后段减速
    if (curStep.current < frontSteps && speed > fastSpeed) {
      // 加速 加速是减去值
      // speed = speed - Math.floor((initSpeed - fastSpeed) / frontSteps);

      // 改成Tween 加速的目标是速度从initSpeed 到达 fastSpeed
      speed = Math.floor(
        Tween.Cubic.easeOut(
          curStep.current,
          initSpeed,
          fastSpeed - initSpeed,
          frontSteps
        )
      );

      console.log("加速", speed);
    } else if (curStep.current > midSteps && speed < slowSpeed) {
      // 减速不一定要减速到最慢速度，优先保证动画效果看着协调 减速是加上值
      // speed =
      //   speed +
      //   Math.floor(
      //     (slowSpeed - fastSpeed) / Math.floor(totalStep.current - midSteps)
      //   );

      // 改成Tween 减速的目标是速度从fastSpeed 到达 slowSpeed
      speed = Math.floor(
        Tween.Cubic.easeIn(
          curStep.current - midSteps,
          fastSpeed,
          slowSpeed - fastSpeed,
          totalStep.current - midSteps
        )
      );
      console.log("减速", speed);
    }
    return speed;
  };

  return (
    <div className="lottery__wrap">
      {lotteryList.map((item, index) => {
        const { prizeId, prizePic, prizeName, customRender } = item;
        if (index === 4) {
          // 抽奖按钮
          return (
            <div
              className="lottery__item lottery__item--btn"
              key={index}
              onClick={handleStart}
            >
              <img
                className="lottery__item--img"
                src={prizePic}
                alt={prizeName}
              />
            </div>
          );
        }
        return (
          <div
            className={`lottery__item ${
              curIndex === index ? "lottery__item--active" : ""
            }`}
            style={curIndex === index ? activeStyle : {}}
            key={index}
          >
            {
              // 自定义渲染
              customRender ? (
                customRender
              ) : (
                <img
                  className="lottery__item--img"
                  src={prizePic}
                  alt={prizeName}
                />
              )
            }
          </div>
        );
      })}
    </div>
  );
};

export default forwardRef(NineBoxLottery);
