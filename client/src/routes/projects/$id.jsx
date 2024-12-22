import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  useProject,
  useProjectTodos,
  useCreateProjectMembership,
  useEditProject,
  useDeleteProject,
} from "@/services/projects/endpoint";
import { useEditTodo } from "@/services/todos/endpoint";
import {
  useEditMembership,
  useDeleteMembership,
} from "@/services/memberships/endpoint";
import { Container, Box, Typography, List, Fab, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import useToken from "@/hooks/useToken";
import { useQueryClient } from "@tanstack/react-query";
import TodoItem from "@/components/TodoItem";
import TodoFormModal from "@/components/TodoFormModal";
import DeleteTodoModal from "@/components/DeleteTodoModal";
import EditProjectModal from "@/components/EditProjectModal";
import DeleteProjectModal from "@/components/DeleteProjectModal";
import MembershipModal from "@/components/MembershipModal";
import { useUser } from "@/services/auth/endpoint";
import useModalState from "@/hooks/useModalState";
import useTodoForm from "@/hooks/useTodoForm";
import useDeleteTodoForm from "@/hooks/useDeleteTodoForm";
import { isUserAdmin } from "@/util/membership";

export const Route = createFileRoute("/projects/$id")({
  component: Project,
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});

function Project() {
  const { id } = Route.useParams();
  const navigate = Route.useNavigate();
  const [token] = useToken();
  const { data: user } = useUser(token);
  const queryClient = useQueryClient();

  const { data: project, isLoading: projectLoading } = useProject(id, token);
  const { data: todos, isLoading: todosLoading } = useProjectTodos(id, token);

  const isAdmin = isUserAdmin(project?.memberships ?? [], user);

  const editTodoMutation = useEditTodo(id, token, queryClient);
  const editProjectMutation = useEditProject(id, token, queryClient);
  const deleteProjectMutation = useDeleteProject(id, token, queryClient);
  const createMembershipMutation = useCreateProjectMembership(
    id,
    token,
    queryClient
  );
  const editMembershipMutation = useEditMembership(id, token, queryClient);
  const deleteMembershipMutation = useDeleteMembership(id, token, queryClient);

  const [editProjectOpen, openEditProject, closeEditProject] = useModalState();
  const [deleteProjectOpen, openDeleteProject, closeDeleteProject] =
    useModalState();
  const [membershipOpen, openMembership, closeMembership] = useModalState();

  const {
    isOpen: todoFormOpen,
    open: openTodoForm,
    close: closeTodoForm,
    isEditing,
    newTodo,
    setNewTodo,
    error,
    submit: submitTodoForm,
    handleEditTodo,
  } = useTodoForm(id, token);

  const {
    isOpen: deleteTodoOpen,
    setTodoToDelete,
    open: openDeleteTodo,
    close: closeDeleteTodo,
    submit: submitDeleteTodo,
  } = useDeleteTodoForm(id, token);

  const handleDeleteProject = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project.id);
      navigate({ to: "/" });
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (projectLoading || todosLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {project.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Created at: {new Date(project.created_at).toLocaleString()}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {isAdmin && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={openEditProject}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={openDeleteProject}
              >
                Delete
              </Button>
            </>
          )}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PeopleIcon />}
            onClick={openMembership}
          >
            View Memberships
          </Button>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Todos
          </Typography>
          <List>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                handleEditTodo={handleEditTodo}
                handleDeleteTodo={(todo) => {
                  setTodoToDelete(todo);
                  openDeleteTodo();
                }}
                editTodoMutationFn={editTodoMutation.mutateAsync}
              />
            ))}
          </List>
          <Fab
            color="primary"
            aria-label="add"
            onClick={openTodoForm}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
          </Fab>
          <TodoFormModal
            open={todoFormOpen}
            handleClose={closeTodoForm}
            handleSubmitTodo={submitTodoForm}
            todo={newTodo}
            setTodo={setNewTodo}
            error={error}
            isEditing={isEditing}
          />
          <DeleteTodoModal
            open={deleteTodoOpen}
            handleClose={closeDeleteTodo}
            handleDeleteTodo={submitDeleteTodo}
          />
          <EditProjectModal
            open={editProjectOpen}
            onClose={closeEditProject}
            project={project}
            handleEditProject={editProjectMutation.mutateAsync}
          />
          <DeleteProjectModal
            open={deleteProjectOpen}
            onClose={closeDeleteProject}
            onDelete={handleDeleteProject}
          />
          <MembershipModal
            open={membershipOpen}
            onClose={closeMembership}
            members={project.memberships ?? []}
            user={user}
            handleAddMember={createMembershipMutation.mutateAsync}
            handleEditRole={editMembershipMutation.mutateAsync}
            handleDeleteMember={deleteMembershipMutation.mutateAsync}
          />
        </Box>
      </Box>
    </Container>
  );
}

export default Project;
