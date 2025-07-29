import { Box, Typography, CircularProgress, CircularProgressProps } from '@mui/material';
import * as React from "react";

interface TurnTimerProps {
  timeLeft: number; // Time in seconds
  isMyTurn: boolean;
}

function CircularProgressWithLabel(props: CircularProgressProps & { value: number, timeLeft: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${props.timeLeft}s`}
        </Typography>
      </Box>
    </Box>
  );
}


const TurnTimer: React.FC<TurnTimerProps> = ({ timeLeft, isMyTurn }) => {
  const progress = (timeLeft / 90) * 100;

  if (!isMyTurn) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6">
            남은 시간:
        </Typography>
        <CircularProgressWithLabel value={progress} timeLeft={timeLeft} />
    </Box>
  );
};

export default TurnTimer;
