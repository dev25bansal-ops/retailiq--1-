import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Chip,
  Paper,
  Typography,
} from '@mui/material';
import { DateRange as DateRangeIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: string;
  maxDate?: string;
  label?: string;
  showPresets?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate = new Date().toISOString().split('T')[0],
  label,
  showPresets = true,
}) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(value?.startDate || '');
  const [endDate, setEndDate] = useState(value?.endDate || '');

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
    if (newStartDate && endDate) {
      onChange({ startDate: newStartDate, endDate });
    }
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    setEndDate(newEndDate);
    if (startDate && newEndDate) {
      onChange({ startDate, endDate: newEndDate });
    }
  };

  const getDateDaysAgo = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'Last 6 months', days: 180 },
    { label: 'Last year', days: 365 },
  ];

  const handlePresetClick = (days: number) => {
    const start = getDateDaysAgo(days);
    const end = maxDate;
    setStartDate(start);
    setEndDate(end);
    onChange({ startDate: start, endDate: end });
  };

  const handleAllTime = () => {
    const start = minDate || '2020-01-01';
    const end = maxDate;
    setStartDate(start);
    setEndDate(end);
    onChange({ startDate: start, endDate: end });
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      {label && (
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DateRangeIcon fontSize="small" />
          {label}
        </Typography>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <TextField
          label={t('common.startDate')}
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: minDate,
            max: endDate || maxDate,
          }}
          size="small"
          fullWidth
        />

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" color="text.secondary">
            to
          </Typography>
        </Box>

        <TextField
          label={t('common.endDate')}
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: startDate || minDate,
            max: maxDate,
          }}
          size="small"
          fullWidth
        />

        {(startDate || endDate) && (
          <Button onClick={handleClear} size="small" variant="text">
            Clear
          </Button>
        )}
      </Stack>

      {showPresets && (
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
          {presets.map((preset) => (
            <Chip
              key={preset.days}
              label={preset.label}
              onClick={() => handlePresetClick(preset.days)}
              size="small"
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
          ))}
          <Chip
            label="All time"
            onClick={handleAllTime}
            size="small"
            variant="outlined"
            sx={{ cursor: 'pointer' }}
          />
        </Stack>
      )}
    </Paper>
  );
};

export default DateRangePicker;
