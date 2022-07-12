import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import GlobalStyles from '@mui/material/GlobalStyles'
import { useMirrors, DataSource } from '../lib/mirror'
import { MirrorCard } from '../components/MirrorCard'
import { MirrorFilter } from '../components/MirrorFilter'
import { Page } from '../components/Page'
import { Footer } from '../components/Footer'
import Script from 'next/script'
import { useAuth } from '../lib/auth'
import { ConnectServices } from '../components/ConnectServices'
import { LanguageSelect } from '../components/LanguageSelect'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

const theme = createTheme();

export default function Home() {
  const { awesomeMirrors, filterMirrors, tags, filterAwesomeMirrors, filterMirrorsWithPage, updatePage, page, updateDataSource, dataSource, languages, updateLanguage } = useMirrors()
  const { state } = useAuth()
  const pages = state.connected ? ['Awesome Today', 'Awesome Mirrors', 'My Favorites'] : ['Awesome Today', 'Awesome Mirrors']


  async function handleClickWithDataSource(value: DataSource) {
    updateDataSource(value)
  }

  async function handleClick(key: string) {
    console.log('handleClick: ', key)
    if (key == 'Awesome Mirrors') {
      updateDataSource(DataSource.AwesomeMirror)
    } else if (key == 'My Favorites') {
      updateDataSource(DataSource.MyMirror)
    } else if (key == 'Awesome Today') {
      updateDataSource(DataSource.AwesomeToday)
    }
  }

  function getPageButtonIsSelected(key: string) {
    console.log('key: ', key, 'datasource: ', dataSource)
    if (key == 'Awesome Mirrors' && dataSource == DataSource.AwesomeMirror) {
      return true
    } else if (key == 'My Favorites' && dataSource == DataSource.MyMirror) {
      return true
    } else if (key == 'Awesome Today' && dataSource == DataSource.AwesomeToday) {
      return true
    }
    return false
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
      <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.0rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Awesome Mirror
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={()=>handleClick(page)}
                sx={getPageButtonIsSelected(page) ? { my: 2, color: '#b0bec5', display: 'block' } : { my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
          { state.connected && (
            <Stack direction="row" spacing={2}>
               <ConnectServices />
             </Stack>
          )}
          {
            languages.length > 0 && !state.connected && (
              <Stack direction="row" spacing={2}>
                  <LanguageSelect languages={languages} updateLanguage={updateLanguage}/>
                  <ConnectServices />
              </Stack>
            )
          }
          </Box>
        </Toolbar>
      </Container>
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
                    <Button variant="outlined" onClick={() => handleClickWithDataSource(DataSource.AwesomeMirror)}>Find Awesome Mirror</Button>
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