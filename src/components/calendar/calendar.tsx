import { CSSProperties, FC, useEffect, useState } from 'react';
import Styles from './calendar.module.scss';
import cn from 'classnames';
/**
 * TODO: todo
 * @returns
 */
const Calendar: FC<{}> = (): JSX.Element => {
  const TODAY = new Date(new Date().setHours(0, 0, 0, 0));
  const DEFAULT_START_YEAR_OPTION = 1900;
  const DEFAULT_MONTH_INDEXES = {
    FIRST: 0,
    LAST: 11,
  };

  const WEEK_DAYS_NUMBER = 7;
  interface CalendarDataI {
    currentMonthDays: number;
    currentYear?: number;
    currentMonth?: number;
  }

  const [calendarData, setCalendarData] = useState<CalendarDataI>({
    currentMonthDays: 0,
    currentYear: undefined,
    currentMonth: undefined,
  });

  /* Array of string containing the week days */
  const weekDaysLabels: string[] = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];

  /* Return an object containing the label of the week day and its relative index */
  //TODO: remove
  const weekDays: string[] = [
    weekDaysLabels.pop() as string,
    ...weekDaysLabels.slice(0, 7),
  ];

  /* An utils function that allows to build an array from a specific range */
  /**
   *
   * @param start specify the value where we should start building the array from
   * @param end specify the value where we should stop populating the array with numbers
   * @returns an array filled with numbers from a specific range
   */
  const buildArrayFromRange = ({
    start = 0,
    end,
  }: {
    start?: number;
    end: number;
  }): number[] => {
    let currentArray: number[] = [];

    const arraySize: number = end - start;

    if (arraySize > 0) {
      currentArray = [...Array(arraySize)].map((_, i: number) => i + start);
    }

    return [...currentArray, end];
  };

  /* *------------------------------------------------------------------------------------------ Calendar logic */
  enum ArrowFuncEnum {
    BACKWARD = 0,
    FORWARD = 1,
  }

  const handleYearChange = (e: any) => {
    const currentYearClicked: number = +e.target.value;
    setCalendarData((prevState) => {
      return { ...prevState, currentYear: currentYearClicked };
    });
  };

  const handleButtonArrowClick = ({ action }: { action: ArrowFuncEnum }) => {
    setCalendarData((prevState) => {
      const monthIndexValue: number =
        prevState.currentMonth ?? TODAY.getMonth();

      const currentYearValue: number =
        prevState.currentYear ?? TODAY.getFullYear();

      /* EDGE CASE: get the current month index and either subtract/add 1 to it to either go forward or backward.
		If the udated month is less than 0, that means I will be going to the previous year,
		otherwise if it greater than 11 I will be going to th next year */

      if (action === ArrowFuncEnum.BACKWARD) {
        const previousMonthIndex: number = monthIndexValue - 1;
        return {
          ...prevState,
          currentMonth:
            previousMonthIndex < DEFAULT_MONTH_INDEXES.FIRST
              ? DEFAULT_MONTH_INDEXES.LAST
              : previousMonthIndex,
          currentYear:
            previousMonthIndex < DEFAULT_MONTH_INDEXES.FIRST
              ? currentYearValue - 1
              : currentYearValue,
        };
      } else {
        const nextMonthIndex: number = monthIndexValue + 1;
        return {
          ...prevState,
          currentMonth:
            nextMonthIndex > DEFAULT_MONTH_INDEXES.LAST
              ? DEFAULT_MONTH_INDEXES.FIRST
              : nextMonthIndex,
          currentYear:
            nextMonthIndex > DEFAULT_MONTH_INDEXES.LAST
              ? currentYearValue + 1
              : currentYearValue,
        };
      }
    });
  };

  const updateCalendarData = ({
    updatedData,
  }: {
    updatedData: CalendarDataI;
  }): void => setCalendarData(updatedData);

  const getTodayInformation = (): void => {
    console.log('Calculate data for building calendar');

    let updatedObj = {
      /* Same for year */
      currentYear: calendarData.currentYear ?? TODAY.getFullYear(),
      /* If the current month is undefined, that means it is the first time that the component renders,
      so get today's month otherwise calculate the days based on the prev saved month index */
      currentMonth: calendarData.currentMonth ?? TODAY.getMonth(),
    };

    const monthDays: number = new Date(
      updatedObj.currentYear,
      updatedObj.currentMonth + 1,
      0
    ).getDate();

    updateCalendarData({
      updatedData: {
        currentMonthDays: monthDays,
        ...updatedObj,
      },
    });
  };

  /* As soon as the component renders for the first time, based on the current date,
  I want to retrieve how many days there are in the current month (in order to build the numbers UI)
  and the current year */

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getTodayInformation, [
    calendarData.currentMonth,
    calendarData.currentYear,
  ]);

  /* *------------------------------------------------------------------------------------------ UI Calendar components */
  /* TODO: Create component ad-hoc for this */
  const ButtonArrow = ({
    textLabel,
    funcCallback,
    shouldBeHidden = false,
  }: {
    textLabel: string;
    funcCallback?: () => void;
    shouldBeHidden?: boolean;
  }): JSX.Element => {
    const handleButtonClick = (): void => {
      if (!shouldBeHidden) funcCallback?.();
    };

    return (
      <button
        onClick={handleButtonClick}
        style={{ cursor: shouldBeHidden ? 'not-allowed' : 'pointer' }}
      >
        <span>{textLabel}</span>
      </button>
    );
  };

  /* getFullYear() built-in method as a fallback */
  const YearSelector = ({
    currentYear = TODAY.getFullYear(),
    yearsOptions,
    callbackFunc,
  }: {
    currentYear?: number;
    yearsOptions: number[];
    callbackFunc?: (e: any) => void;
  }) => {
    return (
      <select
        name='years'
        id='years'
        onChange={callbackFunc}
        defaultValue={currentYear}
      >
        {yearsOptions.map((year: number, _: number) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    );
  };

  const Calendar = ({ currentMonthDays }: { currentMonthDays: number }) => {
    /* Create an array of numbers containing all the days of the current month */
    const arrayDaysMonth: number[] = buildArrayFromRange({
      start: 1,
      end: currentMonthDays,
    });

    return (
      <div>
        <div className={Styles.buttonArrowsRow}>
          <ButtonArrow
            textLabel='Go backward'
            funcCallback={() =>
              handleButtonArrowClick({ action: ArrowFuncEnum.BACKWARD })
            }
          />

          <YearSelector
            {...{
              currentYear: calendarData.currentYear,
              /* An array filled with numbers needed to populate the HTML select-box */
              yearsOptions: buildArrayFromRange({
                start: DEFAULT_START_YEAR_OPTION,
                end: TODAY.getFullYear(),
              }),
              callbackFunc: handleYearChange,
            }}
          />

          <ButtonArrow
            textLabel='Go forward'
            funcCallback={() =>
              handleButtonArrowClick({ action: ArrowFuncEnum.FORWARD })
            }
            //TODO: refactor
            /* shouldBeHidden={
              (calendarData.currentMonth ?? TODAY.getMonth()) + 1 >
              TODAY.getMonth()
            } */
          />
        </div>
        <div
          className={Styles.calendarElement}
          style={{ '--weekDaysNumber': WEEK_DAYS_NUMBER } as CSSProperties}
        >
          {weekDaysLabels.map((weekDay: string, _: number) => (
            <div key={weekDay} className={Styles.weekDay}>
              {weekDay}
            </div>
          ))}

          {arrayDaysMonth.map((day: number, _: number) => {
            const isToday: boolean =
              new Date(
                calendarData.currentYear ?? TODAY.getFullYear(),
                calendarData.currentMonth ?? TODAY.getMonth(),
                day
              ).getTime() === TODAY.getTime();

            return (
              <div
                key={day}
                className={cn(Styles.day, isToday ? Styles.today : '')}
              >
                <p>{day}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        <p>Current month: {calendarData.currentMonth}</p>
        <p>Current year: {calendarData.currentYear}</p>
      </div>
      <div className={Styles.mainContainer}>
        {/* useMemo for whenever the days in the month and the year changes */}
        <Calendar currentMonthDays={calendarData.currentMonthDays} />
      </div>
    </>
  );
};

export default Calendar;
