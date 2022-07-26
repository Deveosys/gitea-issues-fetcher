import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from '@mui/material';
import { Issue } from 'main/gitea';
import { FC, useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';

interface IssuesParams {}

interface IssuesProps {}

const Issues: FC<IssuesProps> = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [issuesParams, setIssuesParams] = useState<IssuesParams>({});

  const getIssues = (issuesParams: IssuesParams) => {
    window.electron.ipcRenderer.sendMessage('get-issues', [issuesParams]);
  };

  const onGetIssues = (issues: Issue[]) => {
    console.log(issues);
    setIssues(issues);
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('get-issues', (arg: any) =>
      onGetIssues(arg)
    );
    getIssues(issuesParams);
  }, []);

  return (
    <Container>
      <Box sx={{ p: 4 }}>
        <Stack direction={'row'} justifyContent="space-between">
          <Typography variant="h4">
            <IconButton
              color="primary"
              aria-label="Back to settings"
              onClick={() => navigate('/')}
            >
              <ArrowBackIosIcon />
            </IconButton>{' '}
            Issues
          </Typography>
          <Button
            size="small"
            // variant="outlined"
            onClick={() =>
              window.electron.ipcRenderer.sendMessage('save-issues')
            }
          >
            Save
          </Button>
        </Stack>

        {issues.length > 0 && (
          <Typography
            sx={{ mt: 4, mb: 2, textAlign: 'right', fontWeight: 'bold' }}
            color="secondary"
          >
            Total : {issues.length}
          </Typography>
        )}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="issues table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong> Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Labels</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>State</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell>
                    {row.labels.map((label, index) => (
                      <span key={row.id + label.name}>
                        {index > 0 && ' - '}
                        {label.name}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell align="right">{row.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Issues;
