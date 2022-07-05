import { useState, useEffect} from 'react'
import { Mirror, AwesomeMirrors, getDefaultLanguage } from './model'
import { useAuth, createSelfIDClient } from './auth'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import testnetModels from "../schemas/published/models_local_testnet.json"
import { MAX_PAGE_COUNT } from './constants'

export enum DataSource {
    AwesomeMirror = 0,
    MyMirror
}

export function useMirrors() {
    const [awesomeMirrors, setAwesomeMirrors] = useState<AwesomeMirrors>({"mirrors": []})
    const [filterMirrors, setFilterMirrors] = useState<Mirror[]>([])
    const [filterMirrorsWithPage, setFilterMirrorsWithPage] = useState<Mirror[]>([])
    const [languages, setLanguages] = useState<string[]>([])
    const [allTags, setAllTags] = useState<{[key: string]: string[]}>({'': []})
    const [tags, setTags] = useState<string[]>([])
    const [page, setPage] = useState<number>(1)
    const [dataSource, setDataSource] = useState<DataSource>(DataSource.AwesomeMirror)
    const [selected, setSelected] = useState<string | null>(null)
    const { state } = useAuth()

    function updateTagAndLanguage(awesomeMirrors: AwesomeMirrors) {
        const defaultLanguage = getDefaultLanguage() as string
        const _languages = languages
        const _allTags = allTags
        awesomeMirrors.mirrors.sort((a, b) => b.like.length - a.like.length)
        awesomeMirrors.mirrors.forEach((item) => {
            if (!_languages.includes(item.language)) {
                _languages.push(item.language)
            }
            if (!_allTags[item.language]) {
                _allTags[item.language] = item.tags
            } else {
                item.tags.forEach((tag) => {
                    if (!_allTags[item.language].includes(tag)) {
                        _allTags[item.language].push(tag)
                    }
                })
            }
        })
        setLanguages(_languages)
        setAllTags(_allTags)
        setTags(_allTags[defaultLanguage])
    }

    const updateDataSource = async (source: DataSource) => {
        if (dataSource != source) {
            setDataSource(source)
            if (source == DataSource.AwesomeMirror) {
                updateTagAndLanguage(awesomeMirrors)
                filterAwesomeMirrors(selected)
            } else {
                if (state.did) {
                    setLanguages([])
                    setTags([])
                    setFilterMirrors(state.myMirrors.mirrors)
                    setFilterMirrorsWithPage(state.myMirrors.mirrors)
                }
            }
        }
    }

    const updatePage = async (currentPage: number) => {
        const _mirrors = filterMirrors.slice(MAX_PAGE_COUNT * (currentPage - 1), MAX_PAGE_COUNT * currentPage)
        setFilterMirrorsWithPage(_mirrors)
        setPage(currentPage)
    }

    const updateLanguage = async (selectedLanguage: string) => {
        setTags(allTags[selectedLanguage])
        _filter(selectedLanguage, awesomeMirrors)
    }

    const filterAwesomeMirrors = async (selectedTag: string | null) => {
      _filter(selectedTag, awesomeMirrors)
    }

    function _filter(selectedTag: string | null, awesome: AwesomeMirrors) {
        if (selectedTag) {
            const _filterMirrors = awesome.mirrors
            const _mirrors = _filterMirrors.filter(mirror => {
                return mirror.language == selectedTag || mirror.tags.includes(selectedTag)
            })
            setFilterMirrors(_mirrors)
            setFilterMirrorsWithPage(_mirrors.length > MAX_PAGE_COUNT ? _mirrors.slice(0, MAX_PAGE_COUNT) : _mirrors)
        } else {
            setFilterMirrorsWithPage(awesome.mirrors.length > MAX_PAGE_COUNT ? awesome.mirrors.slice(0, MAX_PAGE_COUNT) : awesome.mirrors)
            setFilterMirrors(awesome.mirrors)
        }
        setSelected(selectedTag)
        setPage(1)
    }

    useEffect(() => {
        async function getMirrors() {
            const _client = createSelfIDClient()
            const doc = await TileDocument.load(_client.ceramic, testnetModels.tiles.awesomeMirrors)
            if (doc) {
                const _awesomeMirrors = doc.content as AwesomeMirrors
                updateTagAndLanguage(_awesomeMirrors)
                setAwesomeMirrors(_awesomeMirrors)
                const defaultLanguage = getDefaultLanguage() as string
                _filter(defaultLanguage, _awesomeMirrors)
            }
        }
        if (awesomeMirrors.mirrors.length == 0) {
            getMirrors()
        }
    })

    return { awesomeMirrors, filterMirrors, languages, tags, filterAwesomeMirrors, filterMirrorsWithPage, updatePage, page, updateDataSource, dataSource, updateLanguage }
}

interface PropType { 
    mirror: Mirror
    awesomeMirrors: AwesomeMirrors
}

export function useMirror(props: PropType) {
    const { state, updateMyMirrors } = useAuth()

    const mirror = props.mirror as Mirror
    const awesomeMirrors = props.awesomeMirrors as AwesomeMirrors
    const [isLiked, setIsLiked] = useState<boolean>(state.did ? state.myMirrors.mirrors.map(item => item.website).includes(mirror.website) : false)
    const likeNumber = mirror.like.length > 0 ? mirror.like.length : ''

    useEffect(() => {
        if (state.did) {
            setIsLiked(state.did ? state.myMirrors.mirrors.map(item => item.website).includes(mirror.website) : false)
        } else {
            if (isLiked) {
                setIsLiked(false)
            }
        }
    }, [state.did, mirror.like, isLiked, state.myMirrors.mirrors, mirror.website])

    async function like() {
        if (state.did && mirror && state.publicCeramicClient) {
            const _myMirror = state.myMirrors
            if (_myMirror.mirrors.map(item => item.website).includes(mirror.website)) {
                _myMirror.mirrors = _myMirror.mirrors.filter(item => item.website != mirror.website)
                updateMyMirrors(_myMirror)
                setIsLiked(false)
            } else {
                _myMirror.mirrors.push(mirror)
                updateMyMirrors(_myMirror)
                setIsLiked(true)
                if (!mirror.like.includes(state.did.id)) {
                    mirror.like.push(state.did.id)
                    const doc = await TileDocument.load(state.publicCeramicClient, testnetModels.tiles.awesomeMirrors)
                    await doc.update(awesomeMirrors)
                }
            }
        }
    }

    return { isLiked, likeNumber, like }
}

type SubmitMirror = {
    name: string
    website: string
    language: string
    tags: string[]
}

type SubmitMirrors = {
    mirrors: SubmitMirror[]
}

export function useSubmitMirror() {
    const { state, connect } = useAuth()

    const submit = async (mirror: SubmitMirror) => {
        console.log(mirror)
        if (state.connected && state.publicCeramicClient) {
            const doc = await TileDocument.load(state.publicCeramicClient, testnetModels.tiles.submitMirrors)
            if (doc) {
                const submitMirrors = doc.content as SubmitMirrors
                submitMirrors.mirrors.push(mirror)
                await doc.update(submitMirrors)
                console.log(doc.content)
            }
        } else {
            connect()
        }
    }

    return { submit }
}