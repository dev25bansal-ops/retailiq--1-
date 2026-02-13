import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Stack,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Comment,
  Share,
  Flag,
  Add,
  Verified,
  TrendingUp,
  Upload,
  AccessTime,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Deal, Product } from '../../types/index';

const mockDeals: Deal[] = [
  {
    id: '1',
    productId: 'p1',
    title: 'iPhone 15 Pro Max (256GB) - All Time Low Price!',
    description: 'Limited time offer with bank discount. Grab it before stock runs out. Original packaging with warranty.',
    currentPrice: 129999,
    originalPrice: 159900,
    discount: 19,
    platform: 'Flipkart',
    postedBy: 'TechSaver',
    postedAt: new Date('2026-02-12T10:30:00'),
    upvotes: 234,
    downvotes: 12,
    comments: 45,
    verified: true,
    expiresAt: new Date('2026-02-14T23:59:59'),
    imageUrl: 'https://via.placeholder.com/300x200/1a237e/ffffff?text=iPhone+15+Pro',
    category: 'Electronics',
  },
  {
    id: '2',
    productId: 'p2',
    title: 'Samsung 55" 4K Smart TV - Festival Price Extended',
    description: 'Best price ever! 4K UHD, HDR10+, 120Hz. Perfect for gaming and movies.',
    currentPrice: 42999,
    originalPrice: 74990,
    discount: 43,
    platform: 'Amazon',
    postedBy: 'DealHunter92',
    postedAt: new Date('2026-02-12T09:15:00'),
    upvotes: 189,
    downvotes: 8,
    comments: 32,
    verified: true,
    imageUrl: 'https://via.placeholder.com/300x200/ff6f00/ffffff?text=Samsung+TV',
    category: 'Electronics',
  },
  {
    id: '3',
    productId: 'p3',
    title: 'Nike Air Max 270 - Flat 60% Off with Coupon',
    description: 'Use code SNEAKER60. Limited sizes available. Authentic Nike product.',
    currentPrice: 4799,
    originalPrice: 11995,
    discount: 60,
    platform: 'Myntra',
    postedBy: 'SneakerHead',
    postedAt: new Date('2026-02-12T08:45:00'),
    upvotes: 156,
    downvotes: 5,
    comments: 28,
    verified: false,
    expiresAt: new Date('2026-02-13T23:59:59'),
    imageUrl: 'https://via.placeholder.com/300x200/1a237e/ffffff?text=Nike+Shoes',
    category: 'Fashion',
  },
  {
    id: '4',
    productId: 'p4',
    title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation. New lowest price with additional exchange discount.',
    currentPrice: 24990,
    originalPrice: 34990,
    discount: 29,
    platform: 'Croma',
    postedBy: 'AudioPhile',
    postedAt: new Date('2026-02-12T07:20:00'),
    upvotes: 142,
    downvotes: 3,
    comments: 19,
    verified: true,
    imageUrl: 'https://via.placeholder.com/300x200/ff6f00/ffffff?text=Sony+Headphones',
    category: 'Electronics',
  },
  {
    id: '5',
    productId: 'p5',
    title: 'Lakme Makeup Combo - Buy 2 Get 2 Free',
    description: 'Amazing offer on Lakme products. Includes lipstick, kajal, mascara. Limited period offer.',
    currentPrice: 999,
    originalPrice: 2396,
    discount: 58,
    platform: 'Nykaa',
    postedBy: 'BeautyQueen',
    postedAt: new Date('2026-02-12T06:00:00'),
    upvotes: 98,
    downvotes: 2,
    comments: 15,
    verified: true,
    imageUrl: 'https://via.placeholder.com/300x200/1a237e/ffffff?text=Lakme+Combo',
    category: 'Beauty',
  },
  {
    id: '6',
    productId: 'p6',
    title: 'Philips Air Fryer - Extra ₹1000 Off on Prepaid',
    description: 'Healthy cooking made easy. 4.1L capacity, digital display, recipe book included.',
    currentPrice: 5999,
    originalPrice: 9995,
    discount: 40,
    platform: 'Flipkart',
    postedBy: 'HomeChef',
    postedAt: new Date('2026-02-11T22:30:00'),
    upvotes: 87,
    downvotes: 4,
    comments: 12,
    verified: false,
    imageUrl: 'https://via.placeholder.com/300x200/ff6f00/ffffff?text=Air+Fryer',
    category: 'Home',
  },
  {
    id: '7',
    productId: 'p7',
    title: 'Levi\'s Jeans - Flat 70% Off on Selected Styles',
    description: 'Clearance sale on authentic Levi\'s. All sizes in stock. Don\'t miss this!',
    currentPrice: 1499,
    originalPrice: 4999,
    discount: 70,
    platform: 'Ajio',
    postedBy: 'FashionDeals',
    postedAt: new Date('2026-02-11T20:15:00'),
    upvotes: 76,
    downvotes: 6,
    comments: 22,
    verified: true,
    expiresAt: new Date('2026-02-15T23:59:59'),
    imageUrl: 'https://via.placeholder.com/300x200/1a237e/ffffff?text=Levis+Jeans',
    category: 'Fashion',
  },
  {
    id: '8',
    productId: 'p8',
    title: 'PlayStation 5 Digital Edition - In Stock Alert!',
    description: 'Finally in stock! Get it before it goes out of stock again. Original Sony warranty.',
    currentPrice: 44990,
    originalPrice: 44990,
    discount: 0,
    platform: 'Amazon',
    postedBy: 'GamerDude',
    postedAt: new Date('2026-02-11T19:00:00'),
    upvotes: 312,
    downvotes: 18,
    comments: 67,
    verified: true,
    imageUrl: 'https://via.placeholder.com/300x200/ff6f00/ffffff?text=PS5',
    category: 'Electronics',
  },
  {
    id: '9',
    productId: 'p9',
    title: 'Woodland Leather Shoes - Buy 1 Get 1 Free',
    description: 'Premium leather shoes. Perfect for office and casual wear. Limited stocks.',
    currentPrice: 2999,
    originalPrice: 5998,
    discount: 50,
    platform: 'Myntra',
    postedBy: 'ShoeCollector',
    postedAt: new Date('2026-02-11T17:45:00'),
    upvotes: 54,
    downvotes: 3,
    comments: 8,
    verified: false,
    imageUrl: 'https://via.placeholder.com/300x200/1a237e/ffffff?text=Woodland',
    category: 'Fashion',
  },
  {
    id: '10',
    productId: 'p10',
    title: 'Dyson V12 Cordless Vacuum - Best Price Ever',
    description: 'Laser detect technology. 60 min runtime. Complete home cleaning solution.',
    currentPrice: 39900,
    originalPrice: 54900,
    discount: 27,
    platform: 'Croma',
    postedBy: 'CleanHome',
    postedAt: new Date('2026-02-11T16:20:00'),
    upvotes: 45,
    downvotes: 2,
    comments: 11,
    verified: true,
    imageUrl: 'https://via.placeholder.com/300x200/ff6f00/ffffff?text=Dyson',
    category: 'Home',
  },
  {
    id: '11',
    productId: 'p11',
    title: 'MAC Lipstick Set - 3 Shades for Price of 1',
    description: 'Bestselling shades. Matte finish. Original MAC products with hologram.',
    currentPrice: 1850,
    originalPrice: 5550,
    discount: 67,
    platform: 'Nykaa',
    postedBy: 'MakeupLover',
    postedAt: new Date('2026-02-11T15:00:00'),
    upvotes: 91,
    downvotes: 1,
    comments: 19,
    verified: true,
    expiresAt: new Date('2026-02-13T23:59:59'),
    imageUrl: 'https://via.placeholder.com/300x200/1a237e/ffffff?text=MAC+Lipstick',
    category: 'Beauty',
  },
  {
    id: '12',
    productId: 'p12',
    title: 'OnePlus 11R 5G (16GB/256GB) - Lightning Deal',
    description: 'Flagship killer is back! Snapdragon 8+ Gen 1, 100W fast charging. Only 100 units.',
    currentPrice: 39999,
    originalPrice: 49999,
    discount: 20,
    platform: 'Amazon',
    postedBy: 'MobileExpert',
    postedAt: new Date('2026-02-11T14:30:00'),
    upvotes: 178,
    downvotes: 9,
    comments: 34,
    verified: true,
    expiresAt: new Date('2026-02-12T18:00:00'),
    imageUrl: 'https://via.placeholder.com/300x200/ff6f00/ffffff?text=OnePlus+11R',
    category: 'Electronics',
  },
];

