import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';
import { ResetCSS } from 'uikit-dev'
import { Config } from 'definixswap-sdk'
import { KlipModalProvider } from "@sixnetwork/klaytn-use-wallet"
import GlobalStyle from './style/Global'
import App from './pages/App'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import Providers from './Providers'
import sdkConfig from './sdkConfig'
import 'inter-ui'
import './i18n'

Config.configure(sdkConfig)
ReactGA.initialize('G-L997LXLF8F');

const tagManagerArgs = {
  gtmId: 'GTM-WVFPW42',
};
TagManager.initialize(tagManagerArgs);
// ReactGA.initialize(process.env.REACT_APP_GANALYTIC || "");
// 
// const tagManagerArgs = {
//   gtmId: process.env.REACT_APP_GTAG || "",
// };
// TagManager.initialize(tagManagerArgs);

if ('klaytn' in window) {
  (window.klaytn as any).autoRefreshOnNetworkChange = false
}

window.addEventListener('error', () => {
  localStorage?.removeItem('redux_localstorage_simple_lists')
})

ReactDOM.render(
  <StrictMode>
    <KlipModalProvider>
    <Providers>
      <>
        <ListsUpdater />
        <ApplicationUpdater />
        <TransactionUpdater />
        <MulticallUpdater />
      </>
      <App />
    </Providers>
    </KlipModalProvider>
  </StrictMode>,
  document.getElementById('root')
)
