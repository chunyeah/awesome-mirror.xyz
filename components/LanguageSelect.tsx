import { FC, useState } from 'react'
import * as React from 'react'
import LanguageIcon from '@mui/icons-material/Language'
import Button from '@mui/material/Button'
import { getDefaultLanguage, setDefaultLanguage } from '../lib/model'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import DialogContent from '@mui/material/DialogContent'

interface PropType {
    languages: string[]
    updateLanguage: (arg0: string) => Promise<void>
}

export const LanguageSelect: FC<React.PropsWithChildren<PropType>> = (props: PropType) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    }
    
    const handleClose = () => {
        setOpen(false)
    }

    const handleChoose = async (value: string) => {
        setDefaultLanguage(value)
        props.updateLanguage(value)
        setOpen(false)
    }

    return (
        <React.Fragment>
            <Button variant="outlined" color="inherit" startIcon={<LanguageIcon />} onClick={handleClickOpen}>
                {getDefaultLanguage()}
            </Button>
            <Dialog maxWidth="xs" open={open} onClose={handleClose}>
                <DialogTitle>Select Language</DialogTitle>
                <DialogContent>
                <Grid container spacing={5}>
                    {
                        props.languages.map((lanuage) => (
                            <Grid item key={lanuage} xs={12} sm={6} md={4}>
                                <Button size="small" variant="outlined" key={lanuage} onClick={() => handleChoose(lanuage)}>{lanuage}</Button>
                            </Grid>
                        ))
                    }
                </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}