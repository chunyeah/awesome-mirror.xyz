import { FC } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CardActionArea, CardActions } from '@mui/material'
import { Mirror, AwesomeMirrors } from '../lib/model'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import { useMirror, DataSource } from '../lib/mirror'
import { useAuth } from '../lib/auth'

interface PropType { 
  mirror: Mirror
  awesomeMirrors: AwesomeMirrors
  dataSource: DataSource
}

export const MirrorCard: FC<React.PropsWithChildren<PropType>> = (props: PropType) => {
    const mirror = props.mirror as Mirror
    const { isLiked, likeNumber, like } = useMirror(props)
    const { state, connect } = useAuth()

    async function likeMirror() {
      if (state.connected) {
        like()
      } else {
        connect()
      } 
    }

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardActions disableSpacing sx={{height: 54}}>
          {
            props.dataSource == DataSource.AwesomeMirror && ( <FormControlLabel value="end" control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} checked={ isLiked } onChange={likeMirror} />}
            label= {likeNumber} labelPlacement="end" sx={{paddingLeft: 2 }}/> )
          }
          {
            props.dataSource == DataSource.MyMirror && ( <FormControlLabel value="end" control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} checked={ isLiked } onChange={likeMirror} />}
                        label= {''} labelPlacement="end" sx={{paddingLeft: 2 }}/> )
          }
        </CardActions>
        <CardActionArea onClick={() => {
          window.open(mirror.website)
        }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom paragraph variant="h5" component="h2" sx={{paddingTop: 0 }}>
            {mirror.name}
          </Typography>
          <Stack direction="row" spacing={1}>
          {
            mirror.tags.slice(0, 4).map((tag) => (
              <Chip label={tag} key={tag} size="small" />
            ))
          }
          </Stack>
        </CardContent>
        </CardActionArea>
      </Card>
    )
}