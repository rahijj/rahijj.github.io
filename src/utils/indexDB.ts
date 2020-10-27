import * as idb from 'idb'
import { deleteDB } from 'idb'

export const clearRawData = () => {
	try {
		idb
			.openDB("db", 1, {
				upgrade(db) {
					db.createObjectStore("raw_data")
				}
			})
			.then((db) => {
				db.delete('raw_data', 'rd')
			})

		localStorage.removeItem("auth")
		localStorage.removeItem("sync_state")
		localStorage.removeItem("last_snapshot")
		localStorage.removeItem("school_db")
	}
	catch (error) {
		console.error(error)
	}
}

export const loadAuth = (): RootReducerState['auth'] => {

	let init_auth: RootReducerState['auth'] = {
		id: undefined,
		token: undefined,
		client_type: "tech_demo"
	};

	try {
		const str = localStorage.getItem("auth")
		if (str === null) {
			return init_auth;
		}

		return JSON.parse(str);
	}
	catch (err) {
		console.error(err);
		return init_auth;
	}
}

export const saveAuth = (auth: RootReducerState['auth']) => {
	localStorage.setItem("auth", JSON.stringify(auth))
}

export const saveRawData = async (rd: RawSurveyData) => {
	console.log('SAVE RAW DATA')

	const db = await idb.openDB("db", 1, {
		upgrade(db) {
			db.createObjectStore("raw_data")
		}
	})
	db.put("raw_data", rd, "rd")
	// .then((db) => {

	// 	if (db.objectStoreNames.length == 0) {
	// 		console.log('deleteDB')
	// 		idb.deleteDB('db').then(() => {
	// 			saveRawData(rd)
	// 		})
	// 	}
	// 	else {
	// 		db.put("raw_data", rd, "rd")
	// 	}
	// })
}

export const loadRawData = async () => {

	try {
		const db = await idb.openDB('db', 1, {
			upgrade(db) {
				db.createObjectStore("raw_data")
			}
		})
		const raw_data = await db.get("raw_data", "rd")
		// console.log('LOAD RAW DATA', raw_data, db)
		return raw_data as RawSurveyData || {}
	}
	catch (error) {
		console.error(error)
		return {}
	}
}
