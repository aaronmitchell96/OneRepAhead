import NavBar from "../NavBar";
import BioVideoCard from "../BioVideoCard";
import video_workouts from "../images/pexels-tima-miroshnichenko-5319099 (2160p).mp4"
import video_blog from "../images/pexels-koolshooters-8544782 (2160p).mp4"
import video_pt_portal from "../images/pexels-tima-miroshnichenko-6388436 (2160p).mp4"
import video_workout_plans from "../images/production_id_4761763 (2160p).mp4"
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>  
                <NavBar/>
                <Link to='/workouts'>
                    <BioVideoCard topic="Workout" src={video_workouts}/>
                </Link>
                <BioVideoCard topic="Blog" src={video_blog}/>
                <BioVideoCard topic="PT Portal" src={video_pt_portal}/>
                <BioVideoCard topic="Workout Plans" src={video_workout_plans}/>
        </div>
    )
}

export default Home;