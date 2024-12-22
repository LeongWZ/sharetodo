/* eslint-disable react/prop-types */
import { Box, Typography, Checkbox } from '@mui/material';

const CheckableItem = ({ item, onCheck }) => {
  const handleCheck = (event) => {
    onCheck({ ...item, is_checked: event.target.checked });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Checkbox checked={item.is_checked} onChange={handleCheck} />
      <Typography variant="body2" color="textSecondary">
        {item.title}
      </Typography>
    </Box>
  );
};

export default CheckableItem;