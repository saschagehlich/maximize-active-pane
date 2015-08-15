'use babel'
/* global atom */

const MaximizeActivePane = {
  config: {
    activePaneSize: {
      title: 'Active pane size (in %)',
      type: 'integer',
      default: 90
    }
  },

  /**
   * Gets called when this plugin is activated
   */
  activate () {
    atom.commands.add('atom-workspace', 'maximize-active-pane:maximize', this._maximizeActivePane.bind(this))
    atom.commands.add('atom-workspace', 'maximize-active-pane:tile', this._tileAllPanes.bind(this))
  },

  /**
   * Resets the flex scale of all panes to 1
   * @private
   */
  _tileAllPanes () {
    let activePane = atom.workspace.getActivePane()

    // Traverse parent and resize panes
    let resizePanes = (currentPane) => {
      let parent = currentPane.getParent ? currentPane.getParent() : null

      // Did we reach the PaneContainer?
      if (parent === currentPane.container || !parent) return

      let children = parent.getChildren()
      children.forEach((child) => {
        child.setFlexScale(1)
      })

      resizePanes(parent)
    }
    resizePanes(activePane)
  },

  /**
   * Gets called when the user wants to maximize the active pane
   * @private
   */
  _maximizeActivePane () {
    let activePane = atom.workspace.getActivePane()
    let activePaneFlexScale = atom.config.get('maximize-active-pane.activePaneSize')

    // Traverse parent and resize panes
    let resizePanes = (currentPane) => {
      let parent = currentPane.getParent ? currentPane.getParent() : null

      // Did we reach the PaneContainer?
      if (parent === currentPane.container || !parent) return

      let children = parent.getChildren()
      let otherChildren = children.filter((pane) => pane !== currentPane)
      if (!otherChildren.length) return

      let othersFlexScale = (100 - activePaneFlexScale) / otherChildren.length

      otherChildren.forEach((pane) => {
        pane.setFlexScale(othersFlexScale)
      })
      currentPane.setFlexScale(activePaneFlexScale)

      resizePanes(parent)
    }
    resizePanes(activePane)
  }
}

module.exports = MaximizeActivePane
