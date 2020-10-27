const EduBucket: Record<string, number[]> = {
	'Dropped out Before Matric': [1, 2],
	'Matric': [3],
	'More than Matric': [4, 5, 6, 7, 8, 9]
}

interface SpendingType {
	data: RootReducerState['raw_data']
	filter_val: string,
	filter_Income?: string,
	filter_Education?: string,
	filter_RDD?: string
}
export function Spending({ data, filter_val = 'Overall',
	filter_Income = 'F0', filter_Education = 'None', filter_RDD = 'None' }: SpendingType) {

	const SpendingState: Record<string, number[]> = {
		'February': [],
		'FebruaryR1': [],
		'FebruaryR2': [],
		'May': [],
		'August': [],
		'AugExp': []
	};

	let LowerLimit: number = 0;
	let UpperLimit: number = Number.MAX_VALUE;

	if (filter_Income === 'F1') {
		LowerLimit = 0;
		UpperLimit = 17500;
	}
	else if (filter_Income === 'F2') {
		LowerLimit = 17500;
		UpperLimit = 50000;
	}
	else if (filter_Income === 'F3') {
		LowerLimit = 50000;
		UpperLimit = Number.MAX_VALUE;
	}

	// console.log(Object.values(data).length)
	const Spend = Object.values(data)
		.reduce((agg: Record<string, number[]>, curr: any) => {
			if ((filter_val !== "Overall" ? curr.lt_1 === filter_val : true)) {

				if ((filter_RDD !== "None" ? curr.prefix == filter_RDD : true) &&
					(filter_Education !== "None" ? EduBucket[filter_Education].includes(curr.i_0) : true)) {

					if (curr['spend_1'] !== undefined && curr['spend_1'] > 0
						&& curr['i_6'] > LowerLimit && curr['i_6'] <= UpperLimit) {

						agg['February'].push(curr['spend_1']);

						if (curr['Round'] == 1) {
							if ((curr['spend_2_1'] !== undefined) && (curr['spend_2_1'] > 0)) {
								agg['May'].push(curr['spend_2_1'])
								agg['FebruaryR1'].push(curr['spend_1']);
							}
						}
						if (curr['Round'] == 2) {
							if ((curr['spend_2_1'] !== undefined) && (curr['spend_2_1'] > 0)) {
								agg['August'].push(curr['spend_2_1'])
								agg['FebruaryR2'].push(curr['spend_1']);
							}
							if (curr['spend_3_1'] != undefined && curr['spend_3_1'] >= 0) {
								agg['AugExp'].push(curr['spend_3_1'])
							}
						}
					}
				}
			}
			return agg
		}, SpendingState);
	return Spend
}

interface IncomeType {
	data: RootReducerState['raw_data']
	filter_val: string,
	filter_Income?: string,
	filter_Education?: string,
	filter_RDD?: string
}
export function IncomeData({ data, filter_val = 'Overall',
	filter_Income = 'F0', filter_Education = 'None', filter_RDD = 'None' }: IncomeType) {

	const IncomeMonths: Record<string, number[]> = {
		'February': [],
		'FebruaryR1': [],
		'FebruaryR2': [],
		'MayFeb': [],
		'AugFeb': [],
		'May': [],
		'August': [],
		'AugExp': []
	};
	const BelowMinWage: Record<string, number> = {
		'February': 0,
		'May': 0,
		'August': 0
	};
	const IncomeState: InitiState = {
		Income: IncomeMonths,
		BelowMinWage: BelowMinWage
	};
	type InitiState = {
		Income: Record<string, number[]>
		BelowMinWage: Record<string, number>
	}
	let LowerLimit: number = 0;
	let UpperLimit: number = Number.MAX_VALUE;

	if (filter_Income === 'F1') {
		LowerLimit = 0;
		UpperLimit = 17500;
	}
	else if (filter_Income === 'F2') {
		LowerLimit = 17500;
		UpperLimit = 50000;
	}
	else if (filter_Income === 'F3') {
		LowerLimit = 50000;
		UpperLimit = Number.MAX_VALUE;
	}
	const IncomeAgg = Object.values(data)
		.reduce((agg: InitiState, curr: any) => {
			if ((filter_val !== "Overall" ? curr.lt_1 === filter_val : true)) {
				if ((filter_RDD !== "None" ? curr.prefix == filter_RDD : true) &&
					(filter_Education !== "None" ? EduBucket[filter_Education].includes(curr.i_0) : true)) {

					if (curr['i_6'] !== undefined && curr['i_6'] > LowerLimit
						&& curr['i_6'] <= UpperLimit) {

						if (curr['i_6'] < 17500) agg['BelowMinWage']['February'] += 1
						agg['Income']['February'].push(curr['i_6']);

						if (curr['i_8'] !== undefined && curr['i_8'] >= 0) {
							if (curr['Round'] == 1) {
								agg['Income']['FebruaryR1'].push(curr['i_6']);
								agg['Income']['May'].push(curr['i_8'])
								if (curr['i_8'] < 17500) agg['BelowMinWage']['May'] += 1
							}
							if (curr['Round'] == 2) {
								agg['Income']['FebruaryR2'].push(curr['i_6']);
								agg['Income']['August'].push(curr['i_8'])

								if (curr['i_9_6'] >= 0) {
									agg['Income']['AugExp'].push(curr['i_9_6'])
								}
								if (curr['i_8'] < 17500)
									agg['BelowMinWage']['August'] += 1
							}
						}

						if (curr['i_8_6'] !== undefined && curr['i_8_6'] >= 0) {

							if (curr['Round'] == 1) {
								agg['Income']['MayFeb'].push(curr['i_8_6'])
							}
							if (curr['Round'] == 2) {
								agg['Income']['AugFeb'].push(curr['i_8_6'])
							}
						}
					}
				}
			}
			return agg
		}, IncomeState);
	// console.log('IA', IncomeAgg)
	return IncomeAgg
}

