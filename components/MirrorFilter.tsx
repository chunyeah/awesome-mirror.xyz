import { FC, useState } from 'react'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

interface MirrorFilterType {
    tags: string[]
    filterAwesomeMirrors: (selectedTag: string | null) => Promise<void>
}

interface PropType { 
    data: MirrorFilterType;
}

export const MirrorFilter: FC<React.PropsWithChildren<PropType>> = ({ data }:PropType) => {
    const tags = data.tags as string[]
    const filterAwesomeMirrors = data.filterAwesomeMirrors as (selectedTag: string | null) => Promise<void>
    const [selected, setSelected] = useState<string | null>(null)

    async function handleClick(value: string) {
        if (selected == value) {
            setSelected(null)
            filterAwesomeMirrors(null)
        } else {
            setSelected(value)
            filterAwesomeMirrors(value)   
        } 
    }

    return (
        <Grid container spacing={1} justifyContent="center" sx={{ pt: 0, pl: 8, pr: 8}}>
            {tags.map((tag) => (
                <Grid item xs={0} key={tag}>
                    <Chip label={tag} key={tag} variant={selected == tag ? 'filled' : 'outlined'} onClick={() => handleClick(tag)}/>
                </Grid>
            ))}
        </Grid>
    )
}