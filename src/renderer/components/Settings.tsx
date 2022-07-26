import { Box, Typography, TextField, Button, Container } from '@mui/material';
import { Credentials } from 'main/gitea';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [credentials, setCredentials] = useState<null | Credentials>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const credentials: Credentials = {
      user: data.get('user') as string,
      password: data.get('password') as string,
      host: data.get('host') as string,
      organization: data.get('organization') as string,
      repository: data.get('repository') as string,
    };

    if (
      credentials.user != '' &&
      credentials.password != '' &&
      credentials.host != '' &&
      credentials.organization != '' &&
      credentials.repository != ''
    ) {
      window.electron.ipcRenderer.sendMessage('set-credentials', credentials);
      navigate('/issues');
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-credentials').then((res: any) => {
      if (res) {
        setCredentials(res);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <></>;

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Credentials
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="host"
            label="Host"
            name="host"
            autoFocus
            defaultValue={credentials?.host}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="user"
            label="User"
            name="user"
            autoFocus
            defaultValue={credentials?.user}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            defaultValue={credentials?.password}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="organization"
            label="Organization"
            name="organization"
            autoFocus
            defaultValue={credentials?.organization}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="repository"
            label="Repository"
            type="repository"
            id="repository"
            defaultValue={credentials?.repository}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Fetch Issues
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Settings;