export function Jobs(data: RootReducerState['raw_data'], filter_val: string = 'Overall',
	filter_Round: number = 1, filter_Education: string = 'None', filter_RDD: string = 'None') {

	const labels_i_1: Record<number, string> = {
		'1': 'Daily Wage',
		'2': 'Salaried Employee',
		'3': 'Own (Family) Business',
		'4': 'School Owner',
		'5': 'Own/ Rent Agricultural Land',
		'6': 'Own/ Rent Livestock',
		'7': 'Unemployed',
		'8': 'Retired',
		'-88': 'Other'
	}
	const exclude: string[] =
		["Respondent Dropped out",
			"Refused to answer",
			"Don't know",
			"Other"]

	const JobCount: Record<string, number> = {}
	const LostJobCount: Record<string, number> = {}
	const BorrowedMoneyCount: Record<string, number> = {}
	const LosJobType: Record<string, Record<string, number>> = {}
	const initialState: InitiState = {
		'JobCount': JobCount,
		'LostJobCount': LostJobCount,
		'BorrowedMoneyCount': BorrowedMoneyCount,
		'LostJobType': LosJobType
	}
	type InitiState = {
		JobCount: Record<string, number>
		LostJobCount: Record<string, number>
		BorrowedMoneyCount: Record<string, number>
		LostJobType: Record<string, Record<string, number>>
	}

	let job_n = 0;
	const Jobs = Object.values(data).reduce((agg: InitiState, curr: any) => {

		if ((curr['i_2'] !== undefined) && !(exclude.includes(curr['i_2']))) {
			if ((filter_val !== "Overall" ? curr.lt_1 === filter_val : true)) {
				if ((curr['Round'] == filter_Round) && (filter_RDD !== "None" ? curr.prefix == filter_RDD : true)
					&& (filter_Education !== "None" ? EduBucket[filter_Education].includes(curr.i_0) : true)) {

					agg['JobCount'][curr['i_2']] = (agg['JobCount'][curr['i_2']] || 0) + 1

					if (curr['i_3'] === "No, I am currently unemployed/ laid off") {
						agg['LostJobCount'][curr['i_2']] = (agg['LostJobCount'][curr['i_2']] || 0) + 1;

						// agg['LostJobType'][curr['i_2']] = {}
						// if ((curr['i_1'] !== undefined)) {
						// 	curr['i_1'].split(' ').forEach((e: number) => {
						// 		agg['LostJobType'][curr['i_2']][labels_i_1[e]] = (agg['LostJobType'][curr['i_2']][labels_i_1[e]] || 0) + 1;
						// 	})
						// }
					}
					if (curr.spend_4 == 'Yes') {
						agg['BorrowedMoneyCount'][curr['i_2']] = (agg['BorrowedMoneyCount'][curr['i_2']] || 0) + 1
					}
					job_n += 1
				}
			}
		}
		return agg

	}, initialState)

	// Object.keys(Jobs['JobCount']).forEach((e) => Jobs['JobCount'][e] = 100 * Jobs['JobCount'][e] / job_n)
	// Object.keys(Jobs['LostJobCount']).forEach((e) => Jobs['LostJobCount'][e] = 100 * Jobs['LostJobCount'][e] / job_n)
	return Jobs
}

