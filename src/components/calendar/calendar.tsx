import { FC, useEffect, useState } from 'react';
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
			<div className={Styles.calendarElement}>
				{arrayDaysMonth.map((day: number, _: number) => {
					return (
						<div key={day} className={Styles.day}>
							<p>{day}</p>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div className={Styles.mainContainer}>
			<Calendar currentMonthDays={calendarData.currentMonthDays} />
		</div>
	);
};

export default Calendar;
