import React from 'react'

interface P {
	set_filter: Function
	value: string
}

const AreaFilter: React.FC<P> = ({ set_filter, value }) => {

	return <label className='FiltLab'>Area Type
	<select id='AreaTypeDropdown' className='Filter' onChange={e => set_filter(e.target.value)} value={value}>
			<option value="Overall">Overall</option>
			<option value='Rural'>Rural</option>
			<option value='Urban'>Urban</option>
		</select>
	</label>

}
export default AreaFilter
