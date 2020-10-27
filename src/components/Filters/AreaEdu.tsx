import React from 'react'

interface P {
	set_filterAreaEdu: Function
	value: string
}

const AreaEduFilter: React.FC<P> = ({ set_filterAreaEdu, value }) => {

	return <label className='FiltLab'>Filters
	<select id='CombFilterDropdown' className='Filter' onChange={e => set_filterAreaEdu(e.target.value)} value={value} >
			<option value="None">None</option>
			<option value='Rural'>Rural</option>
			<option value='Urban'>Urban</option>
			<option value='Dropped out Before Matric'>Dropped out before Matric</option>
			<option value='Matric'>Matric</option>
			<option value='More than Matric'>More than Matric</option>
		</select>
	</label>

}
export default AreaEduFilter
