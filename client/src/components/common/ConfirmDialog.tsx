import React, { useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { Close, Warning, Info, Error as ErrorIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'info' | 'warning' | 'danger';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  severity = 'info',
}) => {
  const { t } = useTranslation();

  const defaultConfirmLabel = confirmLabel || t('common.confirm', 'Confirm');
  const defaultCancelLabel = cancelLabel || t('common.cancel', 'Cancel');

  const getSeverityConfig = () => {
    switch (severity) {
      case 'warning':
        return {
          icon: <Warning />,
          color: 'warning.main',
          buttonColor: 'warning' as const,
        };
      case 'danger':
        return {
          icon: <ErrorIcon />,
          color: 'error.main',
          buttonColor: 'error' as const,
        };
      case 'info':
      default:
        return {
          icon: <Info />,
          color: 'info.main',
          buttonColor: 'primary' as const,
        };
    }
  };

  const config = getSeverityConfig();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return;

      if (event.key === 'Enter') {
        event.preventDefault();
        onConfirm();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onConfirm, onCancel]);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: `${config.color}15`,
            color: config.color,
          }}
        >
          {config.icon}
        </Box>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <IconButton
          edge="end"
          onClick={onCancel}
          aria-label="close"
          size="small"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          {defaultCancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={config.buttonColor}
          sx={{ minWidth: 100 }}
          autoFocus
        >
          {defaultConfirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
