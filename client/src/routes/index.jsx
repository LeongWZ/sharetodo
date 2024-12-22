import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Box, Button, Container, Grid2, Typography, Modal, TextField } from '@mui/material'
import { useCreateProject, useProjects } from '@/services/projects/endpoint'
import useToken from '@/hooks/useToken';
import { isAuthenticated } from '@/util/auth'
import WelcomePage from '@/components/WelcomePage'
import { useUser } from '@/services/auth/endpoint'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [token] = useToken()

  const queryClient = useQueryClient()

  const { isLoading, data } = useProjects(token)
  const { data: user } = useUser(token);
  const createProject = useCreateProject(token, queryClient)

  const [open, setOpen] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleCreateProject = () => {
    createProject.mutate({ title: newProjectTitle })
    setNewProjectTitle('')
    handleClose()
  }

  if (!isAuthenticated(token)) {
    return <WelcomePage />
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Container sx={{ padding: 2 }}>
      <Typography variant="h3" gutterBottom>
        Welcome, {user?.username}!
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Project
      </Button>
      <Grid2 container spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
        {data.map((project) => (
          <Grid2 component={Link}
            item
            xs={12}
            sm={6}
            md={4}
            key={project.id}
            to="/projects/$id"
            params={{ id: project.id }}
          >
            <Box p={2} border={1} borderRadius={2}>
              <Typography variant="h6">{project.title}</Typography>
              <Typography variant="body2">
                Created at: {new Date(project.created_at).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Members: {project.memberships.map((m) => m.user).join(', ')}
              </Typography>
            </Box>
          </Grid2>
        ))}
      </Grid2>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Create New Project
          </Typography>
          <TextField
            fullWidth
            label="Project Title"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateProject}
            fullWidth
          >
            Create
          </Button>
        </Box>
      </Modal>
    </Container>
  )
}