const DealCommunity: React.FC = () => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<string>('new');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [newDeal, setNewDeal] = useState({
    url: '',
    title: '',
    description: '',
    category: '',
  });

  const platformColors: Record<string, string> = {
    Amazon: '#FF9900',
    Flipkart: '#2874F0',
    Myntra: '#EE5F73',
    Nykaa: '#FC2779',
    Croma: '#00A89F',
    Ajio: '#B42A2F',
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return t('consumer.dealCommunity.justNow', 'Just now');
    if (hours < 24) return t('consumer.dealCommunity.hoursAgo', '{{hours}}h ago', { hours });
    const days = Math.floor(hours / 24);
    return t('consumer.dealCommunity.daysAgo', '{{days}}d ago', { days });
  };

  const getExpiryWarning = (expiresAt?: Date) => {
    if (!expiresAt) return null;
    const hoursLeft = Math.floor((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60));
    if (hoursLeft < 0) return null;
    if (hoursLeft < 24) {
      return t('consumer.dealCommunity.expiresHours', 'Expires in {{hours}} hours', { hours: hoursLeft });
    }
    const daysLeft = Math.ceil(hoursLeft / 24);
    return t('consumer.dealCommunity.expiresDays', 'Expires in {{days}} days', { days: daysLeft });
  };

  const filteredDeals = mockDeals.filter(
    (deal) => filterCategory === 'All' || deal.category === filterCategory
  );

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortBy === 'popular') return b.upvotes - a.upvotes;
    if (sortBy === 'pricedrop') return b.discount - a.discount;
    return b.postedAt.getTime() - a.postedAt.getTime();
  });

  const topDeals = [...mockDeals]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  const topUsers = [
    { name: 'TechSaver', deals: 234, avatar: 'TS' },
    { name: 'DealHunter92', deals: 189, avatar: 'DH' },
    { name: 'SneakerHead', deals: 156, avatar: 'SH' },
    { name: 'GamerDude', deals: 142, avatar: 'GD' },
    { name: 'BeautyQueen', deals: 98, avatar: 'BQ' },
  ];

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} lg={9}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {t('consumer.dealCommunity.title', 'Deal Community')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
                sx={{ borderRadius: 2 }}
              >
                {t('consumer.dealCommunity.postDeal', 'Post a Deal')}
              </Button>
            </Box>

            {/* Sort Options */}
            <Box sx={{ mb: 3 }}>
              <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={(e, value) => value && setSortBy(value)}
                sx={{ mb: 2 }}
              >
                <ToggleButton value="new">
                  {t('consumer.dealCommunity.sortNew', 'New')}
                </ToggleButton>
                <ToggleButton value="popular">
                  {t('consumer.dealCommunity.sortPopular', 'Popular')}
                </ToggleButton>
                <ToggleButton value="pricedrop">
                  {t('consumer.dealCommunity.sortPriceDrop', 'Price Drop')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Filter Chips */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['All', 'Electronics', 'Fashion', 'Home', 'Beauty'].map((category) => (
                <Chip
                  key={category}
                  label={t(`consumer.dealCommunity.category${category}`, category)}
                  onClick={() => setFilterCategory(category)}
                  color={filterCategory === category ? 'primary' : 'default'}
                  sx={{ fontWeight: filterCategory === category ? 'bold' : 'normal' }}
                />
              ))}
              <Chip
                label={t('consumer.dealCommunity.verifiedOnly', 'Verified Only')}
                icon={<Verified />}
                variant="outlined"
                color="success"
              />
            </Box>

            {/* Deal Feed */}
            <Stack spacing={2}>
              {sortedDeals.map((deal) => (
                <Card key={deal.id} sx={{ '&:hover': { boxShadow: 4 }, transition: 'all 0.3s' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4} md={3}>
                        <CardMedia
                          component="img"
                          image={deal.imageUrl}
                          alt={deal.title}
                          sx={{ borderRadius: 2, height: 160, objectFit: 'cover' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                            {deal.title}
                          </Typography>
                          {deal.verified && (
                            <Chip
                              icon={<Verified />}
                              label={t('consumer.dealCommunity.verified', 'Verified')}
                              color="success"
                              size="small"
                            />
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {deal.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography variant="h5" fontWeight="bold" color="success.main">
                              ₹{deal.currentPrice.toLocaleString('en-IN')}
                            </Typography>
                            {deal.discount > 0 && (
                              <>
                                <Typography
                                  variant="body2"
                                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                >
                                  ₹{deal.originalPrice.toLocaleString('en-IN')}
                                </Typography>
                                <Chip
                                  label={`${deal.discount}% OFF`}
                                  size="small"
                                  sx={{
                                    bgcolor: '#4caf50',
                                    color: 'white',
                                    fontWeight: 'bold',
                                  }}
                                />
                              </>
                            )}
                          </Box>

                          <Chip
                            label={deal.platform}
                            size="small"
                            sx={{
                              bgcolor: platformColors[deal.platform] || '#757575',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.main' }}>
                            {deal.postedBy.charAt(0)}
                          </Avatar>
                          <Typography variant="caption" color="text.secondary">
                            {t('consumer.dealCommunity.postedBy', 'Posted by')} <strong>{deal.postedBy}</strong> • {formatTimeAgo(deal.postedAt)}
                          </Typography>
                        </Box>

                        {getExpiryWarning(deal.expiresAt) && (
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
                              {getExpiryWarning(deal.expiresAt)}
                            </Typography>
                          </Box>
                        )}

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <IconButton size="small" color="primary">
                              <ThumbUp fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" fontWeight="bold">
                              {deal.upvotes}
                            </Typography>
                            <IconButton size="small">
                              <ThumbDown fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" color="text.secondary">
                              {deal.downvotes}
                            </Typography>
                          </Box>

                          <Button
                            size="small"
                            startIcon={<Comment />}
                            sx={{ textTransform: 'none' }}
                          >
                            {deal.comments} {t('consumer.dealCommunity.comments', 'Comments')}
                          </Button>

                          <Button
                            size="small"
                            startIcon={<Share />}
                            sx={{ textTransform: 'none' }}
                          >
                            {t('consumer.dealCommunity.share', 'Share')}
                          </Button>

                          <Button
                            size="small"
                            startIcon={<Flag />}
                            sx={{ textTransform: 'none', color: 'text.secondary' }}
                          >
                            {t('consumer.dealCommunity.report', 'Report')}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={3} sx={{ display: { xs: 'none', lg: 'block' } }}>
            {/* Trending Deals */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  {t('consumer.dealCommunity.trending', 'Trending Deals')}
                </Typography>
              </Box>
              <Stack spacing={2}>
                {topDeals.map((deal, index) => (
                  <Box key={deal.id}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                        sx={{ minWidth: 24 }}
                      >
                        #{index + 1}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                          {deal.title.substring(0, 50)}...
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ThumbUp fontSize="small" color="primary" />
                          <Typography variant="caption">{deal.upvotes}</Typography>
                          <Chip label={`${deal.discount}% OFF`} size="small" color="success" />
                        </Box>
                      </Box>
                    </Box>
                    {index < topDeals.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Most Active Users */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                {t('consumer.dealCommunity.activeUsers', 'Most Active Users')}
              </Typography>
              <Stack spacing={1.5}>
                {topUsers.map((user, index) => (
                  <Box key={user.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 20 }}>
                      {index + 1}.
                    </Typography>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {user.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.deals} {t('consumer.dealCommunity.deals', 'deals')}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Post Deal Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {t('consumer.dealCommunity.postDealTitle', 'Post a New Deal')}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label={t('consumer.dealCommunity.productUrl', 'Product URL')}
                placeholder="https://..."
                value={newDeal.url}
                onChange={(e) => setNewDeal({ ...newDeal, url: e.target.value })}
              />
              <TextField
                fullWidth
                label={t('consumer.dealCommunity.dealTitle', 'Deal Title')}
                placeholder="e.g., iPhone 15 - All Time Low Price"
                value={newDeal.title}
                onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('consumer.dealCommunity.description', 'Description')}
                placeholder="Provide details about the deal..."
                value={newDeal.description}
                onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>{t('consumer.dealCommunity.category', 'Category')}</InputLabel>
                <Select
                  value={newDeal.category}
                  label={t('consumer.dealCommunity.category', 'Category')}
                  onChange={(e) => setNewDeal({ ...newDeal, category: e.target.value })}
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Fashion">Fashion</MenuItem>
                  <MenuItem value="Home">Home</MenuItem>
                  <MenuItem value="Beauty">Beauty</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                sx={{ justifyContent: 'flex-start' }}
              >
                {t('consumer.dealCommunity.uploadScreenshot', 'Upload Screenshot (Optional)')}
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              {t('consumer.dealCommunity.cancel', 'Cancel')}
            </Button>
            <Button variant="contained" onClick={() => setOpenDialog(false)}>
              {t('consumer.dealCommunity.submit', 'Submit Deal')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default DealCommunity;
