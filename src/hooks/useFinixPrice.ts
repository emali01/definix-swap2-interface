import BigNumber from 'bignumber.js'
import { useState, useEffect } from 'react'
import { useActiveWeb3React } from './index'
import multicall from '../utils/multicall'
import {
  multicallAdress,
  FINIX_SIX_LP,
  FINIX_KUSDT_LP,
  FINIX_KLAY_LP,
  SIX_KUSDT_LP,
  KLAY_KUSDT_LP,
  FINIX_ADDRESS,
  SIX_ADDRESS,
  WKLAY_ADDRESS,
  KDAI_ADDRESS,
  KUSDT_ADDRESS,
  HERODOTUS_ADDRESS,
  PANCAKE_MASTER_CHEF_ADDRESS
} from '../constants'
import erc20 from '../constants/abis/erc20.json'

const getTotalBalanceLp = async (input) => {
  const { lpAddress, pair1, pair2, masterChefAddress, multicallAddress } = input
  let pair1Amount = 0
  let pair2Amount = 0
  try {
    const calls = [
      {
        address: pair1,
        name: 'balanceOf',
        params: [lpAddress]
      },
      {
        address: pair2,
        name: 'balanceOf',
        params: [lpAddress]
      },
      {
        address: pair1,
        name: 'decimals'
      },
      {
        address: pair2,
        name: 'decimals'
      }
    ]

    const [pair1BalanceLP, pair2BalanceLP, pair1Decimals, pair2Decimals] = await multicall(
      multicallAddress,
      erc20,
      calls
    )

    pair1Amount = new BigNumber(pair1BalanceLP).div(new BigNumber(10).pow(pair1Decimals)).toNumber()
    pair2Amount = new BigNumber(pair2BalanceLP).div(new BigNumber(10).pow(pair2Decimals)).toNumber()
  } catch (error) {
    console.log(error)
  }
  return [pair1Amount, pair2Amount]
}

