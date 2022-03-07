import { CSSProperties, FC, useEffect, useState } from 'react';
import Styles from './calendar.module.scss';

const Calendar: FC<{}> = (): JSX.Element => {
	interface CalendarDataI {
		today: Date;
		currentMonthDays: number;
		currentYear: number;
	}

	const [calendarData, setCalendarData] = useState<CalendarDataI>({
		today: new Date(),
		currentMonthDays: 0,
		currentYear: 0,
	});

	const WEEK_DAYS_NUMBER = 7;

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
	const weekDays: string[] = [
		weekDaysLabels.pop() as string,
		...weekDaysLabels.slice(0, 7),
	];

	/* *------------------------------------------------------------------------------------------ Calendar logic */

	const updateCalendarData = ({
		updatedData,
	}: {
		updatedData: CalendarDataI;
	}): void => setCalendarData(updatedData);

	const getTodayInformation = (): void => {
		const { today } = calendarData;
		const currentYear: number = today.getFullYear();
		const monthDays: number = new Date(
			currentYear,
			today.getMonth() + 1,
			0
		).getDate();

		updateCalendarData({
			updatedData: {
				today: calendarData.today,
				currentMonthDays: monthDays,
				currentYear,
			},
		});
	};

	/* As soon as the component renders for the first time, based on the current date,
  I want to retrieve how many days there are in the current month (in order to build the numbers UI)
  and the current year */
	useEffect(getTodayInformation, []);

	/* *------------------------------------------------------------------------------------------ UI Calendar components */
	const Calendar = ({ currentMonthDays }: { currentMonthDays: number }) => {
		/* Create an array of numbers containing all the days of the current month */
		const arrayDaysMonth: number[] = [...Array(currentMonthDays)].map(
			(_, i) => i + 1
		);

		return (
			<div
				className={Styles.calendarElement}
				style={{ '--weekDaysNumber': WEEK_DAYS_NUMBER } as CSSProperties}
			>
				{weekDays.map((weekDay: string, _: number) => (
					<div key={weekDay} className={Styles.weekDay}>
						{weekDay}
					</div>
				))}
				{arrayDaysMonth.map((day: number, _: number) => (
					<div key={day} className={Styles.day}>
						<p>{day}</p>
					</div>
				))}
			</div>
		);
	};

	return (
		<div className={Styles.mainContainer}>
			{/* useMemo for whenever the days in the month and the year changes */}
			<Calendar currentMonthDays={calendarData.currentMonthDays} />
		</div>
	);
};

export default Calendar;
