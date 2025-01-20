import { BrowserRouter, Routes, Route } from "react-router-dom";
import Appbar from "./components/AppBar";
import Student from './components/student';
import OneStudent from "./components/OneStudent";

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Appbar/>
      <Routes>
      <Route path="/" element={<Student/>} />
      <Route path=":id" element={<OneStudent/>} />
    </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