export default function useFinixPrice(): number {
  const [currentPrice, setCurrentPrice] = useState(0)
  const { account, chainId = process.env.REACT_APP_CHAIN_ID || '' } = useActiveWeb3React()
  const multicallContractAddress = multicallAdress[chainId || process.env.REACT_APP_CHAIN_ID || '56']
  useEffect(() => {
    // console.log(account)
    const fetchPromise = [
      getTotalBalanceLp({
        lpAddress: FINIX_SIX_LP[chainId],
        pair1: FINIX_ADDRESS[chainId],
        pair2: SIX_ADDRESS[chainId],
        masterChefAddress: HERODOTUS_ADDRESS[chainId],
        multicallAddress: multicallContractAddress
      }),
      getTotalBalanceLp({
        lpAddress: FINIX_KUSDT_LP[chainId],
        pair1: FINIX_ADDRESS[chainId],
        pair2: KUSDT_ADDRESS[chainId],
        masterChefAddress: HERODOTUS_ADDRESS[chainId],
        multicallAddress: multicallContractAddress
      }),
      getTotalBalanceLp({
        lpAddress: FINIX_KLAY_LP[chainId],
        pair1: FINIX_ADDRESS[chainId],
        pair2: WKLAY_ADDRESS[chainId],
        masterChefAddress: HERODOTUS_ADDRESS[chainId],
        multicallAddress: multicallContractAddress
      }),
      getTotalBalanceLp({
        lpAddress: SIX_KUSDT_LP[chainId],
        pair1: SIX_ADDRESS[chainId],
        pair2: KUSDT_ADDRESS[chainId],
        masterChefAddress: HERODOTUS_ADDRESS[chainId],
        multicallAddress: multicallContractAddress
      }),
      getTotalBalanceLp({
        lpAddress: KLAY_KUSDT_LP[chainId],
        pair1: WKLAY_ADDRESS[chainId],
        pair2: KUSDT_ADDRESS[chainId],
        masterChefAddress: HERODOTUS_ADDRESS[chainId],
        multicallAddress: multicallContractAddress
      })
    ]
    Promise.all(fetchPromise).then(response => {
      const [
        [totalFinixDefinixFinixSixPair, totalSixDefinixFinixSixPair],
        [totalFinixDefinixFinixKusdtPair, totalBusdDefinixFinixKusdtPair],
        [totalFinixDefinixFinixKlayPair, totalKlayDefinixFinixKlayPair],
        [totalSixDefinixSixKusdtPair, totalKlayDefinixSixKusdtPair],
        [totalKlayInDefinixKlayKusdtPair, totalKusdtInDefinixKlayKusdtPair]
      ] = response
      // const totalFinixDefinixFinixSixPair = 10000000.0
      // const totalSixDefinixFinixSixPair = 12820512.82
      const finixSixRatio = totalSixDefinixFinixSixPair / totalFinixDefinixFinixSixPair || 0
      // FINIX-BUSD
      // const totalFinixDefinixFinixBusdPair = 10000000.0
      // const totalBusdDefinixFinixBusdPair = 500000.0
      const finixBusdRatio = totalBusdDefinixFinixKusdtPair / totalFinixDefinixFinixKusdtPair || 0
      // FINIX-BNB
      // const totalFinixDefinixFinixBnbPair = 10000000.0
      // const totalBnbDefinixFinixBnbPair = 1824.82
      const finixBnbRatio = totalKlayDefinixFinixKlayPair / totalFinixDefinixFinixKlayPair || 0
      // SIX-BUSD
      // const totalSixDefinixSixBusdPair = 12820512.82
      // const totalBnbDefinixSixBusdPair = 500000.0
      const sixBusdRatio = totalKlayDefinixSixKusdtPair / totalSixDefinixSixKusdtPair || 0
      // PANCAKE BNB-BUSD
      // const totalBnbInDefinixBnbBusdPair = 557985
      // const totalBusdInDefinixBnbBusdPair = 152220163
      const definixBnbBusdRatio = totalKusdtInDefinixKlayKusdtPair / totalKlayInDefinixKlayKusdtPair || 0
      // Price cal
      const finixSixPrice = finixSixRatio * sixBusdRatio
      const finixBnbPrice = finixBnbRatio * definixBnbBusdRatio
      const averageFinixPrice =
        (finixBusdRatio * totalFinixDefinixFinixKusdtPair +
          finixBnbPrice * totalFinixDefinixFinixKlayPair +
          finixSixPrice * totalFinixDefinixFinixSixPair) /
        (totalFinixDefinixFinixKusdtPair + totalFinixDefinixFinixKlayPair + totalFinixDefinixFinixSixPair)

      // console.log('FINIX-SIX LP Address : ', getFinixSixLPAddress())
      // console.log('FINIX Address : ', getFinixAddress())
      // console.log('Total FINIX in FINIX-SIX pair : ', totalFinixDefinixFinixSixPair)
      // console.log('SIX Address : ', getSixAddress())
      // console.log('Total SIX in FINIX-SIX pair : ', totalSixDefinixFinixSixPair)
      // console.log('FINIX-BUSD LP Address : ', getFinixBusdLPAddress())
      // console.log('FINIX Address : ', getFinixAddress())
      // console.log('Total FINIX in FINIX-BUSD pair : ', totalFinixDefinixFinixBusdPair)
      // console.log('BUSD Address : ', getBusdAddress())
      // console.log('Total BUSD in FINIX-BUSD pair : ', totalBusdDefinixFinixBusdPair)
      // console.log('FINIX-WBNB LP Address : ', getFinixBnbLPAddress())
      // console.log('FINIX Address : ', getFinixAddress())
      // console.log('Total FINIX in FINIX-WBNB pair : ', totalFinixDefinixFinixBnbPair)
      // console.log('WBNB Address : ', getWbnbAddress())
      // console.log('Total WBNB in FINIX-WBNB pair : ', totalBnbDefinixFinixBnbPair)
      // console.log('SIX-BUSD LP Address : ', getSixBusdLPAddress())
      // console.log('SIX Address : ', getSixAddress())
      // console.log('Total SIX in SIX-BUSD pair : ', totalSixDefinixSixBusdPair)
      // console.log('BUSD Address : ', getBusdAddress())
      // console.log('Total BUSD in SIX-BUSD pair : ', totalBnbDefinixSixBusdPair)
      // console.log('Definix BNB-BUSD LP Address : ', getDefinixBnbBusdLPAddress())
      // console.log('WBNB Address : ', getWbnbAddress())
      // console.log('Total WBNB in Definix BNB-BUSD pair : ', totalBnbInDefinixBnbBusdPair)
      // console.log('BUSD Address : ', getBusdAddress())
      // console.log('Total BUSD in Definix BNB-BUSD pair : ', totalBusdInDefinixBnbBusdPair)
      setCurrentPrice(averageFinixPrice)
    })
  }, [chainId, multicallContractAddress, account])
  return currentPrice || 0
}
