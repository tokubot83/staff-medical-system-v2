import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GridOn as GridIcon,
  ViewList as ListIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { matrixCorrespondenceTable, type MatrixTableEntry } from '../../data/evaluationMatrixTable';

const getGradeColor = (grade: string): string => {
  const gradeColors: Record<string, string> = {
    'S': '#ff6b6b',
    'A': '#ff9f40', 
    'B': '#4ecdc4',
    'C': '#45b7d1',
    'D': '#96ceb4',
    'E': '#dfe6e9',
    '1': '#e74c3c',
    '2': '#e67e22',
    '3': '#f39c12',
    '4': '#f1c40f',
    '5': '#2ecc71',
    '6': '#3498db',
    '7': '#9b59b6',
  };
  return gradeColors[grade] || '#95a5a6';
};

const getSalaryImpactIcon = (impact?: string) => {
  if (!impact) return <RemoveIcon fontSize="small" />;
  if (impact.includes('大幅増') || impact.includes('15%')) return <TrendingUpIcon color="success" />;
  if (impact.includes('増額') || impact.includes('10%') || impact.includes('5%')) return <TrendingUpIcon color="primary" />;
  if (impact.includes('減額') || impact.includes('凍結')) return <TrendingDownIcon color="error" />;
  return <RemoveIcon fontSize="small" />;
};

