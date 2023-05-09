import React, { useEffect, useState } from 'react';

import CountdownTimerStyles from './CountdownTimer.module.css';

type CountdownTimerProps = {
  dropDate: Date;
};

const CountdownTimer = (props: CountdownTimerProps) => {
  const { dropDate } = props;

  // State
  const [timerString, setTimerString] = useState('');

  // useEffectはコンポーネントのロード時に実行されます。
  useEffect(() => {
    // setIntervalを使用して、このコードの一部を1秒ごとに実行します。
    const intervalId = setInterval(() => {
      const currentDate = new Date().getTime();
      const distance = dropDate.getTime() - currentDate;

      // 時間の計算をするだけで、さまざまなプロパティを得ることができます。
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // 得られた出力結果を設定します。
      setTimerString(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      // distanceが0になったらドロップタイムが来たことを示します。
      if (distance < 0) {
        clearInterval(intervalId);
        setTimerString('');
      }
    }, 1000);

    // コンポーネントが取り外されたときには、intervalを初期化しましょう。
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setTimerString('');
      }
    };
  }, []);

  return (
    <div className={CountdownTimerStyles.timerContainer}>
      <p className={CountdownTimerStyles.timerHeader}>
        {' '}
        Candy Drop Starting In{' '}
      </p>
      {timerString && (
        <p className={CountdownTimerStyles.timerValue}>
          {' '}
          {`⏰ ${timerString}`}{' '}
        </p>
      )}
    </div>
  );
};

export default CountdownTimer;
