import React from 'react'

interface P {
	set_filter: Function
	value: string
}

const RoundFilter: React.FC<P> = ({ set_filter, value }) => {

	return <label className='FiltLab'>Select Round
	<select id='RoundDropdown' className='Filter' onChange={e => set_filter(Number(e.target.value))} value={value}>
			<option value='1'>Round 1 (May)</option>
			<option value='2'>Round 2 (August)</option>
		</select>
	</label>
}
export default RoundFilter
