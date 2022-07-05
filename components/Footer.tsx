import { FC, useState } from 'react'
import * as React from 'react'
import Link from '@mui/material/Link'
import ButtonGroup from '@mui/material/ButtonGroup'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { TWITTER, DISCORD } from '../lib/constants'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import { SubmitMirror } from './SubmitMirror'

interface PropType { 
}

export const Footer: FC<React.PropsWithChildren<PropType>> = (prop:PropType) => {
    const [open, setOpen] = useState(false)
    const [submitMirror, setSubmitMirror] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSubmitMirror(false)
    }

    const handleClickSubmitMirror = () => {
        setSubmitMirror(true)
    }

    return (
        <React.Fragment>
            <Box
            component="footer"
            justifyContent="center"
            textAlign='center'
            sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            alignItems: 'center',
            backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
            }}>
            <Container maxWidth="sm">
            <ButtonGroup variant="text" aria-label="text button group" orientation="vertical">
                <Button onClick={handleClickOpen}>What is Awesome Mirror?</Button>
                <Button onClick={handleClickSubmitMirror}>Submit an awesome mirror</Button>
                <Button onClick={() => { window.open(DISCORD)}}>   Discord  </Button>
                <Button onClick={() => { window.open(TWITTER)}}>   Twitter  </Button>
            </ButtonGroup>
            <Copyright />
            </Container>
            </Box>
            <SubmitMirror open={submitMirror} onClose={handleClose} />
            <Dialog
                open={open}
                onClose={handleClose}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                  <DialogTitle id="scroll-dialog-title">What is Awesome Mirror?</DialogTitle>
                    <DialogContent dividers={true}>
                    <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                    <Typography variant="h6" gutterBottom component="div">
                        What is Mirror?
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                    The essential web3 toolkit for sharing and funding anything. From writing about your latest idea, to building a home for the next big DAO. Try More: <Link onClick={() => { window.open('https://mirror.xyz/')}}>https://mirror.xyz/</Link>
                    </Typography>
                    <Typography variant="h6" gutterBottom component="div">
                    What is Awesome Mirror?
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                    Awesome mirror provides high quality home set from Mirror platform. Awesome mirror used web3 technology to save your data.Thanks <Link onClick={() => { window.open('https://ceramic.network/')}}>https://ceramic.network/</Link>, <Link onClick={() => { window.open('https://infura.io/')}}>https://infura.io/</Link> and more.
                    </Typography>
                    <Typography variant="h6" gutterBottom component="div">
                    And More
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                    The awesome-mirror project is open source, try with: <Link onClick={() => { window.open('https://github.com/chunyeah/awesome-mirror.xyz')}}>https://github.com/chunyeah/awesome-mirror.xyz</Link>
                    </Typography>
                    </DialogContentText>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
        </Dialog>
      </React.Fragment>
    )
}

function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center" m={2}>
        {'Copyright © '}
        <Link color="inherit" href="https://awesome-mirror.xyz/">
          awesome-mirror.xyz
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}
