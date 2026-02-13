import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Divider,
} from '@mui/material';
import {
  Add,
  Group,
  Search,
  Savings,
  AccessTime,
  Share,
  TrendingUp,
  CheckCircle,
  Cancel,
  Schedule,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface GroupDeal {
  id: string;
  productName: string;
  brand: string;
  image: string;
  regularPrice: number;
  groupPrice: number;
  savingsPerPerson: number;
  currentMembers: number;
  targetMembers: number;
  expiresAt: Date;
  creator: {
    name: string;
    avatar: string;
  };
  status: 'pending' | 'active' | 'completed' | 'expired';
  category: string;
}

const mockGroupDeals: GroupDeal[] = [
  {
    id: '1',
    productName: 'iPhone 15 Pro (256GB)',
    brand: 'Apple',
    image: 'https://via.placeholder.com/300x200/1a237e/ffffff?text=iPhone+15+Pro',
    regularPrice: 134900,
    groupPrice: 127900,
    savingsPerPerson: 7000,
    currentMembers: 8,
    targetMembers: 10,
    expiresAt: new Date('2026-02-14T23:59:59'),
    creator: {
      name: 'Rahul Kumar',
      avatar: 'RK',
    },
    status: 'active',
    category: 'Electronics',
  },
  {
    id: '2',
    productName: 'Samsung 65" QLED TV',
    brand: 'Samsung',
    image: 'https://via.placeholder.com/300x200/ff6f00/ffffff?text=Samsung+QLED',
    regularPrice: 119990,
    groupPrice: 104990,
    savingsPerPerson: 15000,
    currentMembers: 15,
    targetMembers: 20,
    expiresAt: new Date('2026-02-15T23:59:59'),
    creator: {
      name: 'Priya Sharma',
      avatar: 'PS',
    },
    status: 'active',
    category: 'Electronics',
  },
  {
    id: '3',
    productName: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    image: 'https://via.placeholder.com/300x200/1a237e/ffffff?text=Sony+Headphones',
    regularPrice: 29990,
    groupPrice: 25990,
    savingsPerPerson: 4000,
    currentMembers: 4,
    targetMembers: 5,
    expiresAt: new Date('2026-02-13T23:59:59'),
    creator: {
      name: 'Amit Patel',
      avatar: 'AP',
    },
    status: 'active',
    category: 'Electronics',
  },
  {
    id: '4',
    productName: 'Dyson V15 Vacuum Cleaner',
    brand: 'Dyson',
    image: 'https://via.placeholder.com/300x200/ff6f00/ffffff?text=Dyson+V15',
    regularPrice: 62900,
    groupPrice: 55900,
    savingsPerPerson: 7000,
    currentMembers: 7,
    targetMembers: 10,
    expiresAt: new Date('2026-02-16T23:59:59'),
    creator: {
      name: 'Sneha Reddy',
      avatar: 'SR',
    },
    status: 'active',
    category: 'Home',
  },
  {
    id: '5',
    productName: 'MacBook Air M3 (16GB)',
    brand: 'Apple',
    image: 'https://via.placeholder.com/300x200/1a237e/ffffff?text=MacBook+Air',
    regularPrice: 134900,
    groupPrice: 124900,
    savingsPerPerson: 10000,
    currentMembers: 18,
    targetMembers: 20,
    expiresAt: new Date('2026-02-17T23:59:59'),
    creator: {
      name: 'Vikram Singh',
      avatar: 'VS',
    },
    status: 'active',
    category: 'Electronics',
  },
  {
    id: '6',
    productName: 'Nike Air Jordan 1 Retro',
    brand: 'Nike',
    image: 'https://via.placeholder.com/300x200/ff6f00/ffffff?text=Air+Jordan',
    regularPrice: 16995,
    groupPrice: 13995,
    savingsPerPerson: 3000,
    currentMembers: 22,
    targetMembers: 20,
    expiresAt: new Date('2026-02-12T12:00:00'),
    creator: {
      name: 'Aditya Gupta',
      avatar: 'AG',
    },
    status: 'completed',
    category: 'Fashion',
  },
  {
    id: '7',
    productName: 'PlayStation 5 Disc Edition',
    brand: 'Sony',
    image: 'https://via.placeholder.com/300x200/1a237e/ffffff?text=PS5',
    regularPrice: 54990,
    groupPrice: 49990,
    savingsPerPerson: 5000,
    currentMembers: 12,
    targetMembers: 10,
    expiresAt: new Date('2026-02-18T23:59:59'),
    creator: {
      name: 'Karthik Nair',
      avatar: 'KN',
    },
    status: 'active',
    category: 'Electronics',
  },
  {
    id: '8',
    productName: 'Fitbit Charge 6',
    brand: 'Fitbit',
    image: 'https://via.placeholder.com/300x200/ff6f00/ffffff?text=Fitbit',
    regularPrice: 13999,
    groupPrice: 11999,
    savingsPerPerson: 2000,
    currentMembers: 9,
    targetMembers: 10,
    expiresAt: new Date('2026-02-13T18:00:00'),
    creator: {
      name: 'Meera Joshi',
      avatar: 'MJ',
    },
    status: 'active',
    category: 'Electronics',
  },
];

const GroupBuying: React.FC = () => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [newGroup, setNewGroup] = useState({
    product: '',
    targetSize: 10,
    discountTarget: 15,
    expiryDays: 7,
    description: '',
  });

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date().getTime();
    const target = expiresAt.getTime();
    const diff = target - now;

    if (diff <= 0) return t('consumer.groupBuying.expired', 'Expired');

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return t('consumer.groupBuying.daysHours', '{{days}}d {{hours}}h', { days, hours });
    }
    return t('consumer.groupBuying.hours', '{{hours}}h', { hours });
  };

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      pending: { color: 'warning' as const, icon: <Schedule />, label: t('consumer.groupBuying.pending', 'Pending') },
      active: { color: 'primary' as const, icon: <TrendingUp />, label: t('consumer.groupBuying.active', 'Active') },
      completed: { color: 'success' as const, icon: <CheckCircle />, label: t('consumer.groupBuying.completed', 'Completed') },
      expired: { color: 'error' as const, icon: <Cancel />, label: t('consumer.groupBuying.expired', 'Expired') },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Chip icon={config.icon} label={config.label} color={config.color} size="small" />;
  };

  const activeDeals = mockGroupDeals.filter((d) => d.status === 'active');
  const myGroups = mockGroupDeals.slice(0, 3); // Mock data for "my groups"

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
              {t('consumer.groupBuying.title', 'Group Deals')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('consumer.groupBuying.subtitle', 'Save more when you buy together')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            {t('consumer.groupBuying.startGroup', 'Start a Group')}
          </Button>
        </Box>

        {/* How It Works */}
        <Card sx={{ mb: 4, bgcolor: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, textAlign: 'center' }}>
              {t('consumer.groupBuying.howItWorks', 'How It Works')}
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Search sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {t('consumer.groupBuying.step1Title', 'Find a Product')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('consumer.groupBuying.step1Desc', 'Browse active group deals or create your own')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Group sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {t('consumer.groupBuying.step2Title', 'Invite Friends')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('consumer.groupBuying.step2Desc', 'Share the deal and grow your group')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Savings sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {t('consumer.groupBuying.step3Title', 'Save Together')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('consumer.groupBuying.step3Desc', 'Everyone gets the discounted price')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: 'success.main',
                color: 'white',
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                ₹12.5L
              </Typography>
              <Typography variant="body1">
                {t('consumer.groupBuying.savedThisMonth', 'Saved by groups this month')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: 'primary.main',
                color: 'white',
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                250+
              </Typography>
              <Typography variant="body1">
                {t('consumer.groupBuying.activeGroups', 'Active groups right now')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
            <Tab label={t('consumer.groupBuying.allDeals', 'All Group Deals')} />
            <Tab label={t('consumer.groupBuying.myGroups', 'My Groups')} />
          </Tabs>
        </Box>

        {/* Active Group Deals */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {activeDeals.map((deal) => (
              <Grid item xs={12} md={6} lg={4} key={deal.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 6 }, transition: 'all 0.3s' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={deal.image}
                    alt={deal.productName}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {deal.brand}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                          {deal.productName}
                        </Typography>
                      </Box>
                      {getStatusChip(deal.status)}
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                          ₹{deal.groupPrice.toLocaleString('en-IN')}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                        >
                          ₹{deal.regularPrice.toLocaleString('en-IN')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        {t('consumer.groupBuying.savePerPerson', 'Save ₹{{amount}} per person', {
                          amount: deal.savingsPerPerson.toLocaleString('en-IN'),
                        })}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {deal.currentMembers}/{deal.targetMembers} {t('consumer.groupBuying.members', 'members')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round(getProgress(deal.currentMembers, deal.targetMembers))}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getProgress(deal.currentMembers, deal.targetMembers)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: deal.currentMembers >= deal.targetMembers ? 'success.main' : 'primary.main',
                          },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mb: 2,
                        p: 1,
                        bgcolor: '#fff3e0',
                        borderRadius: 1,
                      }}
                    >
                      <AccessTime fontSize="small" color="warning" />
                      <Typography variant="caption" color="warning.dark" fontWeight="bold">
                        {t('consumer.groupBuying.endsIn', 'Ends in')} {getTimeRemaining(deal.expiresAt)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: '0.75rem' }}>
                        {deal.creator.avatar}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {t('consumer.groupBuying.createdBy', 'Created by')} <strong>{deal.creator.name}</strong>
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ borderRadius: 2 }}
                        disabled={deal.status !== 'active'}
                      >
                        {t('consumer.groupBuying.joinGroup', 'Join Group')}
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{ minWidth: 48, px: 1, borderRadius: 2 }}
                      >
                        <Share fontSize="small" />
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* My Groups Tab */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            {myGroups.map((deal) => (
              <Grid item xs={12} md={6} lg={4} key={deal.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={deal.image}
                    alt={deal.productName}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {deal.productName}
                      </Typography>
                      {getStatusChip(deal.status)}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {deal.currentMembers}/{deal.targetMembers} members • {getTimeRemaining(deal.expiresAt)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(deal.currentMembers, deal.targetMembers)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Start Group Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {t('consumer.groupBuying.startGroupTitle', 'Start a New Group Deal')}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label={t('consumer.groupBuying.productSearch', 'Product Name or URL')}
                placeholder={t('consumer.groupBuying.productPlaceholder', 'Search for a product...')}
                value={newGroup.product}
                onChange={(e) => setNewGroup({ ...newGroup, product: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>{t('consumer.groupBuying.targetSize', 'Target Group Size')}</InputLabel>
                <Select
                  value={newGroup.targetSize}
                  label={t('consumer.groupBuying.targetSize', 'Target Group Size')}
                  onChange={(e) => setNewGroup({ ...newGroup, targetSize: e.target.value as number })}
                >
                  <MenuItem value={5}>5 {t('consumer.groupBuying.people', 'people')}</MenuItem>
                  <MenuItem value={10}>10 {t('consumer.groupBuying.people', 'people')}</MenuItem>
                  <MenuItem value={20}>20 {t('consumer.groupBuying.people', 'people')}</MenuItem>
                  <MenuItem value={50}>50 {t('consumer.groupBuying.people', 'people')}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                type="number"
                label={t('consumer.groupBuying.discountTarget', 'Desired Discount %')}
                value={newGroup.discountTarget}
                onChange={(e) => setNewGroup({ ...newGroup, discountTarget: Number(e.target.value) })}
              />
              <FormControl fullWidth>
                <InputLabel>{t('consumer.groupBuying.expiryDate', 'Expiry Period')}</InputLabel>
                <Select
                  value={newGroup.expiryDays}
                  label={t('consumer.groupBuying.expiryDate', 'Expiry Period')}
                  onChange={(e) => setNewGroup({ ...newGroup, expiryDays: e.target.value as number })}
                >
                  <MenuItem value={3}>3 {t('consumer.groupBuying.days', 'days')}</MenuItem>
                  <MenuItem value={7}>7 {t('consumer.groupBuying.days', 'days')}</MenuItem>
                  <MenuItem value={14}>14 {t('consumer.groupBuying.days', 'days')}</MenuItem>
                  <MenuItem value={30}>30 {t('consumer.groupBuying.days', 'days')}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('consumer.groupBuying.description', 'Description (Optional)')}
                placeholder={t('consumer.groupBuying.descriptionPlaceholder', 'Tell others why this is a great deal...')}
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              {t('consumer.groupBuying.cancel', 'Cancel')}
            </Button>
            <Button variant="contained" onClick={() => setOpenDialog(false)}>
              {t('consumer.groupBuying.createGroup', 'Create Group')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default GroupBuying;
