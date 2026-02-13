import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { InventoryItem } from '../../types/index';

// Mock inventory data
const generateMockInventory = (): InventoryItem[] => {
  const categories = ['Electronics', 'Clothing', 'Food & Beverages', 'Home & Kitchen', 'Beauty & Personal Care', 'Stationery', 'Toys'];
  const products = [
    { name: 'Samsung Galaxy Buds', category: 'Electronics', cost: 4500, selling: 5999, qty: 85 },
    { name: 'Wireless Mouse Logitech', category: 'Electronics', cost: 450, selling: 699, qty: 120 },
    { name: 'Cotton T-Shirt Blue', category: 'Clothing', cost: 180, selling: 399, qty: 45 },
    { name: 'Denim Jeans Black', category: 'Clothing', cost: 650, selling: 1299, qty: 8 },
    { name: 'Basmati Rice 5kg', category: 'Food & Beverages', cost: 340, selling: 499, qty: 200 },
    { name: 'Organic Honey 500g', category: 'Food & Beverages', cost: 280, selling: 450, qty: 55 },
    { name: 'Stainless Steel Kadhai', category: 'Home & Kitchen', cost: 450, selling: 799, qty: 32 },
    { name: 'Non-Stick Tawa 12inch', category: 'Home & Kitchen', cost: 280, selling: 499, qty: 0 },
    { name: 'Face Cream SPF 50', category: 'Beauty & Personal Care', cost: 320, selling: 599, qty: 15 },
    { name: 'Shampoo Anti-Dandruff', category: 'Beauty & Personal Care', cost: 180, selling: 349, qty: 95 },
    { name: 'Notebook A4 Ruled', category: 'Stationery', cost: 45, selling: 89, qty: 250 },
    { name: 'Gel Pen Blue Pack of 10', category: 'Stationery', cost: 80, selling: 149, qty: 5 },
    { name: 'LEGO Building Blocks', category: 'Toys', cost: 1200, selling: 1999, qty: 18 },
    { name: 'Remote Control Car', category: 'Toys', cost: 850, selling: 1499, qty: 12 },
    { name: 'Smart LED Bulb', category: 'Electronics', cost: 280, selling: 499, qty: 75 },
    { name: 'USB-C Cable 2m', category: 'Electronics', cost: 120, selling: 249, qty: 3 },
    { name: 'Printed Kurti', category: 'Clothing', cost: 380, selling: 799, qty: 28 },
    { name: 'Cotton Bedsheet Queen', category: 'Home & Kitchen', cost: 550, selling: 999, qty: 42 },
    { name: 'Green Tea 100 Bags', category: 'Food & Beverages', cost: 180, selling: 349, qty: 88 },
    { name: 'Hair Oil Coconut 200ml', category: 'Beauty & Personal Care', cost: 95, selling: 179, qty: 110 },
    { name: 'Whiteboard Marker Set', category: 'Stationery', cost: 95, selling: 189, qty: 65 },
    { name: 'Puzzle 1000 Pieces', category: 'Toys', cost: 380, selling: 699, qty: 9 },
    { name: 'Bluetooth Speaker', category: 'Electronics', cost: 1100, selling: 1899, qty: 22 },
    { name: 'Yoga Mat Premium', category: 'Home & Kitchen', cost: 420, selling: 799, qty: 35 },
    { name: 'Protein Powder 1kg', category: 'Food & Beverages', cost: 1200, selling: 1999, qty: 18 },
  ];

  return products.map((item, index) => {
    const margin = ((item.selling - item.cost) / item.selling) * 100;
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    if (item.qty === 0) status = 'Out of Stock';
    else if (item.qty < 10) status = 'Low Stock';
    else status = 'In Stock';

    return {
      id: `INV-${1000 + index}`,
      name: item.name,
      sku: `SKU${1000 + index}`,
      category: item.category,
      quantity: item.qty,
      costPrice: item.cost,
      sellingPrice: item.selling,
      margin: Number(margin.toFixed(1)),
      status,
      reorderLevel: 10,
      warehouse: index % 3 === 0 ? 'Main Warehouse' : index % 3 === 1 ? 'Store A' : 'Store B',
      image: `https://via.placeholder.com/50?text=${item.name.substring(0, 2)}`,
    };
  });
};

