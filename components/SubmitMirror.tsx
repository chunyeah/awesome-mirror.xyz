import { FC, useState } from 'react'
import * as React from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useSubmitMirror } from '../lib/mirror'

interface PropType { 
    open : boolean
    onClose : () => void
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

export const SubmitMirror: FC<React.PropsWithChildren<PropType>> = (prop:PropType) => {
    const { submit }  = useSubmitMirror()
    const [name, setName] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [language, setLanguage] = useState<string>('')
    const [tag, setTag] = useState<string>('')

    const handleSubmit = async () => {
        prop.onClose()
        const tags = tag.split(',')
        if (name.length > 0 && isValidMirrorHttpUrl(website) && language.length > 0 && tags.length > 0) {
            await submit({'name': name, 'website': website, 'language': language, 'tags': tags})
        }
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
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                To share a mirror with us, please file below info. We are going to check these everyday.
            </DialogContentText>
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

