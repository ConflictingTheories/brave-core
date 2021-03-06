/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// clang-format off
// #import {addSingletonGetter, sendWithPromise} from 'chrome://resources/js/cr.m.js';
// clang-format on

cr.define('settings', function() {
  /** @interface */
  /* #export */ class BraveNewTabBrowserProxy {
    /**
     * @return {!Promise<Boolean>}
     */
    getIsSuperReferralActive() {}

    /**
     * @return {!Promise<Boolean>}
     */
    getIsBinanceSupported() {}

    /**
     * @return {!Promise<Boolean>}
     */
    getIsBraveTogetherSupported() {}
  }

  /**
   * @implements {settings.BraveNewTabBrowserProxy}
   */
  /* #export */ class BraveNewTabBrowserProxyImpl {
    /** @override */
    getIsSuperReferralActive() {
      return cr.sendWithPromise('getIsSuperReferralActive');
    }

    /** @override */
    getIsBinanceSupported() {
      return cr.sendWithPromise('getIsBinanceSupported')
    }

    /** @override */
    getIsBraveTogetherSupported() {
      return cr.sendWithPromise('getIsBraveTogetherSupported')
    }
  }

  cr.addSingletonGetter(BraveNewTabBrowserProxyImpl);

  // #cr_define_end
  return {
    BraveNewTabBrowserProxy,
    BraveNewTabBrowserProxyImpl
  };
});