export const MatrixCorrespondenceTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFacilityGrade, setSelectedFacilityGrade] = useState<string>('');
  const [selectedCorporateGrade, setSelectedCorporateGrade] = useState<string>('');

  const filteredEntries = useMemo(() => {
    return matrixCorrespondenceTable.filter(entry => {
      const matchesSearch = searchTerm === '' || 
        Object.values(entry).some(value => 
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesFacility = selectedFacilityGrade === '' || 
        entry.facilityGrade === selectedFacilityGrade;
      
      const matchesCorporate = selectedCorporateGrade === '' || 
        entry.corporateGrade === selectedCorporateGrade;
      
      return matchesSearch && matchesFacility && matchesCorporate;
    });
  }, [searchTerm, selectedFacilityGrade, selectedCorporateGrade]);

  const uniqueFacilityGrades = ['S', 'A', 'B', 'C', 'D'];
  const uniqueCorporateGrades = ['S', 'A', 'B', 'C', 'D'];
  const finalGrades = ['1', '2', '3', '4', '5', '6', '7'];

  const getEntryForMatrix = (facility: string, corporate: string): MatrixTableEntry | undefined => {
    return matrixCorrespondenceTable.find(
      e => e.facilityGrade === facility && e.corporateGrade === corporate
    );
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          評価マトリックス対応表
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="検索（評価、説明、従業員タイプなど）"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography>表示モード:</Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, value) => value && setViewMode(value)}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridIcon sx={{ mr: 1 }} />
                  マトリックス
                </ToggleButton>
                <ToggleButton value="list">
                  <ListIcon sx={{ mr: 1 }} />
                  リスト
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>

        {viewMode === 'grid' ? (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              マトリックスビュー
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#ecf0f1' }}>
                      施設\\法人
                    </TableCell>
                    {uniqueCorporateGrades.map(grade => (
                      <TableCell 
                        key={grade} 
                        align="center"
                        sx={{ 
                          fontWeight: 'bold',
                          backgroundColor: '#ecf0f1',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#d5dbdb' }
                        }}
                        onClick={() => setSelectedCorporateGrade(
                          selectedCorporateGrade === grade ? '' : grade
                        )}
                      >
                        <Chip 
                          label={grade} 
                          size="small" 
                          sx={{ 
                            backgroundColor: selectedCorporateGrade === grade 
                              ? getGradeColor(grade) 
                              : '#fff',
                            color: selectedCorporateGrade === grade ? '#fff' : '#000',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uniqueFacilityGrades.map(facilityGrade => (
                    <TableRow key={facilityGrade}>
                      <TableCell 
                        sx={{ 
                          fontWeight: 'bold',
                          backgroundColor: '#ecf0f1',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#d5dbdb' }
                        }}
                        onClick={() => setSelectedFacilityGrade(
                          selectedFacilityGrade === facilityGrade ? '' : facilityGrade
                        )}
                      >
                        <Chip 
                          label={facilityGrade} 
                          size="small" 
                          sx={{ 
                            backgroundColor: selectedFacilityGrade === facilityGrade 
                              ? getGradeColor(facilityGrade) 
                              : '#fff',
                            color: selectedFacilityGrade === facilityGrade ? '#fff' : '#000',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      {uniqueCorporateGrades.map(corporateGrade => {
                        const entry = getEntryForMatrix(facilityGrade, corporateGrade);
                        const isHighlighted = 
                          (selectedFacilityGrade === '' || selectedFacilityGrade === facilityGrade) &&
                          (selectedCorporateGrade === '' || selectedCorporateGrade === corporateGrade);
                        
                        return (
                          <TableCell 
                            key={corporateGrade} 
                            align="center"
                            sx={{ 
                              backgroundColor: isHighlighted ? '#fff' : '#f8f9fa',
                              opacity: isHighlighted ? 1 : 0.5,
                              transition: 'all 0.3s',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#e3f2fd',
                                transform: 'scale(1.05)'
                              }
                            }}
                          >
                            {entry && (
                              <Tooltip 
                                title={
                                  <Box>
                                    <Typography variant="body2"><strong>説明:</strong> {entry.description}</Typography>
                                    <Typography variant="body2"><strong>従業員タイプ:</strong> {entry.employeeType}</Typography>
                                    {entry.actionRequired && (
                                      <Typography variant="body2"><strong>必要な対応:</strong> {entry.actionRequired}</Typography>
                                    )}
                                    {entry.salaryImpact && (
                                      <Typography variant="body2"><strong>給与影響:</strong> {entry.salaryImpact}</Typography>
                                    )}
                                  </Box>
                                }
                                placement="top"
                                arrow
                              >
                                <Box>
                                  <Chip 
                                    label={entry.finalGrade}
                                    size="medium"
                                    sx={{ 
                                      backgroundColor: getGradeColor(entry.finalGrade),
                                      color: '#fff',
                                      fontWeight: 'bold',
                                      fontSize: '1rem'
                                    }}
                                  />
                                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
                                    {getSalaryImpactIcon(entry.salaryImpact)}
                                  </Box>
                                </Box>
                              </Tooltip>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                凡例
              </Typography>
              <Grid container spacing={2}>
                {finalGrades.map(grade => {
                  const sampleEntry = matrixCorrespondenceTable.find(e => e.finalGrade === grade);
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={grade}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={grade}
                          size="small"
                          sx={{ 
                            backgroundColor: getGradeColor(grade),
                            color: '#fff',
                            fontWeight: 'bold'
                          }}
                        />
                        <Typography variant="body2">
                          {sampleEntry?.finalGradeLabel}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              リストビュー ({filteredEntries.length}件)
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#ecf0f1' }}>
                    <TableCell>施設内</TableCell>
                    <TableCell>法人内</TableCell>
                    <TableCell>最終</TableCell>
                    <TableCell>優先度</TableCell>
                    <TableCell>従業員タイプ</TableCell>
                    <TableCell>給与影響</TableCell>
                    <TableCell>昇進可能性</TableCell>
                    <TableCell>説明</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEntries.map((entry, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f5f5f5' },
                        backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
                      }}
                    >
                      <TableCell>
                        <Chip 
                          label={entry.facilityGrade} 
                          size="small"
                          sx={{ 
                            backgroundColor: getGradeColor(entry.facilityGrade),
                            color: '#fff'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={entry.corporateGrade} 
                          size="small"
                          sx={{ 
                            backgroundColor: getGradeColor(entry.corporateGrade),
                            color: '#fff'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${entry.finalGrade} (${entry.finalGradeLabel})`}
                          sx={{ 
                            backgroundColor: getGradeColor(entry.finalGrade),
                            color: '#fff',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {entry.priority}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{entry.employeeType}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getSalaryImpactIcon(entry.salaryImpact)}
                          <Typography variant="body2">{entry.salaryImpact || '-'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{entry.promotionPotential || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={entry.description}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {entry.description}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            統計サマリー
          </Typography>
          <Grid container spacing={2}>
            {finalGrades.map(grade => {
              const count = matrixCorrespondenceTable.filter(e => e.finalGrade === grade).length;
              const percentage = ((count / matrixCorrespondenceTable.length) * 100).toFixed(1);
              return (
                <Grid item xs={6} sm={4} md={3} key={grade}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                      <Chip 
                        label={grade}
                        sx={{ 
                          backgroundColor: getGradeColor(grade),
                          color: '#fff',
                          fontWeight: 'bold',
                          mb: 1
                        }}
                      />
                      <Typography variant="h6">{count}パターン</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {percentage}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};