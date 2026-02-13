import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  History,
  TrendingUp,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface SearchFilter {
  id: string;
  label: string;
  value: string;
  type: 'category' | 'platform' | 'priceRange';
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter?: (filters: SearchFilter[]) => void;
  placeholder?: string;
  filters?: SearchFilter[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilter,
  placeholder,
  filters = [],
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const defaultPlaceholder = placeholder || t('search.placeholder', 'Search for products...');

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5); // Keep only last 5 searches

    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Debounced search handler
  const handleSearchDebounced = useCallback(
    (searchQuery: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (searchQuery.trim()) {
          onSearch(searchQuery);
          saveRecentSearch(searchQuery);
        }
      }, 300);
    },
    [onSearch]
  );

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    handleSearchDebounced(value);
  };

  // Handle search submit (on Enter key)
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      onSearch(query);
      saveRecentSearch(query);
      setShowRecentSearches(false);
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    onSearch('');
    searchInputRef.current?.focus();
  };

  // Handle filter menu
  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  // Add filter
  const handleAddFilter = (filter: SearchFilter) => {
    const updated = [...activeFilters, filter];
    setActiveFilters(updated);
    if (onFilter) {
      onFilter(updated);
    }
    handleFilterMenuClose();
  };

  // Remove filter
  const handleRemoveFilter = (filterId: string) => {
    const updated = activeFilters.filter((f) => f.id !== filterId);
    setActiveFilters(updated);
    if (onFilter) {
      onFilter(updated);
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    setShowRecentSearches(false);
  };

  // Clear recent searches
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ position: 'relative' }}
      >
        <TextField
          fullWidth
          inputRef={searchInputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowRecentSearches(true)}
          onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
          placeholder={defaultPlaceholder}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {query && (
                  <IconButton size="small" onClick={handleClear}>
                    <Clear />
                  </IconButton>
                )}
                {filters.length > 0 && (
                  <IconButton size="small" onClick={handleFilterMenuOpen}>
                    <FilterList />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        {/* Recent Searches Dropdown */}
        {showRecentSearches && recentSearches.length > 0 && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              zIndex: 10,
              maxHeight: 300,
              overflow: 'auto',
              borderRadius: 2,
            }}
            elevation={3}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <History fontSize="small" color="action" />
                <Typography variant="body2" fontWeight="bold">
                  {t('search.recentSearches', 'Recent Searches')}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                color="primary"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={handleClearRecentSearches}
              >
                {t('search.clear', 'Clear')}
              </Typography>
            </Box>
            <Divider />
            {recentSearches.map((search, index) => (
              <MenuItem
                key={index}
                onClick={() => handleRecentSearchClick(search)}
                sx={{ py: 1.5 }}
              >
                <TrendingUp fontSize="small" sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body2">{search}</Typography>
              </MenuItem>
            ))}
          </Paper>
        )}
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          {activeFilters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              onDelete={() => handleRemoveFilter(filter.id)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
        PaperProps={{
          sx: { minWidth: 200 },
        }}
      >
        {filters.map((filter) => (
          <MenuItem
            key={filter.id}
            onClick={() => handleAddFilter(filter)}
            disabled={activeFilters.some((f) => f.id === filter.id)}
          >
            {filter.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default SearchBar;
