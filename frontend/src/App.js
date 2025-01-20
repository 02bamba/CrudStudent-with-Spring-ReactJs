import { BrowserRouter, Routes, Route } from "react-router-dom";
import Appbar from "./components/AppBar";
import Student from './components/student';
import OneStudent from "./components/OneStudent";
import Create from "./components/Create";

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Appbar/>
      <Routes>
      <Route path="/students" element={<Student/>} />
      <Route path="/create" element={<Create/>} />
      <Route path=":id" element={<OneStudent/>} />
    </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
