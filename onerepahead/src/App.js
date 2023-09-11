import { useIsAuthenticated } from 'react-auth-kit';
import './stylesheets/App.css';
import Home from "./pages/Home.js"
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from './PrivateRoutes';
import Profile from './pages/Profile';
import SignupForm from './pages/SignUpForm';
import Workouts from './pages/Workouts';
import SavedWorkouts from './pages/SavedWorkouts';

function App() {

  const {userId} = useIsAuthenticated();

  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route exact path='/'element={<Home/>}></Route>
            <Route exact path='/login' element={<Login/>}></Route>
            <Route exact path='/register' element={<SignupForm/>}/>
            <Route exact path='/workouts' element={<Workouts/>}/>
            <Route path="/saved-workouts" element={<SavedWorkouts/>} />
            <Route element={<PrivateRoutes/>}>
              <Route exact path={`/profile`} element={<Profile/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
