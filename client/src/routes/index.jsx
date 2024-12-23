import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Container, Grid2, Typography } from '@mui/material';
import { useCreateProject, useProjects } from '../services/projects/endpoint';
import useToken from '../hooks/useToken';
import { isAuthenticated } from '../util/auth';
import WelcomePage from '../components/WelcomePage';
import { useUser } from '../services/auth/endpoint';
import CreateProjectModal from '../components/CreateProjectModal';
import LoadingPage from '../components/LoadingPage';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [token] = useToken();
  const queryClient = useQueryClient();
  const { isLoading, data } = useProjects(token);
  const { data: user } = useUser(token);
  const createProject = useCreateProject(token, queryClient);

  const [open, setOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateProject = async () => {
    await createProject.mutateAsync({ title: newProjectTitle });
    setNewProjectTitle('');
    handleClose();
  };

  if (!isAuthenticated(token)) {
    return <WelcomePage />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Container sx={{ padding: 2 }}>
      <Typography variant="h3" gutterBottom>
        Welcome, {user?.username}!
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Project
      </Button>
      <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{
        marginTop: 3,
      }}>
        {data.map((project) => (
            <Grid2
              item
              key={project.id}
              xs={12}
              sm={6}
              md={4}
              component={Link}
              to="/projects/$id"
              params={{ id: project.id }}
              sx={{
                p: 2,
                border: 1,
                borderRadius: 2,
                textDecoration: 'none',
                color: 'inherit',
                width: {
                  xs: '100%',
                  sm: 360,
                  md: 360,
                  lg: 360,
                  xl: 360,
                },
                '&:hover': {
                  boxShadow: 3,
                },
              }}
            >
              <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>{project.title}</Typography>
              <Typography variant="body2">
                Created at: {new Date(project.created_at).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                Members: {project.memberships.map((m) => m.user).join(', ')}
              </Typography>
            </Grid2>
        ))}
      </Grid2>
      <CreateProjectModal
        open={open}
        onClose={handleClose}
        newProjectTitle={newProjectTitle}
        setNewProjectTitle={setNewProjectTitle}
        handleCreateProject={handleCreateProject}
        createProject={createProject}
      />
    </Container>
  );
}

export default Index;