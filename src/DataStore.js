const { writable, get } = require('svelte/store')

const initialState = {
	data: null,
	loading: false,
	error: null,
}

class DataStore {
	constructor(query, mapState) {
		this.query = query || null
		this.store = null

		if (typeof mapState !== 'undefined') {
			this.mapState = mapState
		}

		this.initialize()
	}

	initialize = () => {
		const initialDataState = this.applyMapStateTransform(
			initialState,
			undefined,
			'initialize'
		)

		this.store = writable(initialDataState)
	}

	applyMapStateTransform = (currentState, inputData, action) => {
		currentState = { ...currentState }

		if (!this.mapState) {
			currentState.data = inputData
			return currentState
		}

		return this.mapState(currentState, inputData, action)
	}

	transform = (...props) => {
		let newState = this.applyMapStateTransform(this.state, ...props)
		if (this.store) {
			this.store.set(newState)
		}
	}
	get state() {
		return get(this.store)
	}

	sync = async vars => {
		this.store.update($state => {
			$state.loading = true
			return $state
		})

		try {
			const data = await this.query(vars)
			this.store.update($state => {
				$state.error = null
				$state = this.applyMapStateTransform($state, data, 'sync')
				return $state
			})
		} catch (e) {
			this.store.update($state => {
				$state.error = e
				$state = this.applyMapStateTransform($state, null, 'error')
				return $state
			})
		}

		this.store.update($state => {
			$state.loading = false
			return $state
		})
	}

	subscribe = (...props) => {
		return this.store.subscribe(...props)
	}
}

module.exports = DataStore
