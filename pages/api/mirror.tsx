import type { NextApiRequest, NextApiResponse } from "next"
import testnetModels from "../../schemas/published/models_local_testnet.json"
import { CeramicClient } from "@ceramicnetwork/http-client"
import { DID } from "dids"
import { Ed25519Provider } from "key-did-provider-ed25519"
import { getResolver } from "key-did-resolver"
import { fromString } from "uint8arrays"
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { AwesomeMirrors, APIErrorCode } from '../../lib/model'

const seed = process.env.NEXT_PUBLIC_CERAMIC_SEED as string

const did = new DID({
    provider: new Ed25519Provider(fromString(seed, 'base16')),
    resolver: getResolver()
})
const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com')
ceramic.did = did

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const reqBody = req.body
    console.log('reqBody: ', reqBody)

    if (reqBody && reqBody['seed'] == seed) {
        await did.authenticate()
        const doc = await TileDocument.load(ceramic, testnetModels.tiles.awesomeMirrors)
        if (doc.content) {
            const mirrors = doc.content as AwesomeMirrors
            const language = reqBody['language']
            if (language) {
                const selectMirrors = mirrors.mirrors.filter(value => {
                    if (value.language.includes(language)) {
                        return true
                    } else {
                        return false
                    }
                })
                return res.status(200).json(selectMirrors)
            } else {
                return res.status(200).json(mirrors.mirrors)
            }
        } else {
            return res.status(200).json({'errorCode': APIErrorCode.DataError})
        }
    } else {
        return res.status(200).json({'errorCode': APIErrorCode.VerifyError})
    }
}
