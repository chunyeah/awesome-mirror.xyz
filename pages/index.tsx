import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import GlobalStyles from '@mui/material/GlobalStyles'
import { useMirrors, DataSource } from '../lib/mirror'
import { useAuth } from '../lib/auth'
import { MirrorCard } from '../components/MirrorCard'
import { MirrorFilter } from '../components/MirrorFilter'
import { Page } from '../components/Page'
import { Footer } from '../components/Footer'
import { ConnectServices } from '../components/ConnectServices'
import { LanguageSelect } from '../components/LanguageSelect'
import Script from 'next/script'
import Chip from '@mui/material/Chip'

const theme = createTheme();

export default function Home() {
  const { awesomeMirrors, filterMirrors, languages, tags, filterAwesomeMirrors, filterMirrorsWithPage, updatePage, page, updateDataSource, dataSource, updateLanguage } = useMirrors()
  const {state} = useAuth()

  async function handleClick(value: DataSource) {
    updateDataSource(value)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MD920ENXG3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-MD920ENXG3');
        `}
        </Script>
      </div>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
      <Typography variant="h5" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Awesome Mirror
          </Typography>
          <nav>
           {
            state.connected && (
            <Stack direction="row" spacing={2}> 
            {
              languages.length > 0 && (
                <LanguageSelect languages={languages} updateLanguage={updateLanguage} />
              )
            }
              <Chip label="Awesome Mirror" variant={ dataSource == DataSource.AwesomeMirror ? 'filled' : 'outlined' } color="success" onClick={() => handleClick(DataSource.AwesomeMirror)}/>
              <Chip label="My Mirror" variant={ dataSource == DataSource.MyMirror ? 'filled' : 'outlined' }  color="success" onClick={() => handleClick(DataSource.MyMirror)}/>
              <ConnectServices />
            </Stack>
            )
           }
           {
            languages.length > 0 && !state.connected && (
              <Stack direction="row" spacing={2}>
                  <LanguageSelect languages={languages} updateLanguage={updateLanguage}/>
                  <ConnectServices />
              </Stack>
            )
           }
          </nav>
      </Toolbar>
      </AppBar>
      <main>
        {
              filterMirrorsWithPage.length == 0 && dataSource ==  DataSource.MyMirror && (
                <Box
                sx={{
                  bgcolor: 'background.paper',
                  pt: 8,
                  pb: 6,
                }}
              >
                <Container maxWidth="sm">
                  <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="text.primary"
                    gutterBottom
                  >
                    Awesome Mirror
                  </Typography>
                  <Typography variant="h5" align="center" color="text.secondary" paragraph>
                    Find Awesome Mirrors on awesome-mirrors.xyz
                  </Typography>
                  <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                  >
                    <Button variant="outlined" onClick={() => handleClick(DataSource.AwesomeMirror)}>Find Awesome Mirror</Button>
                  </Stack>
                </Container>
              </Box>
              )
        }
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 4,
            pb: 0,
          }}
        >
          <MirrorFilter data={{'tags': tags, 'filterAwesomeMirrors': filterAwesomeMirrors}}/>
        </Box>
        <Container sx={{ py: 4 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={3}>
          {filterMirrorsWithPage.length > 0 && filterMirrorsWithPage.map((mirror) => (
              <Grid item key={mirror.website} xs={12} sm={6} md={4}>
                <MirrorCard mirror={mirror} awesomeMirrors={awesomeMirrors} dataSource={dataSource}/>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Page count={filterMirrors.length} updatePage={updatePage} page={page} />
      </main>
      <Footer />
    </ThemeProvider>
  );
}