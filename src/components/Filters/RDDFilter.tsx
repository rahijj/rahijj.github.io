import React from 'react'

interface P {
	set_filter: Function
	value: string
}

const RDDFilter: React.FC<P> = ({ set_filter, value }) => {


	return <label className='FiltLab'>Filter RDD
	<select id='RDD_Dropdown' className='Filter' onChange={e => set_filter(e.target.value)} value={value}>
			<option value='None'>None</option>
			<option value="RDD">RDD</option>
		</select>
	</label>

}
export default RDDFilter
