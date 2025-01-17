import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Button, Snackbar, Alert } from '@mui/material';

export default function Student() {
    const [name, setName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [students, setStudents] = React.useState([]);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('info');

  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

    const handleSubmit = async (e) =>{
      e.preventDefault();

      const Student = {name, address}
      
      if(Student.name === '' || Student.address === ''){
        setSnackbarMessage('Veuillez remplir tous les champs obligatoires.');
        setSnackbarSeverity('error')
        setOpenSnackbar(true);
        return;
      }

      await fetch("http://localhost:8080/student/add", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Student),
      })
      .then((response) =>{
        if(response.status === 500){
          setSnackbarMessage('Erreur de connexion');
          setSnackbarSeverity('error')
          setOpenSnackbar(true);
          return;
        }else if(response.status === 404){
          setSnackbarMessage('API Not found !');
          setSnackbarSeverity('warning');
          setOpenSnackbar(true);
          return;
        }
        setOpenSnackbar(false);
        return response;
      }).then(() =>{
        setSnackbarMessage('Student added successfully !');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setName('');
        setAddress('');
      })
      .catch((error) =>{
        console.error('Error:',error);
        setSnackbarMessage('Une erreur inconnue s\'est produite.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      })

    }

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

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "50px 20px", width: 600, margin: "20px auto" }}>
        <h1>Nouveau étudiant</h1>
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1 } }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div>
            <TextField
              id="outlined-basic"
              label="Nom*"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Adresse *"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button type='submit' variant="contained" style={{marginTop: '20px'}}>Ajouter</Button>
          </div>
        </Box>
      </Paper>
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
        <Paper elevation={3} style={{ padding: "30px 20px", width: 600, margin: "20px auto", background: 'brown' }}>
          <h1> Liste Etudiants</h1>
          {students.map(student => (
            <Paper key={student.id} elevation={6} style={{ margin: '10px', padding: '15px', textAlign: 'left' }}>
              Nom: {student.firstName}  {student.lastName}<br/>
              Adresse: {student.email} <br/>
              Adresse: {student.phoneNumber} <br/>
              Adresse: {student.address} <br/>
            </Paper>
          ))}
        </Paper>
         ):(
          <p>Aucun étudiant enregistré !</p>
      )}
    </Container>
  );
}
