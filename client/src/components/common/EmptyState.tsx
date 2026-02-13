import React, { type ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
        minHeight: 400,
      }}
    >
      <Box
        sx={{
          fontSize: 80,
          color: 'text.secondary',
          mb: 3,
          opacity: 0.6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& > *': {
            fontSize: 'inherit',
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="h5"
        gutterBottom
        fontWeight="bold"
        sx={{ mb: 1 }}
      >
        {title}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 500 }}
      >
        {description}
      </Typography>

      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          size="large"
          sx={{
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
            px: 4,
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
