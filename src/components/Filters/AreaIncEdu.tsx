import React from 'react'

interface P {
	set_filterAreaIncEdu: Function
	value: string
}

const AreaIncEduFilter: React.FC<P> = ({ set_filterAreaIncEdu, value }) => {

	return <label className='FiltLab'>Filters
	<select id='CombFilterDropdown' className='Filter' onChange={e => set_filterAreaIncEdu(e.target.value)} value={value} >
			<option value="None">None</option>
			<option value='Rural'>Rural</option>
			<option value='Urban'>Urban</option>
			<option value='F1'>Rs 0 - Rs 17.5k</option>
			<option value='F2'>Rs.17.5k - Rs 50k</option>
			<option value='Dropped out Before Matric'>Dropped out before Matric</option>
			<option value='Matric'>Matric</option>
			<option value='More than Matric'>More than Matric</option>
		</select>
	</label>

}
export default AreaIncEduFilter
