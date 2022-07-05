import * as React from 'react'
import { FC, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { getKeyDIDCeramic } from '../lib/auth'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import testnetModels from "../schemas/published/models_local_testnet.json"
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { AwesomeMirrors } from '../lib/model'

type SubmitMirror = {
    name: string
    website: string
    language: string
    tags: string[]
}

type SubmitMirrors = {
    mirrors: SubmitMirror[]
}

type Mirror = {
    id: number
    name: string 
    language: string
    tags: string
    website: string
}

function isValidMirrorHttpUrl(string: string) {
    if (string.includes('mirror.xyz')) {
        let url
    
        try {
          url = new URL(string)
        } catch (_) {
          return false
        }
      
        return url.protocol === "http:" || url.protocol === "https:"
    } else {
        return false
    }
}

interface PropType { 
    open : boolean
    onClose : () => void
}

export const SubmitAwesomeMirror: FC<React.PropsWithChildren<PropType>> = (prop:PropType) => {
    const [name, setName] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [language, setLanguage] = useState<string>('')
    const [tag, setTag] = useState<string>('')

    const handleSubmit = async () => {
        const tags = tag.split(',')
        if (name.length > 0 && isValidMirrorHttpUrl(website) && language.length > 0 && tags.length > 0) {

            const ceramic = await getKeyDIDCeramic()
            const doc = await TileDocument.load(ceramic, testnetModels.tiles.awesomeMirrors)
            if (doc) {
                const awesome = doc.content as AwesomeMirrors
                const contain = awesome.mirrors.some(item => item.website === website)
                if (!contain) {
                    awesome.mirrors.push({
                        'name': name,
                        'website': website,
                        'language': language,
                        'tags': tags,
                        'like': [],
                        'rss': ''
                    })
                    await doc.update(awesome)
                }
            }
        }
        prop.onClose()
    }

    const handleNameTextFieldChange =  (event: { target: { value: React.SetStateAction<string> } }) => {
        setName(event.target.value)
    }

    const handleWebsiteTextFieldChange =  (event: { target: { value: React.SetStateAction<string> } }) => {
        setWebsite(event.target.value)
    }

    const handleLanguageTextFieldChange =  (event: { target: { value: React.SetStateAction<string> } }) => {
        setLanguage(event.target.value)
    }

    const handleTagTextFieldChange =  (event: { target: { value: React.SetStateAction<string> } }) => {
        setTag(event.target.value)
    }

    return (
        <Dialog
        open={prop.open}
        onClose={prop.onClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Share your favorite mirror with us!</DialogTitle>
            <DialogContent dividers={true}>
            <TextField
            autoFocus
            margin="dense"
            id="name"
            value={name}
            onChange={(e) => handleNameTextFieldChange(e)}
            label="Mirror name(like: Friends With Benefits)"
            fullWidth
            required
            variant="standard"
            />
             <TextField
            autoFocus
            margin="dense"
            id="website"
            value={website}
            onChange={(e) => handleWebsiteTextFieldChange(e)}
            label="Mirror address(like: https://mirror.xyz/dao4ever.eth)"
            fullWidth
            required
            variant="standard"
            />
             <TextField
            autoFocus
            margin="dense"
            id="language"
            value={language}
            onChange={(e) => handleLanguageTextFieldChange(e)}
            label="Mirror Language(like: EN)"
            fullWidth
            required
            variant="standard"
            />
             <TextField
            autoFocus
            margin="dense"
            id="tag"
            value={tag}
            onChange={(e) => handleTagTextFieldChange(e)}
            label="Mirror Tags(use , to separete, like: web3,dao,nft)"
            fullWidth
            required
            variant="standard"
            />
            </DialogContent>
        <DialogActions>
            <Button onClick={prop.onClose}>Quit</Button>
            <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
        </Dialog>
    )
}

function handleTextFieldChange(arg0: string): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined {
    throw new Error('Function not implemented.')
}
function e(e: any): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined {
    throw new Error('Function not implemented.')
}

export default function Admin() {
    const [open, setOpen] = useState(false);
    const [seed, setSeed] = useState<string>('')
    const [mirror, setMirror] = useState<Mirror[]>([])
    const [submitMirror, setSubmitMirror] = useState(false)

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'id', width: 100 },
        { field: 'website', headerName: 'website', width: 300 },
        { field: 'name', headerName: 'name', width: 200 },
        { field: 'language', headerName: 'language', width: 200 },
        { field: 'tags', headerName: 'tags', width: 200 }
      ]
      
    const handleSeedTextFieldChange =  (event: { target: { value: React.SetStateAction<string> } }) => {
        setSeed(event.target.value)
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleSubmit = () => {
        setSubmitMirror(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSubmitMirror(false)
    }

    const handleLogin = async () => {
        if (seed == process.env.NEXT_PUBLIC_CERAMIC_SEED as string) {
            const ceramic = await getKeyDIDCeramic()
            const doc = await TileDocument.load(ceramic, testnetModels.tiles.submitMirrors)
            if (doc) {
                const submitMirrors = doc.content as SubmitMirrors
                console.log(submitMirrors.mirrors)
                var id = 0
                const mirrors = submitMirrors.mirrors.map(function(item) {
                    return {'id': id++, 
                        'name': item.name, 
                        'language': item.language,
                        'tags': item.tags.toString(),
                        'website': item.website}
                }) as Mirror[]
                setMirror(mirrors)
            }
        }
        setOpen(false)
    }

    return (
        <div>
            {
                mirror.length > 0 && (
                    <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                      rows={mirror}
                      columns={columns}
                      pageSize={20}
                      rowsPerPageOptions={[5]}
                    />
                    <Button variant="outlined" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <SubmitAwesomeMirror open={submitMirror} onClose={handleClose} />
                  </div>
                )     
            }
            {   
                mirror.length == 0 && (
                    <div>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Login
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Admin Login</DialogTitle>
                    <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Seed"
                        value={seed}
                        onChange={(e) => handleSeedTextFieldChange(e)}
                        fullWidth
                        variant="standard"
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleLogin}>Login</Button>
                    </DialogActions>
                </Dialog>
                </div>
                ) 
            }
        </div>
    )
}