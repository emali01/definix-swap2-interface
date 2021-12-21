import { Trade } from 'definixswap-sdk'
import React, { Fragment, memo } from 'react'
import { Text, Flex, ArrowDoubleArrowIcon, ColorStyles, Coin } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'

export default memo(function SwapRoute({ trade, isMobile, isPriceImpactCaution }: { 
  trade: Trade; 
  isMobile: boolean; 
  isPriceImpactCaution?:boolean; 
}) {
  const { t } = useTranslation();
  return (
    <Flex 
      alignItems="center"
      justifyContent={isMobile ? "flex-start" :"flex-end"}
      flexWrap="wrap"
    >
      {!isPriceImpactCaution && trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            <Flex alignItems="center" mr="10px" mb="6px">
              <Coin size={isMobile ? "20px" : "22px"} symbol={token?.symbol} />
              <Text textStyle="R_14M" color={ColorStyles.DEEPGREY} ml="9px">
                {token.symbol}
              </Text>
              {!isLastItem && <Flex ml="14px"><ArrowDoubleArrowIcon/></Flex>}
            </Flex>
          </Fragment>
        )
      })}
      {isPriceImpactCaution && <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>{t('There are no routes.')}</Text>}
    </Flex>
  )
})