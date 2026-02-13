import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { FileDownload, Assessment, Inventory, AttachMoney } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DateRangePicker, ExportButton } from '../components/common';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const mockRevenueData = [
    { date: '2024-01-01', revenue: 15000, orders: 25 },
    { date: '2024-01-02', revenue: 18000, orders: 30 },
    { date: '2024-01-03', revenue: 22000, orders: 35 },
  ];

  const mockInventoryData = [
    { product: 'Product A', inStock: 50, lowStock: 10, outOfStock: 5 },
    { product: 'Product B', inStock: 30, lowStock: 15, outOfStock: 2 },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Reports & Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Generate and download comprehensive business reports
      </Typography>

      <DateRangePicker value={dateRange} onChange={setDateRange} label="Report Period" showPresets />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Revenue Report */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney />
                  Revenue Report
                </Typography>
                <ExportButton data={mockRevenueData} filename="revenue-report" />
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Orders</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockRevenueData.map((row) => (
                      <TableRow key={row.date}>
                        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                        <TableCell align="right">₹{row.revenue.toLocaleString()}</TableCell>
                        <TableCell align="right">{row.orders}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Report */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory />
                  Inventory Report
                </Typography>
                <ExportButton data={mockInventoryData} filename="inventory-report" />
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">In Stock</TableCell>
                      <TableCell align="right">Low Stock</TableCell>
                      <TableCell align="right">Out of Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockInventoryData.map((row) => (
                      <TableRow key={row.product}>
                        <TableCell>{row.product}</TableCell>
                        <TableCell align="right">{row.inStock}</TableCell>
                        <TableCell align="right">{row.lowStock}</TableCell>
                        <TableCell align="right">{row.outOfStock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pricing Analysis */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assessment />
                  Pricing Analysis
                </Typography>
                <Button variant="outlined" startIcon={<FileDownload />}>
                  Download Full Report
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Comprehensive pricing analysis including competitor comparison, market trends, and recommendations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportsPage;
