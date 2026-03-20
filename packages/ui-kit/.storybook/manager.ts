import React from 'react'
import { AddonPanel } from '@storybook/components'
import { addons, types } from '@storybook/manager-api'

import { VisualReviewPanel } from './visual-review-panel'

const ADDON_ID = 'ui-kit/visual-review'
const PANEL_ID = `${ADDON_ID}/panel`

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Visual Review',
    render: ({ active, key }) =>
      React.createElement(
        AddonPanel,
        {
          active,
          key,
        },
        React.createElement(VisualReviewPanel, { isActive: active }),
      ),
  })
})
