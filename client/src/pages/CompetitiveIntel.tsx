import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  Stack,
  Alert,
} from '@mui/material';
import { TrendingUp, Warning, Lightbulb } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DashboardSkeleton, ExportButton } from '../components/common';
import { msmeApi } from '../api';

const CompetitiveIntel: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [threats, setThreats] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [compRes, oppRes, threatRes] = await Promise.allSettled([
        msmeApi.getCompetitors(),
        msmeApi.getMarketOpportunities(),
        msmeApi.getMarketThreats(),
      ]);

      if (compRes.status === 'fulfilled') setCompetitors(compRes.value.data || []);
      if (oppRes.status === 'fulfilled') setOpportunities(oppRes.value.data || []);
      if (threatRes.status === 'fulfilled') setThreats(threatRes.value.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Competitive Intelligence
        </Typography>
        <ExportButton data={[...opportunities, ...threats]} filename="competitive-intel" />
      </Box>

      <Grid container spacing={3}>
        {/* Competitors */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Competitors ({competitors.length})
              </Typography>
              <Grid container spacing={2}>
                {competitors.map((comp) => (
                  <Grid item xs={12} sm={6} md={4} key={comp.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {comp.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {comp.platform}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip label={`₹${comp.price.toLocaleString()}`} size="small" />
                          <Chip label={`${comp.market_share}% share`} size="small" sx={{ ml: 1 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Opportunities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lightbulb color="success" />
                Market Opportunities
              </Typography>
              {opportunities.length === 0 ? (
                <Alert severity="info">No opportunities detected</Alert>
              ) : (
                <Stack spacing={2}>
                  {opportunities.map((opp) => (
                    <Card key={opp.id} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {opp.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {opp.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip label={opp.category} size="small" />
                          <Chip label={`₹${opp.potential_revenue?.toLocaleString()}`} size="small" color="success" sx={{ ml: 1 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Threats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="error" />
                Market Threats
              </Typography>
              {threats.length === 0 ? (
                <Alert severity="success">No threats detected</Alert>
              ) : (
                <Stack spacing={2}>
                  {threats.map((threat) => (
                    <Card key={threat.id} variant="outlined">
                      <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={threat.severity}
                            size="small"
                            color={threat.severity === 'critical' ? 'error' : 'warning'}
                          />
                          <Typography variant="subtitle2" fontWeight="bold">
                            {threat.title}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {threat.description}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Mitigation:</strong> {threat.mitigation}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompetitiveIntel;
