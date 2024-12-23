/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, Pagination, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ProjectLogsModal = ({ open, onClose, logs }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  const onCloseAndResetPage = () => {
    setPage(0);
    onClose();
  }

  return (
    <Modal open={open} onClose={onCloseAndResetPage}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Project Logs</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <PaginatedList logs={logs} page={page} setPage={setPage} itemsPerPage={itemsPerPage} />
      </Box>
    </Modal>
  );
};

const PaginatedList = ({ logs, page, setPage, itemsPerPage }) => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLogs = logs.slice(startIndex, endIndex);
    const pageCount = Math.ceil(logs.length / itemsPerPage);
  
    const handleChange = (event, value) => {
      setPage(value - 1);
    };
  
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={pageCount}
            page={page + 1}
            onChange={handleChange}
            color="primary"
          />
        </Box>
        <List>
          {paginatedLogs.map((log) => (
            <ListItem key={log.id}>
              <ListItemText
                primary={`${log.action}d by ${log.user}`}
                secondary={`${new Date(log.timestamp).toLocaleString()} - ${log.description}`}
              />
            </ListItem>
          ))}
        </List>
        {paginatedLogs.length > Math.floor(itemsPerPage / 2) &&
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
                count={pageCount}
                page={page + 1}
                onChange={handleChange}
                color="primary"
            />
            </Box>
        }
      </Box>
    );
  };

export default ProjectLogsModal;