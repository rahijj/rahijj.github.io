import React from 'react'
import AreaFilterComp from 'components/Filters/AreaFilter'
import EduFilterComp from 'components/Filters/EduFilter'
import RoundFilterComp from 'components/Filters/RoundFilter'
import RDDFilterComp from 'components/Filters/RDDFilter'
import IncomeFilterComp from 'components/Filters/IncomeFilter'

interface P {
	set_filter: Function
	value: any
}

export const AreaFilter: React.FC<P> = ({ set_filter, value }) => {
	return <AreaFilterComp set_filter={set_filter} value={value} />
}
export const EduFilter: React.FC<P> = ({ set_filter, value }) => {
	return <EduFilterComp set_filter={set_filter} value={value} />
}
export const RoundFilter: React.FC<P> = ({ set_filter, value }) => {
	return <RoundFilterComp set_filter={set_filter} value={value} />
}
export const RDDFilter: React.FC<P> = ({ set_filter, value }) => {
	return <RDDFilterComp set_filter={set_filter} value={value} />
}
export const IncomeFilter: React.FC<P> = ({ set_filter, value }) => {
	return <IncomeFilterComp set_filter={set_filter} value={value} />
}
// export const CombFilter: React.FC<P> = ({ set_filter, set_filterIncome, set_filterEducation, value }) => {
// 	return <CombFilterComp set_filter={set_filter} set_filterIncome={set_filterIncome} set_filterEducation={set_filterEducation} value={value} />
// }