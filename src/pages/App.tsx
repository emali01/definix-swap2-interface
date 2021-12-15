import React, { lazy, Suspense, useEffect } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { GlobalStyle, Loading } from 'definixswap-uikit-v2'
import useCaverJsReactForWallet from 'hooks/useCaverJsReactForWallet'
import Menu from '../components/Menu'
import Web3ReactManager from '../components/Web3ReactManager'
import { AppWrapper } from '../components/Layout'
import ToastListener from '../components/ToastListener'
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './Liquidity/redirects'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import { RedirectToSwap, RedirectPathToSwapOnly } from './Swap/redirects'

const Swap = lazy(() => import('./Swap'))
const Error = lazy(() => import('./Error'))
const Liquidity = lazy(() => import('./Liquidity'))

export default function App() {
  const { account } = useCaverJsReact()
  const { login } = useCaverJsReactForWallet()

  // wallet
  const checkConnector = (connector: string) => window.localStorage.getItem('connector') === connector
  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus') && checkConnector("injected")) {
      login('injected');
    }else if (!account && window.localStorage.getItem('accountStatus') && window.localStorage.getItem('userAccount') && checkConnector("klip")){
      login('klip');
    }

  }, [account, login])

  return (
    <Suspense fallback={null}>
      <GlobalStyle />
      <BrowserRouter>
        <AppWrapper>
          <Menu>
            <Suspense fallback={<Loading />}>
              <Web3ReactManager>
                <Switch>
                  <Route exact path="/" component={RedirectPathToSwapOnly} />
                  <Route exact strict path="/swap" component={Swap} />
                  <Route exact path="/swap/:currencyIdA/:currencyIdB" component={RedirectToSwap} />
                  <Route exact path="/swap/:currencyIdA" component={RedirectToSwap} />
                  <Route exact strict path="/liquidity" component={Liquidity} />
                  <Route exact strict path="/liquidity/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                  <Route exact path="/liquidity/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                  <Route exact path="/liquidity/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                  <Route exact strict path="/liquidity/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                  <Route>
                    <Error />
                  </Route>
                </Switch>
              </Web3ReactManager>
            </Suspense>
          </Menu>
          <ToastListener />
        </AppWrapper>
      </BrowserRouter>
    </Suspense>
  )
}
