const debug_url = "localhost:8080"

// const debug_url = "eva-api.metal.fish"
// const debug_url = "835e0a7e572c.ngrok.io"

export function get_host(): string {

	// @ts-ignore
	return window.api_url || debug_url;
}
