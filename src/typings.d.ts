interface SyncState {

}

interface RootReducerState {
	sync_state: SyncState
	auth: {
		id?: string
		token?: string
		client_type: "tech_demo"
	}
	client_id: string
	queued: {
		[path: string]: {
			action: {
				path: string[]
				value?: any
				type: "MERGE" | "DELETE"
			}
			date: number
		}
	}
	loading: boolean
	raw_data: RawSurveyData
	last_snapshot: number
	accept_snapshot: boolean
	connected: boolean
}

interface RawSurveyData {
	[guid: string]: Survey
}

interface Survey {
	"ad_1": string
	"ad_con_no": string
	"ad_contact": string
	"address": string
	"answered_response": string
	"call_date": string
	"call_datetime": string
	"call_num": string
	"call_time": string
	"callback_time": string
	"caseid": string
	"checkpoint_0": string
	"checkpoint_1": string
	"checkpoint_2": string
	"checkpoint_3": string
	"city/village": string
	"consent": string
	"district": string
	"duration": string
	"endtime": number
	"enum_comment": string
	"fi_1": string
	"fi_2": string
	"fi_2_desc": string
	"fi_3": string
	"fi_3_1": number
	"fi_3_2": number
	"fi_3_3": number
	"fi_3_4": number
	"fi_3_5": number
	"fi_3_6": number
	"fi_3_7": number
	"fi_4": number
	"i_0": string
	"i_1": string
	"i_1_desc": string
	"i_2": string
	"i_2_desc": string
	"i_3": string
	"i_4": string
	"i_5": string
	"i_5_desc": string
	"i_6": number
	"i_7_1": number
	"i_7_2": number
	"i_7_3": number
	"i_7_4": number
	"i_8": number
	"i_8_1": number
	"i_8_2": number
	"i_9": number
	"i_9_1": number
	"id": string
	"instance_time": string
	"key": string
	"last_call_status": string
	"lt_1": string
	"lt_2": string
	"lt_2_no": string
	"lt_2_no_1": number
	"lt_2_no_2": number
	"lt_2_no_3": number
	"lt_2_no_4": number
	"lt_2_no_5": number
	"lt_2_no_6": number
	"lt_2_no_7": number
	"lt_2_no__88": number
	"lt_2_no_desc": string
	"lt_2_yes": string
	"lt_2_yes2": string
	"lt_2_yes2_desc": string
	"lt_3": number
	"lt_3a": number
	"lt_4": string
	"lt_4_yes": number
	"lt_5": string
	"lt_6": string
	"lt_7": string
	"lt_8": string
	"lt_8_1": string
	"lt_8_1_desc": string
	"lt_8_2": string
	"lt_8_2_desc": string
	"lt_8_desc": string
	"lt_9": string
	"lt_10": string
	"lt_11": string
	"lt_11_1": string
	"lt_12": string
	"lt_12_1": number
	"lt_12_2": number
	"lt_12_3": number
	"lt_12_4": number
	"lt_12_5": number
	"lt_12_6": number
	"lt_12_7": number
	"lt_12_8": number
	"lt_12_9": number
	"lt_12_10": number
	"nch_1": string
	"nch_1_1": number
	"nch_1_2": number
	"nch_1_3": number
	"nch_1_4": number
	"nch_1_5": number
	"nch_1_6": number
	"nch_1_7": number
	"nch_1_8": number
	"nch_1__88": number
	"nch_2": string
	"nch_3_desc": string
	"nch_4": string
	"nch_7": string
	"nch_8_desc": string
	"nch_9": string
	"nch_10": string
	"nch_11": string
	"nch_birth": string
	"nch_death": string
	"nch_death_repeat_count": string
	"nch_deathyes1_1": string
	"nch_deathyes2_desc_1": string
	"new_sortby": string
	"no_sick_count": string
	"now_complete": string
	"num_calls": string
	"phone_response": string
	"phone_response_short": string
	"prefix": string
	"primary_occupation": string
	"pub_to_users": string
	"spend_1": number
	"spend_2": number
	"spend_3": number
	"spend_4": string
	"spend_6": string
	"spend_6_desc": string
	"spend_7": string
	"spend_7_1": number
	"spend_7_2": number
	"spend_7_3": number
	"spend_7_4": number
	"spend_7_5": number
	"spend_7_6": number
	"spend_7_7": number
	"spend_7_8": number
	"spend_7_9": number
	"spend_7_10": number
	"spend_7_11": number
	"spend_7__90": number
	"spend_8": string
	"spend_9": string
	"submissiondate": number
	"tehsil": string
	"urban_rural": string
}