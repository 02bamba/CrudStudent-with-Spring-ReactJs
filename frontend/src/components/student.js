import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Button, Snackbar, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom'

export default function Student() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [address, setAddress] = React.useState('');
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

    const handleSubmit = async (e) =>{
      e.preventDefault();

      const Student = {firstName, lastName, email, phoneNumber, address};
      console.log(Student);
      
      
      if(Student.firstName === '' || Student.lastName || Student.email === '' || Student.phoneNumber === '' || Student.address === ''){
        setSnackbarMessage('Veuillez remplir tous les champs svp.');
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
        setSnackbarMessage('Nouveau étudiant ajouté avec succès !');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setFirstName('');
        setLastName('');
        setAddress('');
        setEmail('');
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
              label="Prénom"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Nom"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Numéro de téléphone"
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Adresse"
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
        </Paper>
      ) : (
        <p>Aucun étudiant enregistré !</p>
      )}
    </Container>
  );
}
