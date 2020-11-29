
/**
 * The update listener callback definition
 */
export type UpdateListener = (updatable: Updatable) => void;

/**
 * Not really a mixin unfortunately... but this is the best I can do for now
 */
export abstract class Updatable {

	/**
	 * The list of update listeners
	 */
	private __updateListeners: Set<UpdateListener> = new Set();

	/**
	 * Indicate if an update is already scheduled
	 */
	private __isScheduled: boolean = false;

	// Overridable ---------------------------------------------------------------------------------

	/**
	 * Handle object updates
	 */
	protected abstract onUpdate(): void;

	// Internal Handling----------------------------------------------------------------------------

	/**
	 * Update the object
	 */
	public update() {
		this.onUpdate();
		this.__isScheduled = false;
	}

	/**
	 * Schedule an update for the listeners
	 */
	public scheduleUpdate() {
		if (!this.isUpdateScheduled) {
			this.__isScheduled = true;
			for (let listener of this.__updateListeners) {
				listener(this);
			}
		}
	}

	/**
	 * Listen for update events from this object
	 */
	public addListener(listener: UpdateListener) {
		this.__updateListeners.add(listener);
	}

	/**
	 * Remove a listener from this object
	 */
	// public removeListener(listener: UpdateListener) {
	// 	this.__updateListeners.delete(listener);
	// }

	/**
	 * Remove all listeners from this object
	 */
	// public removeAllListeners() {
	// 	this.__updateListeners.clear();
	// }

	/**
	 * Determine if an update is scheduled
	 */
	public get isUpdateScheduled() {
		return this.__isScheduled;
	}
}
