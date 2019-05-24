import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const app = new Clarifai.App({
  apiKey:'2e5112533ec847408f37b9b454666bcb'
});

const particlesOptions = {
  particles: {
    number:{
      value: 300,
      density: {
        enable: true,
        value_area: 800 
      }
    }
  }
}
class App extends React.Component {
 constructor (props){
   super(props);
    
   this.state = {
     input: '',
     imageUrl:'',
     box:{},
     route: 'signin',
     isSignedIn: false,
     user : {
      id:'', 
      email:'',
      name:'',
      entries: 0,
      joined: ''
     }
   }
 } 

 loadUser = (data) => {
  this.setState ( {user:  {
    id:data.id, 
    email:data.email,
    name:data.name,
    entries: data.entries,
    joined: data.joined
  }});
 }

 calculateFaceLocation = (data) => {
    
    const clariFaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clariFaiFace);
    const image = document.getElementById('inputimage');

    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clariFaiFace.left_col * width,
      topRow: clariFaiFace.top_row *height,
      rightCol: width -(clariFaiFace.right_col * width),
      bottomRow: height -(clariFaiFace.bottom_row * height),
    }
 }

 displayFaceBox = (box) => {
   this.setState({ box: box});
 }

 onInputChange = (event) => {
  this.setState({input: event.target.value});
 }

onButtonSubmit = () =>{
  this.setState({imageUrl: this.state.input});
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response =>
      {
        if(response){
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
        }
         this.displayFaceBox(this.calculateFaceLocation(response))
        })
    .catch(err => console.log(err));
}

onRouteChange = (route)=> {
  if(route ==='signout'){
    this.setState({isSignedIn: false});
  } else if (route === 'home'){
    this.setState({isSignedIn: true});
  }
  this.setState({route:route});
}

  render(){
  const  {isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
   
    <Particles className="particles" params= {particlesOptions}/>
      <Navigation isSignedIn= {isSignedIn} onRouteChange= {this.onRouteChange}/>
      { route === 'home' ? 
      <div>
        <Logo />
        <Rank />
        <ImageLinkForm onButtonSubmit={this.onButtonSubmit} onInputChange={this.onInputChange} />
        <FaceRecognition box= {box} imageUrl={imageUrl} />
      </div> 
    : (
      route === 'signin' 
      ? <SignIn onRouteChange={this.onRouteChange}/> 
      : <Register loadUser= {this.loadUser} onRouteChange={this.onRouteChange} />
      )
    }
    </div>
  );
}
}

export default App;
