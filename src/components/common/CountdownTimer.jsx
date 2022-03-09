import React from 'react';

function calculateTimeLeft() {
  const year = new Date().getFullYear();
  const difference = +new Date(`01/31/2022 05:00`) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      day: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  React.useEffect(() => {
    const id = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    return (
      <span >
        {timeLeft[interval]} {interval}{' '}
      </span>
    );
  });

  return (
    <span className='countdown'>
      Place your order in :<br/>{timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </span>
  );
};

export default CountdownTimer;
