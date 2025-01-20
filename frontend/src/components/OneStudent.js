import * as React from 'react'
import { Container, Paper, Button, Snackbar, Alert } from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useParams, useNavigate } from 'react-router-dom'
export default function OneStudent() {

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [address, setAddress] = React.useState('');

    const [student, setStudent] = React.useState({});
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('info');

    const { id } = useParams();
    const navigate = useNavigate();

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    React.useEffect(() => {

        if (!id) return;

        const fetchData = async () => {
            await fetch(`http://localhost:8080/student/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(
                (response) => {
                    if (response.status === 404) {
                        setSnackbarMessage('Aucune donnée trouvée');
                        setSnackbarSeverity('error')
                        setOpenSnackbar(true);
                        return; 
                    }
                    else if (response.status === 500) {
                        setSnackbarMessage('Erreur de connexion');
                        setSnackbarSeverity('error')
                        setOpenSnackbar(true);
                        return;
                    }
                    return response.json();
                }
            ).then((data) => {
                setStudent(data);
                console.log(student);
            }).catch((error) => {
                console.log('Error fetching data', error);
                setSnackbarMessage("Une erreur s'est produite lors de la recuperation des données")
                setSnackbarSeverity('error')
                setOpenSnackbar(true);
                return;
            })
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateStudent = {firstName, lastName, email, phoneNumber, address};
        
        if(updateStudent.firstName === '' || updateStudent.lastName === '' || updateStudent.address === '' || updateStudent.email === '' || updateStudent.phoneNumber === ''){
          setSnackbarMessage('Veuillez remplir tous les champs svp.');
          setSnackbarSeverity('error')
          setOpenSnackbar(true);
          return;
        }
        await fetch(`http://localhost:8080/student/update/${id}`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateStudent),
          })
          .then((response) =>{
            if(response.status === 500){
              setSnackbarMessage(response.body);
              setSnackbarSeverity('error')
              setOpenSnackbar(true);
              return;
            }else if(response.status === 404){
              setSnackbarMessage(response.body);
              setSnackbarSeverity('warning');
              setOpenSnackbar(true);
              return;
            }
            setOpenSnackbar(false);
            return response;
          }).then((data) =>{
            setSnackbarMessage("Mise à jour effectuée avec succès");
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            navigate("/")
          })
    };

    return (
        <>
            <Container>
                <Paper elevation={4} style={{ padding: "50px 20px", width: 600, margin: "20px auto"}}>

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
                                label = {student.firstName ? student.firstName : 'Prénom'}
                                fullWidth
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                id="outlined-basic"
                                label={student.lastName ? student.lastName : 'Nom'}
                                fullWidth
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                id="outlined-basic"
                                label={student.email ? student.email : 'Email'}
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                id="outlined-basic"
                                label= {student.phoneNumber ? student.phoneNumber : 'Numéro de téléphone'}
                                fullWidth
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <TextField
                                id="outlined-basic"
                                label= {student.address ? student.address : 'Adresse'}
                                fullWidth
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <Button type='submit' variant="contained" style={{ marginTop: '20px'}}>Modifier</Button>
                        </div>
                    </Box>
                </Paper>
            </Container>
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
        </>
    )
}