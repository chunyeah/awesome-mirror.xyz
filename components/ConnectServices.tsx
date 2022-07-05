import { FC } from 'react'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAuth } from "../lib/auth"

const formatAddress = (
  address: string | null | undefined,
  ensName?: string | null,
  chars = 5
): string => {
  if (ensName) return ensName
  else if (address)
    return `${address.substring(0, chars)}...${address.substring(
      address.length - chars
    )}`
  else return ''
}

export const ConnectServices: FC<React.PropsWithChildren<unknown>> = () => {
  const { state, connect, disconnect, connecting } = useAuth()

  return (
    <>
    {!state.connected && !connecting && (
      <Button
        id="button"
        onClick={connect}
        variant="outlined"
      >
        {'Connect Wallet'}
      </Button>
    )}
    {connecting && (
        <LoadingButton loading loadingIndicator="Connecting..." variant="outlined">
         Connecting
       </LoadingButton>
    )}
    { state.connected && !connecting && (
        <Button onClick= {disconnect} >Disconnect {formatAddress(state.address)}</Button>
    )}
  </>
  )
}

