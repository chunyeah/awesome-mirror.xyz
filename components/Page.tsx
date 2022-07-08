import { FC } from 'react'
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'
import { MAX_PAGE_COUNT } from '../lib/constants'

interface PropType { 
    count: number
    updatePage: (page: number) => Promise<void>
    page: number
}

export const Page: FC<React.PropsWithChildren<PropType>> = (prop:PropType) => {
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        prop.updatePage(value)
        window.scrollTo({
            top: 0,
            behavior: "auto"
        })
    }

    if (prop.count > MAX_PAGE_COUNT) {
        const index = Math.ceil(prop.count / MAX_PAGE_COUNT)
        return (
            <Box my={2} display="flex" justifyContent="center">
                <Pagination count={index} page={prop.page} color="primary" variant="outlined" onChange={handleChange}/>
            </Box>
        )
    } else { 
        return (<></>)
    }
}