export function JobType(data: RootReducerState['raw_data'], filter_val: string = 'Overall',
	filter_Round: number = 1, filter_Education: string = 'None', filter_RDD: string = 'None') {

	const labels_i_1: Record<number, string> = {
		'1': 'Daily Wage',
		'2': 'Salaried Employee',
		'3': 'Own (Family) Business',
		'4': 'School Owner',
		'5': 'Own/ Rent Agricultural Land',
		'6': 'Own/ Rent Livestock',
		'7': 'Unemployed',
		'8': 'Retired',
		'-88': 'Other'
	}
	const JobCount: Record<string, number> = {}
	const LostJobCount: Record<string, number> = {}
	const initialState: InitiState = {
		JobCount: JobCount,
		LostJobCount: LostJobCount
	}
	type InitiState = {
		JobCount: Record<string, number>
		LostJobCount: Record<string, number>
	}
	let job_n = 0;
	const Jobs = Object.values(data).reduce((agg: InitiState, curr: any) => {

		if ((curr['i_1'] !== undefined) && (filter_val !== "Overall" ? curr.lt_1 === filter_val : true)) {

			if ((curr['Round'] == filter_Round) && (filter_RDD !== "None" ? curr.prefix == filter_RDD : true)
				&& (filter_Education !== "None" ? EduBucket[filter_Education].includes(curr.i_0) : true)) {

				curr['i_1'].split(' ').forEach((e: number) => {
					if (labels_i_1[e] != undefined) {
						agg['JobCount'][labels_i_1[e]] = (agg['JobCount'][labels_i_1[e]] || 0) + 1;

						if (e == 7 || e == 8) {
							if (curr['i_3'] !== "No, I am currently unemployed/ laid off") {
								agg['LostJobCount'][labels_i_1[e]] = (agg['LostJobCount'][labels_i_1[e]] || 0) + 1
							}
						} else {
							if (curr['i_3'] === "No, I am currently unemployed/ laid off") {
								agg['LostJobCount'][labels_i_1[e]] = (agg['LostJobCount'][labels_i_1[e]] || 0) + 1
							}
						}
						job_n += 1
					}
				})
			}
		}
		return agg

	}, initialState)

	return Jobs
}

export function MissedPayments(data: RootReducerState['raw_data'], filter_val: string = 'Overall',
	filter_Round: number = 1, filter_Education: string = 'None', filter_RDD: string = 'None') {

	const labels_spend_7: Record<number, string> = {
		'1': 'Tick 1',
		'2': 'Tick 2',
		'3': 'Tick 3',
		'4': 'Tick 4',
		'5': 'Tick 5',
		'6': 'Tick 6',
		'7': 'Tick 7',
		'8': 'Tick 8',
		'9': 'Tick 9',
		'10': 'Tick 10',
		'11': 'Tick 11',
		'-90': 'Tick -99'
	}
	const initialState: Record<string, number> = {}

	let n = 0;
	const Missed = Object.values(data).reduce((agg: Record<string, number>, curr: any) => {

		if ((curr.spend_7 !== undefined) && (filter_val !== "Overall" ? curr.lt_1 === filter_val : true)) {

			if ((curr['Round'] == filter_Round) && (filter_RDD !== "None" ? curr.prefix == filter_RDD : true)
				&& (filter_Education !== "None" ? EduBucket[filter_Education].includes(curr.i_0) : true)) {

				curr.spend_7.split(' ').forEach((e: number) => {
					if ((labels_spend_7[e] != undefined) && (e > 0)) {
						agg[labels_spend_7[e]] = (agg[labels_spend_7[e]] || 0) + 1;
						n += 1
					}
				})
			}
		}
		return agg

	}, initialState)

	// Object.keys(Missed).forEach((e) => Missed[e] = 100 * Missed[e] / n)

	return Missed
}