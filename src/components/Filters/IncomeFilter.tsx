import React from 'react'

interface P {
	set_filter: Function
	value: string
}

const IncomeFilter: React.FC<P> = ({ set_filter, value }) => {


	return <label className='FiltLab'>February Income
	<select id='IncomeDropdown' className='Filter' onChange={e => set_filter(e.target.value)} value={value}>
		<option value='F0'>Rs 0 - Any</option>
		<option value='F1'>Rs 0 - Rs 17.5k</option>
		<option value='F2'>Rs.17.5k - Rs 50k</option>
		<option value='F3'>Rs.50k - Any</option>
	</select>
</label>

}
export default IncomeFilter
