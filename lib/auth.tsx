import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import Web3 from "web3"
import WalletConnectProvider from '@walletconnect/ethereum-provider'
import Web3Modal from "web3modal"
import { ThreeIdConnect } from '@3id/connect'
import { EthereumAuthProvider, WebClient, ConnectNetwork } from "@self.id/web"
import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from "dids"
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
import { DIDDataStore } from '@glazed/did-datastore'
import { DataModel } from '@glazed/datamodel'
import testnetModels from "../schemas/published/models_local_testnet.json"
import { AwesomeMirrors } from './model'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays'

type ProviderProps = {
    children?: ReactNode
}

export async function getKeyDIDCeramic() {
    const seed = process.env.NEXT_PUBLIC_CERAMIC_SEED as string
    const key = fromString(seed, 'base16')
    const did = new DID({
        provider: new Ed25519Provider(key),
        resolver: getResolver()
    })
    await did.authenticate()
    const config =  NETWORK_CONFIGS["testnet-clay"]
    const ceramic = new CeramicClient(config.ceramicURL)
    ceramic.did = did
    return ceramic
}

export function createSelfIDClient() {
    const config = NETWORK_CONFIGS["testnet-clay"]
    const client = new WebClient({
        ceramic:config.ceramicURL,
        connectNetwork: config.connectNetwork as ConnectNetwork,
        aliases: testnetModels
    })
    return client
}

interface IChainData {
    name: string
    short_name: string
    chain: string
    network: string
    chain_id: number
    network_id: number
    rpc_url: string
}

interface IAppState {
    address: string
    web3: any
    provider: any
    connected: boolean
    chainId: number
    networkId: number
    did: DID | null
    myMirrors: AwesomeMirrors
    publicCeramicClient: CeramicClient | null
}

const INITIAL_STATE: IAppState = {
    address: "",
    web3: null,
    provider: null,
    connected: false,
    chainId: 1,
    networkId: 1,
    did: null,
    myMirrors: {"mirrors": []},
    publicCeramicClient: null
}

const NETWORK_CONFIGS = {
    "dev-unstable": {
      ceramicURL: "https://ceramic-private-dev.3boxlabs.com",
      connectNetwork: "dev-unstable",
    },
    "local-clay": {
      ceramicURL: "http://0.0.0.0:7007",
      connectNetwork: "testnet-clay",
    },
    "testnet-clay": {
      ceramicURL: "https://ceramic-clay.3boxlabs.com",
      connectNetwork: "testnet-clay",
    },
    "mainnet": {
      ceramicURL: "https://ceramic-private.3boxlabs.com",
      connectNetwork: "mainnet",
    },
}

export type AuthContextType = {
    state: IAppState
    updateMyMirrors: (arg0: AwesomeMirrors) => Promise<void>
    connect: () => Promise<void>
    disconnect: () => Promise<void>
    connecting: boolean
}

const initialContext = {
    state: {...INITIAL_STATE},
    updateMyMirrors: async () => undefined,
    connect: async () => undefined,
    disconnect: async () => undefined,
    connecting: false
}

