import React from 'react'

interface P {
	set_filter: Function
	value: string
}

const EduFilter: React.FC<P> = ({ set_filter, value }) => {

	return <label className='FiltLab'>Education
	<select id='EduDropdown' className='Filter' onChange={e => set_filter(e.target.value)} value={value}>
			<option value='None'>None</option>
			<option value='Dropped out Before Matric'>Dropped out before Matric</option>
			<option value='Matric'>Matric</option>
			<option value='More than Matric'>More than Matric</option>
		</select>
	</label>

}
export default EduFilter
