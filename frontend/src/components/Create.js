import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'

export default function Create(){

        const [firstName, setFirstName] = React.useState('');
        const [lastName, setLastName] = React.useState('');
        const [email, setEmail] = React.useState('');
        const [phoneNumber, setPhoneNumber] = React.useState('');
        const [address, setAddress] = React.useState('');
        const [openSnackbar, setOpenSnackbar] = React.useState(false);
        const [snackbarMessage, setSnackbarMessage] = React.useState('');
        const [snackbarSeverity, setSnackbarSeverity] = React.useState('info');

        const navigate = useNavigate();

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
                navigate("/students")
              })
              .catch((error) =>{
                console.error('Error:',error);
                setSnackbarMessage('Une erreur inconnue s\'est produite.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
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
        </Container>   
    )
}