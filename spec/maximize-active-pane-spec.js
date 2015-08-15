'use babel'
/* eslint-env jasmine */
/* global atom, waitsForPromise, runs */

describe('MaximizeActivePane', () => {
  let workspaceElement
  let leftPane, topRightPane, bottomRightPane
  let activationPromise

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace)

    leftPane = atom.workspace.getActivePane()
    topRightPane = leftPane.splitRight()
    bottomRightPane = topRightPane.splitDown()

    activationPromise = atom.packages.activatePackage('maximize-active-pane')
  })

  describe('when the maximize-active-pane:maximize event is triggered', () => {
    it('should maximize the active pane', () => {
      waitsForPromise(() => {
        return activationPromise
      })

      runs(() => {
        topRightPane.activate()
        atom.commands.dispatch(workspaceElement, 'maximize-active-pane:maximize')

        expect(topRightPane.getFlexScale()).toEqual(90)
        expect(bottomRightPane.getFlexScale()).toEqual(10)
        expect(leftPane.getFlexScale()).toEqual(10)
      })
    })
  })

  describe('when the maximize-active-pane:tile event is triggered', () => {
    it('should reset all panes', () => {
      waitsForPromise(() => {
        return activationPromise
      })

      runs(() => {
        leftPane.setFlexScale(10)
        atom.commands.dispatch(workspaceElement, 'maximize-active-pane:tile')

        expect(topRightPane.getFlexScale()).toEqual(1)
        expect(bottomRightPane.getFlexScale()).toEqual(1)
        expect(leftPane.getFlexScale()).toEqual(1)
      })
    })
  })
})
