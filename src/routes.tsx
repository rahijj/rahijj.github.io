import * as React from 'react'
import { Provider } from 'react-redux'
// import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { Store } from 'redux'
import { connect } from 'react-redux'

import ErrorComponent from 'components/Error'

import MainPage from './pages/d3-main'
import MainTemp from './pages/port-main'
import About from './pages/About'
import Resume from './pages/Resume'
// import MainPage from'./pages/main'
import { submitError } from 'actions/core'

interface P {
	store: Store
	sendError: (err: Error, errInfo: React.ErrorInfo) => void
}

interface S {
	error?: {
		err: Error
		errInfo: React.ErrorInfo
	}
}

class Routes extends React.Component<P, S> {

	constructor(props: P) {
		super(props)

		this.state = {
			error: undefined
		}
	}

	componentDidCatch(err: Error, errInfo: React.ErrorInfo) {

		this.props.sendError(err, errInfo)

		this.setState({
			error: {
				err,
				errInfo
			}
		})

	}

	render() {
		const store = this.props.store

		if (this.state.error) {
			return <ErrorComponent error={this.state.error.err} errInfo={this.state.error.errInfo} />
		}

		return <Provider store={store}>
			{/* <BrowserRouter> */}
			<Router>

				<Switch>
					<Route exact path="/" component={About} />
					{/* <Route exact path="/rahijG" component={About} /> */}
					<Route exact path="/resume" component={Resume} />
					<Route exact path="/scroll-dash" component={MainPage} />
					{/* <Route exact path="/rahijj" component={MainTemp} /> */}

				</Switch>
			</Router>
			{/* </BrowserRouter> */}

		</Provider>

	}
}

export default connect(
	(state: RootReducerState) => ({}),
	(dispatch: Function) => ({
		sendError: (err: Error, errInfo: React.ErrorInfo) => dispatch(submitError(err, errInfo))
	})
)(Routes)