type Order = 'asc' | 'desc';

const InventoryManager: React.FC = () => {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState<InventoryItem[]>(generateMockInventory());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof InventoryItem>('name');
  const [order, setOrder] = useState<Order>('asc');
  
  // Dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Add product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    reorderLevel: 10,
    warehouse: 'Main Warehouse',
  });

  // Restock form
  const [restockQuantity, setRestockQuantity] = useState(0);
  const [expectedDelivery, setExpectedDelivery] = useState('');

  // Filtering and sorting
  const filteredInventory = useMemo(() => {
    let filtered = inventory;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    return filtered;
  }, [inventory, searchQuery, statusFilter]);

  const sortedInventory = useMemo(() => {
    const sorted = [...filteredInventory].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [filteredInventory, orderBy, order]);

  const paginatedInventory = useMemo(() => {
    return sortedInventory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedInventory, page, rowsPerPage]);

  // Summary calculations
  const totalProducts = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  const lowStockItems = inventory.filter((item) => item.status === 'Low Stock').length;
  const outOfStockItems = inventory.filter((item) => item.status === 'Out of Stock').length;

  const handleRequestSort = (property: keyof InventoryItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleAddProduct = () => {
    const margin = ((newProduct.sellingPrice - newProduct.costPrice) / newProduct.sellingPrice) * 100;
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    if (newProduct.quantity === 0) status = 'Out of Stock';
    else if (newProduct.quantity < newProduct.reorderLevel) status = 'Low Stock';
    else status = 'In Stock';

    const product: InventoryItem = {
      id: `INV-${Date.now()}`,
      ...newProduct,
      margin: Number(margin.toFixed(1)),
      status,
      image: `https://via.placeholder.com/50?text=${newProduct.name.substring(0, 2)}`,
    };

    setInventory([product, ...inventory]);
    setAddDialogOpen(false);
    setNewProduct({
      name: '',
      sku: '',
      category: '',
      quantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      reorderLevel: 10,
      warehouse: 'Main Warehouse',
    });
  };

  const handleRestock = () => {
    if (selectedItem) {
      const updatedInventory = inventory.map((item) => {
        if (item.id === selectedItem.id) {
          const newQuantity = item.quantity + restockQuantity;
          let status: 'In Stock' | 'Low Stock' | 'Out of Stock';
          if (newQuantity === 0) status = 'Out of Stock';
          else if (newQuantity < item.reorderLevel) status = 'Low Stock';
          else status = 'In Stock';

          return { ...item, quantity: newQuantity, status };
        }
        return item;
      });

      setInventory(updatedInventory);
      setRestockDialogOpen(false);
      setRestockQuantity(0);
      setExpectedDelivery('');
      setSelectedItem(null);
    }
  };

  const handleDelete = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  const getQuantityColor = (quantity: number) => {
    if (quantity > 50) return 'success.main';
    if (quantity >= 10) return 'warning.main';
    return 'error.main';
  };

  const getMarginColor = (margin: number) => {
    if (margin > 20) return 'success.main';
    if (margin >= 10) return 'warning.main';
    return 'error.main';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
          {t('Inventory Management')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1642' } }}
        >
          {t('Add Product')}
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder={t('Search products, SKU, or category...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('Status Filter')}</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label={t('Status Filter')}>
            <MenuItem value="all">{t('All Status')}</MenuItem>
            <MenuItem value="In Stock">{t('In Stock')}</MenuItem>
            <MenuItem value="Low Stock">{t('Low Stock')}</MenuItem>
            <MenuItem value="Out of Stock">{t('Out of Stock')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <InventoryIcon sx={{ fontSize: 40, color: '#1a237e' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('Total Products')}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalProducts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('Total Value')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    ₹{totalValue.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WarningIcon sx={{ fontSize: 40, color: '#ff9800' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('Low Stock Items')}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800' }}>
                    {lowStockItems}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ErrorIcon sx={{ fontSize: 40, color: '#f44336' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('Out of Stock')}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                    {outOfStockItems}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    {t('Product')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'category'}
                    direction={orderBy === 'category' ? order : 'asc'}
                    onClick={() => handleRequestSort('category')}
                  >
                    {t('Category')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'quantity'}
                    direction={orderBy === 'quantity' ? order : 'asc'}
                    onClick={() => handleRequestSort('quantity')}
                  >
                    {t('Quantity')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'costPrice'}
                    direction={orderBy === 'costPrice' ? order : 'asc'}
                    onClick={() => handleRequestSort('costPrice')}
                  >
                    {t('Cost Price')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'sellingPrice'}
                    direction={orderBy === 'sellingPrice' ? order : 'asc'}
                    onClick={() => handleRequestSort('sellingPrice')}
                  >
                    {t('Selling Price')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'margin'}
                    direction={orderBy === 'margin' ? order : 'asc'}
                    onClick={() => handleRequestSort('margin')}
                  >
                    {t('Margin')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    {t('Status')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInventory.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={item.image} alt={item.name} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.sku}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{ color: getQuantityColor(item.quantity), fontWeight: 600 }}>
                      {item.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">₹{item.costPrice.toLocaleString('en-IN')}</TableCell>
                  <TableCell align="right">₹{item.sellingPrice.toLocaleString('en-IN')}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{ color: getMarginColor(item.margin), fontWeight: 600 }}>
                      {item.margin}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => {
                        setSelectedItem(item);
                        setRestockDialogOpen(true);
                      }}
                    >
                      <InventoryIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={sortedInventory.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('Add New Product')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label={t('Product Name')}
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('SKU')}
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('Category')}</InputLabel>
              <Select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                label={t('Category')}
              >
                <MenuItem value="Electronics">{t('Electronics')}</MenuItem>
                <MenuItem value="Clothing">{t('Clothing')}</MenuItem>
                <MenuItem value="Food & Beverages">{t('Food & Beverages')}</MenuItem>
                <MenuItem value="Home & Kitchen">{t('Home & Kitchen')}</MenuItem>
                <MenuItem value="Beauty & Personal Care">{t('Beauty & Personal Care')}</MenuItem>
                <MenuItem value="Stationery">{t('Stationery')}</MenuItem>
                <MenuItem value="Toys">{t('Toys')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t('Quantity')}
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label={t('Cost Price (INR)')}
              type="number"
              value={newProduct.costPrice}
              onChange={(e) => setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label={t('Selling Price (INR)')}
              type="number"
              value={newProduct.sellingPrice}
              onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label={t('Reorder Level')}
              type="number"
              value={newProduct.reorderLevel}
              onChange={(e) => setNewProduct({ ...newProduct, reorderLevel: Number(e.target.value) })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('Warehouse')}</InputLabel>
              <Select
                value={newProduct.warehouse}
                onChange={(e) => setNewProduct({ ...newProduct, warehouse: e.target.value })}
                label={t('Warehouse')}
              >
                <MenuItem value="Main Warehouse">{t('Main Warehouse')}</MenuItem>
                <MenuItem value="Store A">{t('Store A')}</MenuItem>
                <MenuItem value="Store B">{t('Store B')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>{t('Cancel')}</Button>
          <Button
            onClick={handleAddProduct}
            variant="contained"
            disabled={!newProduct.name || !newProduct.sku || !newProduct.category}
            sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1642' } }}
          >
            {t('Add Product')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={restockDialogOpen} onClose={() => setRestockDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('Restock Product')}</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography variant="body2">
                <strong>{t('Product')}:</strong> {selectedItem.name}
              </Typography>
              <Typography variant="body2">
                <strong>{t('Current Stock')}:</strong> {selectedItem.quantity}
              </Typography>
              <TextField
                label={t('Restock Quantity')}
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(Number(e.target.value))}
                fullWidth
              />
              <TextField
                label={t('Expected Delivery Date')}
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <Typography variant="body2" sx={{ color: '#1a237e', fontWeight: 600 }}>
                {t('New Stock')}: {selectedItem.quantity + restockQuantity}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestockDialogOpen(false)}>{t('Cancel')}</Button>
          <Button
            onClick={handleRestock}
            variant="contained"
            disabled={restockQuantity <= 0}
            sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1642' } }}
          >
            {t('Confirm Restock')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryManager;
