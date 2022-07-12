import {setLocal, getLocal} from "web3modal"

export function getDefaultLanguage() {
  return getLocal('default_language') || 'EN'
}

export function setDefaultLanguage(language: string) {
  setLocal('default_language', language)
}

export type ArticleId = {
  streamId: string
  articleId: string
}

export type ArticlesByDate = {
    articlesByDate: ArticleId[]
}

export type MirrorOnArticel = {
  name: string
  website: string
  language: string
  tags: string[]
  authorAvatar: string
}

export type Articel = {
  mirror: MirrorOnArticel
  title: string
  link: string
  content: string
  date: string
  articelId: string
  language: string
  like: string[]
}

export type Mirror = {
    name: string
    website: string
    rss: string
    language: string
    tags: string[]
    like: string[]
}
  
export type AwesomeMirrors = {
    mirrors: Mirror[]
}
  
export type MyMirror = {
  name: string
  website: string
  language: string
  tags: string[]
}

export type MyMirrors = {
  mirrors: Mirror[]
}

export enum APIErrorCode {
  VerifyError = 1001,
  DataError
}
