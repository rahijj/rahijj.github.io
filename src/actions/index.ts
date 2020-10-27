import Syncr from '@cerp/syncr'
import { createLoginSucceed } from './core';
import { get_host } from 'config';
import { loadRawData } from 'utils/indexDB'

type Dispatch = (action: any) => any
type GetState = () => RootReducerState

export const LOADING_RAW_DATA = "LOADING_RAW_DATA"
export const GOT_RAW_DATA = "GOT_RAW_DATA"

export type RawDataAction = {
	type: "GOT_RAW_DATA",
	data: RawSurveyData
}

export type LoadingAction = {
	type: "LOADING",
	loading: boolean
}

export const getRawData = () => (dispatch: Dispatch, getState: GetState) => {

	dispatch({
		type: "LOADING",
		loading: true
	})

	let data = require('data/evPort.json')
	// console.log('DATAdedee',(data['eva_raw']))
	let res: RawSurveyData[] = data['eva_raw']
	const retVal: RawSurveyData = Object.entries(res).reduce((agg: any, curr: any) => {
		// console.log('survey',(curr))
		agg[curr[1]['id']] = JSON.parse(curr[1]['survey'])
		return agg
	}, {})

	dispatch({
		type: GOT_RAW_DATA,
		data: retVal
	})
}

// export const getRawData = () => (dispatch: Dispatch, getState: GetState) => {
// 	dispatch({
// 		type: "LOADING",
// 		loading: true
// 	})
// 	const creds = localStorage.getItem("username_password") || ""
// 	const host = get_host()
// 	fetch(`https://${host}/raw`, {
// 		headers: new Headers({
// 			"Authorization": `Basic ${btoa(creds)}`
// 		})
// 	})
// 		.then(res => res.json())
// 		.then((chunks: RawSurveyData[]) => chunks.reduce<RawSurveyData>((agg, curr) => ({ ...agg, ...curr }), {}))
// 		.then(data => dispatch({
// 			type: "GOT_RAW_DATA",
// 			data
// 		}))
// 		.catch(err => {
// 			console.error(err)
// 			localStorage.removeItem("username_password")
// 			alert("error: " + err)
// 			setTimeout(() => {
// 				window.location.reload()
// 			}, 2000);
// 			dispatch({
// 				type: "LOADING",
// 				loading: false,
// 				error: err
// 			})
// 		})
// }
export const loadRawDataFromIDB = () => (dispatch: Dispatch, getState: GetState) => {
	loadRawData()
		.then((data) => {
			if (Object.values(data).length > 0) {
				dispatch({
					type: "GOT_RAW_DATA_FROM_IDB",
					data
				})
			}
		})
		.catch(error => {
			console.error('LoadRawDataIDb', error);
		})
}
export const createLogin = (username: string, password: string, number: string) => (dispatch: Dispatch, getState: GetState, syncr: Syncr) => {

	const state = getState();

	syncr.send({
		type: "LOGIN",
		client_type: state.auth.client_type,
		client_id: state.client_id,
		id: state.auth.id,
		payload: {
			id: username,
			password
		}
	})
		.then((res: { token: string, sync_state: SyncState }) => {
			dispatch(createLoginSucceed(username, res.token, res.sync_state))
		})
		.catch(res => {
			console.error(res)
			alert("login failed" + JSON.stringify(res))
		})

}