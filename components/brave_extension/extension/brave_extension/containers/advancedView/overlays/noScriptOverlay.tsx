/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// React API
import * as React from 'react'

// Types
import { NoScriptInfo } from '../../../types/other/noScriptInfo'
import { ShieldsPanelActionTypes } from '../../../types/actions/shieldsPanelActions'

// Components
import NoScriptResourcesList from '../../shared/resourcesBlockedList/noScriptResourcesList'

// Helpers
import {
  filterNoScriptInfoByWillBlockState,
  checkEveryItemIsBlockedOrAllowedByUser,
  generateNoScriptInfoDataStructure,
  getBlockAllText
} from '../../../helpers/noScriptUtils'

// Feature-specific components
import {
  BlockedListHeader,
  BlockedListSummary,
  BlockedListContent,
  BlockedListItemHeader,
  BlockedListDynamic,
  BlockedListFooter,
  ArrowUpIcon,
  LinkAction,
  Favicon,
  SiteInfoText,
  BlockedListSummaryText,
  BlockedListItemHeaderStats,
  BlockedListItemHeaderText,
  ShieldsButton
} from '../../../components'

// Helpers
import { getLocale } from '../../../background/api/localeAPI'

interface Props {
  favicon: string
  hostname: string
  noScriptInfo: NoScriptInfo
  onClose: (event?: React.MouseEvent) => void
  actions: ShieldsPanelActionTypes
}

export default class NoScript extends React.PureComponent<Props, {}> {
  get noScriptInfo () {
    return this.props.noScriptInfo
  }

  get generatedNoScriptData () {
    return generateNoScriptInfoDataStructure(this.noScriptInfo)
  }

  componentDidMount () {
    window.addEventListener('blur', () => {
      this.props.actions.setFinalScriptsBlockedState()
      window.close()
    })
  }

  getBlockedScriptsLength (maybeBlock: boolean) {
    return filterNoScriptInfoByWillBlockState(Object.entries(this.noScriptInfo), maybeBlock).length
  }

  maybeDisabledBlockOrAllowAll (maybeBlock: boolean) {
    return checkEveryItemIsBlockedOrAllowedByUser(Object.entries(this.noScriptInfo), maybeBlock)
  }

  blockOrAllowAll (blockOrAllow: boolean) {
    this.props.actions.setAllScriptsBlockedCurrentState(blockOrAllow)
    this.props.actions.allowScriptOriginsOnce()
  }

  setFinalScriptsBlockedState = (event?: React.MouseEvent) => {
    // indicate local state that those scripts are going to be blocked
    if (chrome.browserAction) {
      this.props.actions.setFinalScriptsBlockedState()
    }
    // close the scripts modal layer
    if (event) {
      this.props.onClose()
    }
  }

  getBlockAllText (shouldBlock: boolean) {
    return getBlockAllText(this.noScriptInfo, shouldBlock)
  }

  render () {
    const { favicon, hostname, actions } = this.props
    return (
      <BlockedListContent>
        <BlockedListHeader>
          <Favicon src={favicon} />
          <SiteInfoText>{hostname}</SiteInfoText>
        </BlockedListHeader>
        <details open={true}>
          <BlockedListSummary stats={false} onClick={this.setFinalScriptsBlockedState}>
            <ArrowUpIcon />
            <BlockedListSummaryText>{getLocale('scriptsOnThisSite')}</BlockedListSummaryText>
          </BlockedListSummary>
          <BlockedListDynamic fixedHeight={true}>
          {
            this.getBlockedScriptsLength(true) > 0 && (
              <>
                <BlockedListItemHeader id='blocked'>
                  <BlockedListItemHeaderStats>
                    {this.getBlockedScriptsLength(true)}
                  </BlockedListItemHeaderStats>
                  <BlockedListItemHeaderText>
                      {getLocale('blockedScripts')}
                  </BlockedListItemHeaderText>
                  <LinkAction
                    disabled={this.maybeDisabledBlockOrAllowAll(true)}
                    onClick={this.blockOrAllowAll.bind(this, false)}
                  >
                    {this.getBlockAllText(true)}
                  </LinkAction>
                </BlockedListItemHeader>
                <NoScriptResourcesList
                  maybeBlock={true}
                  noScriptInfo={this.generatedNoScriptData}
                  actions={actions}
                />
              </>
            )
          }
          {
            this.getBlockedScriptsLength(false) > 0 && (
              <>
                <BlockedListItemHeader id='allowed'>
                  <BlockedListItemHeaderStats>
                    {this.getBlockedScriptsLength(false)}
                  </BlockedListItemHeaderStats>
                  <BlockedListItemHeaderText>
                      {getLocale('allowedScripts')}
                  </BlockedListItemHeaderText>
                  <LinkAction
                    disabled={this.maybeDisabledBlockOrAllowAll(false)}
                    onClick={this.blockOrAllowAll.bind(this, true)}
                  >
                    {this.getBlockAllText(false)}
                  </LinkAction>
                </BlockedListItemHeader>
                <NoScriptResourcesList
                  maybeBlock={false}
                  noScriptInfo={this.generatedNoScriptData}
                  actions={actions}
                />
              </>
            )
          }
          </BlockedListDynamic>
        </details>
        <BlockedListFooter>
          <ShieldsButton
            level='primary'
            type='accent'
            onClick={this.setFinalScriptsBlockedState}
            text={getLocale('goBack')}
          />
        </BlockedListFooter>
      </BlockedListContent>
    )
  }
}