const AuthContext = createContext<AuthContextType>(initialContext)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({children} : ProviderProps) => {

    const [state, setState] = useState<IAppState>({...INITIAL_STATE})
    const [dataStore, setDataStore] = useState<DIDDataStore | null>(null)
    const [connecting, setConnecting] = useState(false)

    const updateMyMirrors = async (mirrors: AwesomeMirrors) => {
        if (dataStore) {
            const newState = state
            state.myMirrors = mirrors
            await setState(newState)
            dataStore.set(testnetModels.definitions.myMirrors, mirrors)
        }
    }

    const disconnect = async () => {
        setConnecting(true)
        const { web3 } = state
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
          await web3.currentProvider.close()
        }
        if (web3Modal) {
            await web3Modal.clearCachedProvider()
        }
        setState({ ...INITIAL_STATE })
        setDataStore(null)
        setConnecting(false)
        window.location.reload()
    }

    const subscribeProvider = async (provider: any) => {
        if (!provider.on) {
          return
        }
        provider.on("close", () => disconnect())
        provider.on("accountsChanged", async (accounts: string[]) => {
            const newState = state
            state.address = accounts[0]
            await setState(newState)
        })
        provider.on("chainChanged", async (chainId: number) => {
            const { web3 } = state
            const networkId = await web3.eth.net.getId()
            const newState = state
            newState.chainId = chainId
            newState.networkId = networkId
            await setState(newState)
        })
        provider.on("networkChanged", async (networkId: number) => {
          const { web3 } = state;
          const chainId = await web3.eth.chainId()
          const newState = state
          newState.chainId = chainId
          newState.networkId = networkId
          await setState(newState)
        })
    }

    const [web3Modal, setWeb3Moal] = useState<Web3Modal | null>(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const connect = async () => {
        if (!web3Modal) {
            return
        }
        setConnecting(true)
        const threeID = new ThreeIdConnect()

        var provider: any 
        try {
            provider = await web3Modal.connect()
            await subscribeProvider(provider)
            await provider.enable()
        } catch(error) {
            console.error(error)
            setConnecting(false)
            return
        }
       
        const web3: any = initWeb3(provider)
        const accounts = await web3.eth.getAccounts()
        const address = accounts[0]
        const networkId = await web3.eth.net.getId()
        const chainId = await web3.eth.chainId()

        const newState = state
        newState.web3 = web3
        newState.provider = provider
        newState.address = address
        newState.chainId = chainId
        newState.networkId = networkId

        const authProvider = new EthereumAuthProvider(provider, address)
        await threeID.connect(authProvider)

        const config =  NETWORK_CONFIGS["testnet-clay"]
        const _ceramic = new CeramicClient(config.ceramicURL)
        const _did = new DID({
            provider: threeID.getDidProvider(),
            resolver: {
                ...get3IDResolver(_ceramic),
                ...getKeyResolver(),
            }
        })
        await _did.authenticate()
        _ceramic.did = _did
        newState.did = _did

        const _model = new DataModel({ ceramic: _ceramic, aliases: testnetModels })
        const dataStore = new DIDDataStore({ ceramic: _ceramic, model: _model })

        const data = await dataStore.get(testnetModels.definitions.myMirrors)
        if (data) {
            const mirror = data as AwesomeMirrors
            newState.myMirrors = mirror
        } else {
            newState.myMirrors = {"mirrors": []}
        }

        const ceramic = await getKeyDIDCeramic()
        setDataStore(dataStore)
        newState.publicCeramicClient = ceramic
        newState.connected = true
        await setState(newState)
        setConnecting(false)
    }

    useEffect(() => {
        if (!web3Modal) {
            setWeb3Moal(new Web3Modal({
                network: getChainData(state.chainId).network,
                cacheProvider: true,
                providerOptions: getProviderOptions()
            }))
        } else {
            if (web3Modal.cachedProvider && !state.connected) {
                connect()
            }
        }
    }, [connect, state.chainId, state.connected, web3Modal])

    function initWeb3(provider: any) {
        const web3: any = new Web3(provider)
      
        web3.eth.extend({
          methods: [
            {
              name: "chainId",
              call: "eth_chainId",
              outputFormatter: web3.utils.hexToNumber
            }
          ]
        })
      
        return web3
    }

    function getProviderOptions() {
        const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId
            }
          }
        }
        return providerOptions
    }

    function getChainData(chainId: number): IChainData {

        const chainData = supportedChains.filter(
          (chain: any) => chain.chain_id === chainId
        )[0];
      
        if (!chainData) {
          throw new Error("ChainId missing or not supported")
        }
      
        const API_KEY = process.env.NEXT_PUBLIC_INFURA_ID

        if (
          chainData.rpc_url.includes("infura.io") &&
          chainData.rpc_url.includes("%API_KEY%") &&
          API_KEY
        ) {
          const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY)
          return {
            ...chainData,
            rpc_url: rpcUrl
          };
        }      
        return chainData;
    }

    return (
        <AuthContext.Provider value={{state, updateMyMirrors, connect, disconnect, connecting}}>
            {children}
        </AuthContext.Provider>
    )
}

// chains

const supportedChains: IChainData[] = [
    {
      name: "Ethereum Mainnet",
      short_name: "eth",
      chain: "ETH",
      network: "mainnet",
      chain_id: 1,
      network_id: 1,
      rpc_url: "https://mainnet.infura.io/v3/%API_KEY%"
    },
    {
      name: "Ethereum Ropsten",
      short_name: "rop",
      chain: "ETH",
      network: "ropsten",
      chain_id: 3,
      network_id: 3,
      rpc_url: "https://ropsten.infura.io/v3/%API_KEY%"
    },
    {
      name: "Ethereum Rinkeby",
      short_name: "rin",
      chain: "ETH",
      network: "rinkeby",
      chain_id: 4,
      network_id: 4,
      rpc_url: "https://rinkeby.infura.io/v3/%API_KEY%"
    },
    {
      name: "Ethereum Görli",
      short_name: "gor",
      chain: "ETH",
      network: "goerli",
      chain_id: 5,
      network_id: 5,
      rpc_url: "https://goerli.infura.io/v3/%API_KEY%"
    },
    {
      name: "Ethereum Kovan",
      short_name: "kov",
      chain: "ETH",
      network: "kovan",
      chain_id: 42,
      network_id: 42,
      rpc_url: "https://kovan.infura.io/v3/%API_KEY%"
    },
    {
      name: "Ethereum Classic Mainnet",
      short_name: "etc",
      chain: "ETC",
      network: "mainnet",
      chain_id: 61,
      network_id: 1,
      rpc_url: "https://ethereumclassic.network"
    }
  ];
  
  export default supportedChains;  