// Mui Imports
import TablePagination from '@mui/material/TablePagination'
import type { TablePaginationProps } from '@mui/material/TablePagination'
import { styled } from '@mui/material/styles'

const TablePaginationStyled = styled(TablePagination)<TablePaginationProps>(() => ({
  '&.MuiTablePagination-root': {
    '& .MuiTablePagination-spacer': {
      display: 'none'
    }
  }
}))

export default TablePaginationStyled
