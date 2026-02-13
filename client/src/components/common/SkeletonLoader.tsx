import React from 'react';
import { Box, Card, CardContent, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Grid } from '@mui/material';

interface SkeletonLoaderProps {
  variant: 'productCard' | 'dashboard' | 'table' | 'chat' | 'list';
  count?: number;
}

export const ProductCardSkeleton: React.FC = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={200} animation="wave" />
    <CardContent sx={{ flexGrow: 1 }}>
      <Skeleton variant="text" width="60%" height={24} animation="wave" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={20} animation="wave" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" height={20} animation="wave" sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Skeleton variant="text" width="30%" height={28} animation="wave" />
        <Skeleton variant="text" width="25%" height={20} animation="wave" />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width="48%" height={36} animation="wave" sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width="48%" height={36} animation="wave" sx={{ borderRadius: 1 }} />
      </Box>
    </CardContent>
  </Card>
);

export const DashboardSkeleton: React.FC = () => (
  <Box>
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Skeleton variant="text" width="60%" height={24} animation="wave" />
                <Skeleton variant="circular" width={40} height={40} animation="wave" />
              </Box>
              <Skeleton variant="text" width="80%" height={40} animation="wave" sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={20} animation="wave" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="40%" height={28} animation="wave" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={350} animation="wave" sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={28} animation="wave" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={350} animation="wave" sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export const TableSkeleton: React.FC = () => (
  <Table>
    <TableHead>
      <TableRow>
        {[1, 2, 3, 4, 5].map((col) => (
          <TableCell key={col}>
            <Skeleton variant="text" width="80%" height={24} animation="wave" />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
        <TableRow key={row}>
          {[1, 2, 3, 4, 5].map((col) => (
            <TableCell key={col}>
              <Skeleton variant="text" width="90%" height={20} animation="wave" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const ChatSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
    {[1, 2, 3, 4, 5].map((item) => (
      <Box
        key={item}
        sx={{
          display: 'flex',
          justifyContent: item % 2 === 0 ? 'flex-end' : 'flex-start',
        }}
      >
        <Box sx={{ maxWidth: '70%' }}>
          <Skeleton
            variant="rectangular"
            width={item % 2 === 0 ? 200 : 250}
            height={item === 3 ? 100 : 60}
            animation="wave"
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
    ))}
  </Box>
);

export const ListSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={48} height={48} animation="wave" />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="60%" height={24} animation="wave" sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="40%" height={20} animation="wave" />
        </Box>
        <Skeleton variant="rectangular" width={80} height={32} animation="wave" sx={{ borderRadius: 1 }} />
      </Box>
    ))}
  </Box>
);

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant, count = 1 }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'productCard':
        return <ProductCardSkeleton />;
      case 'dashboard':
        return <DashboardSkeleton />;
      case 'table':
        return <TableSkeleton />;
      case 'chat':
        return <ChatSkeleton />;
      case 'list':
        return <ListSkeleton />;
      default:
        return null;
    }
  };

  if (variant === 'productCard') {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <ProductCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  return <>{renderSkeleton()}</>;
};

export default SkeletonLoader;
