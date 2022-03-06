import { FC } from 'react';
import Styles from './calendar.module.scss';

const Calendar: FC<{}> = (): JSX.Element => {
  return (
    <div className={Styles.calendarContainer}>
      <h1>Render Calendar component here</h1>
    </div>
  );
};

export default Calendar;
