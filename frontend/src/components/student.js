import * as React from 'react';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
import { Container, Paper, Button, Snackbar, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom'

export default function Student() {
    const [students, setStudents] = React.useState([]);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('info');
    const navigate = useNavigate();

  const listStyle = { margin: '10px', padding: '15px', textAlign: 'left', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', background: 'lightgray' }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };


  React.useEffect(() => {
    const fetchData = async () => {
      await fetch("http://localhost:8080/student/all", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
        (response) => {
          if (response.status === 500) {
            setSnackbarMessage('Erreur de connexion');
            setSnackbarSeverity('error')
            setOpenSnackbar(true);
            return;
          }
          return response.json();
        }
      ).then((data) => {
        setStudents(data);
      }).catch((error) => {
        console.log('Error fetching data', error);
        setSnackbarMessage("Une erreur s'est produite lors de la recuperation des données")
        setSnackbarSeverity('error')
        setOpenSnackbar(true);
        return;
      })
    }
    fetchData();
  }, [students])

  const handleDelete = (id) => {

    fetch(`http://localhost:8080/student/delete/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 500) {
          setSnackbarMessage("Une erreur s'est produite lors de la suppression !");
          setSnackbarSeverity('error')
          setOpenSnackbar(true);
          return;
        }
      }).then(() =>{
        setSnackbarMessage('Suppression réussie !');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.log('Error :', error);
        setSnackbarMessage("Une erreur inatendue s'est produite")
        setSnackbarSeverity('error')
        setOpenSnackbar(true);
        return;
      })

  }

  return (
    <Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}
          sx={{ bgcolor: 'white', color: 'black' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {students.length > 0 ? (
        <Paper elevation={3} style={{ padding: "30px 20px", width: 600, margin: "20px auto", background: 'gray' }}>
          <h1> Liste Etudiants</h1>
          {students.map(student => (
            <Paper key={student.id} elevation={6} style={listStyle}>
              
              Nom: {student.firstName}  {student.lastName}<br />
              Adresse: {student.email} <br />
              Adresse: {student.phoneNumber} <br />
              Adresse: {student.address} <br />
              <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1, sm: 2, md: 4 }}
                >
                  <Button variant="contained" onClick={() => navigate(`/${student.id}`)}>Modifier</Button>
                  <Button variant="contained" onClick = {() => handleDelete(student.id)} style={{backgroundColor: 'red'}}>Supprimer</Button>
                </Stack>
            </Paper>
          ))}
          <Button variant="contained" sx={{bgcolor: 'green', left: '30%'}} onClick={() => navigate("/create")}>Ajouter un etudiant</Button>
        </Paper>
      ) : (
        <p>Aucun étudiant enregistré !</p>
      )}
    </Container>
  );
}
