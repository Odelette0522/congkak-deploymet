import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "./Game";
import WelcomePage from "./WelcomePage";

const App = () => (
  <Router basename="/congkak-deployment">
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/congkak" element={<Game />} />
    </Routes>
  </Router>
);

export default App;
