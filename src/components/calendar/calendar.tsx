import { CSSProperties, FC, useEffect, useState } from 'react';
import Styles from './calendar.module.scss';
/**
 * TODO: todo
 * @returns
 */
const Calendar: FC<{}> = (): JSX.Element => {
	const TODAY = new Date();
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
	const weekDays: string[] = [
		weekDaysLabels.pop() as string,
		...weekDaysLabels.slice(0, 7),
	];

	/* *------------------------------------------------------------------------------------------ Calendar logic */
	enum ArrowFuncEnum {
		BACKWARD = 0,
		FORWARD = 1,
	}

	const handleButtonArrowClick = ({ action }: { action: ArrowFuncEnum }) => {
		setCalendarData((prevState) => {
			/* If the month is a number then get the previous state of the month and either subtract/sum the value of 1 to it,
      otherwise if it is undefined, then */

			const monthIndexValue: number =
				prevState.currentMonth ?? TODAY.getMonth();
			const valueToUpdate: number =
				action === ArrowFuncEnum.BACKWARD
					? monthIndexValue - 1
					: monthIndexValue + 1;
			return { ...prevState, currentMonth: valueToUpdate };
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
	useEffect(getTodayInformation, [
		calendarData.currentMonth,
		calendarData.currentYear,
	]);

	/* *------------------------------------------------------------------------------------------ UI Calendar components */
	/* TODO: Create component ad-hoc for this */
	const ButtonArrow = ({
		textLabel,
		funcCallback,
	}: {
		textLabel: string;
		funcCallback?: () => void;
	}): JSX.Element => {
		const handleButtonClick = () => funcCallback?.();

		return (
			<button onClick={handleButtonClick}>
				<span>{textLabel}</span>
			</button>
		);
	};

	const Calendar = ({ currentMonthDays }: { currentMonthDays: number }) => {
		/* Create an array of numbers containing all the days of the current month */
		const arrayDaysMonth: number[] = [...Array(currentMonthDays)].map(
			(_, i) => i + 1
		);

		return (
			<div>
				<div className={Styles.buttonArrowsRow}>
					<ButtonArrow
						textLabel='Go backward'
						funcCallback={() =>
							handleButtonArrowClick({ action: ArrowFuncEnum.BACKWARD })
						}
					/>

					{/* Remove forward button from DOM if eventually the next month the user will select is greater
          than the current month */}
					{(calendarData.currentMonth ?? TODAY.getMonth()) + 1 <=
						TODAY.getMonth() && (
						<ButtonArrow
							textLabel='Go forward'
							funcCallback={() =>
								handleButtonArrowClick({ action: ArrowFuncEnum.FORWARD })
							}
						/>
					)}
				</div>
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
