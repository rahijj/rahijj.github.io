const EduBucket: Record<string, number[]> = {
	'Dropped out Before Matric': [1, 2],
	'Matric': [3],
	'More than Matric': [4, 5, 6, 7, 8, 9]
}

interface buyingFoodType {
	data: RootReducerState['raw_data']
	filter_val: string,
	filter_Income: string,
	filter_Round: number,
	filter_Education: string,
	filter_RDD: string
}
export function buyingFood({ data, filter_val = 'Overall',
	filter_Income = 'F0', filter_Round = 1, filter_Education = 'None', filter_RDD = 'None' }: buyingFoodType) {

	const keyBuyFood: Record<string, string> = {
		'1': 'Some items were not available',
		'2': 'Some items were expensive than usual',
		'3': 'Markets/ shops were closed',
		'4': 'You did not have enough money'
	}

	const initialState: Record<string, number> = {}
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
	let n = 0;
	const buyFood = Object.values(data).reduce<Record<string, number>>((agg: Record<string, number>, curr: any) => {

		if ((filter_val !== "Overall" ? curr.lt_1 === filter_val : true)) {

			if ((filter_RDD !== "None" ? curr.prefix == filter_RDD : true) && (filter_Education !== "None" ? EduBucket[filter_Education].includes(curr.i_0) : true)) {
				if (curr['fi_2'] !== undefined && curr['fi_2'] !== ''
					&& curr['i_6'] > LowerLimit && curr['i_6'] <= UpperLimit
					&& curr['Round'] == filter_Round) {

					curr['fi_2'].split(' ').forEach((e: number) => {
						if (e > 0) {
							agg[keyBuyFood[String(e)]] = (agg[keyBuyFood[String(e)]] || 0) + 1
							// n += 1
						}
					})
					n+=1
				}
			}
		}

		return agg

	}, initialState)

	// if (n > 0) Object.keys(buyFood).forEach((e) => buyFood[e] = 100 * buyFood[e] / n);

	return {
		BuyFood: buyFood,
		n
	};
}

interface foodProblemsType {
	data: RootReducerState['raw_data']
	filter_val: string,
	filter_Income: string,
	filter_Round: number,
	filter_Education: string,
	filter_RDD: string
}
export function foodProblems({ data, filter_val = 'Overall',
	filter_Income = 'F0', filter_Round = 1, filter_Education = 'None', filter_RDD = 'None' }: foodProblemsType) {

	const keyFoodProbs: Record<string, string> = {
		'1': 'We reduced the number or size of meals for some household members',
		'2': 'We relied on less preferred and less expensive foods',
		'3': 'Some household members went to bed hungry',
		'4': 'We borrow food or asked for help for food from a friend or relative',
		'5': 'Relied on Government of NGO assistance for food',
		'6': 'Relied on donations for food',
		'7': 'None of the above'
	}
	const initialState: Record<string, number> = {}
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
	let n = 0;
	const foodProb = Object.values(data).reduce((agg: Record<string, number>, curr: any) => {

		if ((filter_val !== "Overall" ? curr.lt_1 === filter_val : true)) {

			if ((filter_RDD !== "None" ? curr.prefix == filter_RDD : true) && (filter_Education !== "None" ? EduBucket[filter_Education].includes(curr.i_0) : true)) {
				if (curr['fi_3'] !== undefined && curr['fi_3'] !== ''
					&& curr['i_6'] > LowerLimit && curr['i_6'] <= UpperLimit
					&& curr['Round'] == filter_Round) {

					curr['fi_3'].split(' ').forEach((e: number) => {
						if (e > 0) {
							agg[keyFoodProbs[String(e)]] = (agg[keyFoodProbs[String(e)]] || 0) + 1;
						}
					})
					n += 1
				}
			}
		}

		return agg

	}, initialState)

	// if (n > 0) Object.keys(foodProb).forEach((e) => foodProb[e] = 100 * foodProb[e] / n);

	return {
		FoodProb: foodProb,
		n
	};
}
