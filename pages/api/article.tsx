import type { NextApiRequest, NextApiResponse } from "next"
import testnetModels from "../../schemas/published/models_local_testnet.json"
import { CeramicClient } from "@ceramicnetwork/http-client"
import { DID } from "dids"
import { Ed25519Provider } from "key-did-provider-ed25519"
import { getResolver } from "key-did-resolver"
import { fromString } from "uint8arrays"
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { APIErrorCode, Articel, ArticlesByDate, ArticleId } from '../../lib/model'
import { DIDDataStore } from '@glazed/did-datastore'
import { DataModel } from '@glazed/datamodel'
import { Article } from "@mui/icons-material"
import { Identity } from "@mui/base"

const seed = process.env.NEXT_PUBLIC_CERAMIC_SEED as string

const did = new DID({
    provider: new Ed25519Provider(fromString(seed, 'base16')),
    resolver: getResolver()
})
const ceramic = new CeramicClient('https://ceramic-clay.3boxlabs.com')
ceramic.did = did

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const reqBody = req.body

    if (reqBody && reqBody['seed'] == seed) {
        await did.authenticate()
        const articles = reqBody['articles'] as Articel[]
        const doc = await TileDocument.load(ceramic, testnetModels.tiles.articlesByDate)
        if (doc.content) {
            const articlesByDate = doc.content as ArticlesByDate
            const _a = articlesByDate.articlesByDate
            if (articles.length > 0 ) {
                for (let article of articles) {
                    const contain = _a.some(item => {
                        return item.articleId == article.articelId
                    })
                    if (!contain) {
                        const doc = await TileDocument.create(ceramic, article, { schema: testnetModels.schemas.Article, controllers: [did.id], family: 'all', tags: ['article'] })
                        _a.push({'streamId': doc.id.toString(), 'articleId': article.articelId})
                    }
                }
            }
            console.log(articlesByDate)
            await doc.update(articlesByDate)
            return res.status(200).json('')
        } else{
            return res.status(200).json({'errorCode': APIErrorCode.DataError})
        }
    } else {
        return res.status(200).json({'errorCode': APIErrorCode.VerifyError})
    }
}