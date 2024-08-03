import React from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Chat from "./components/Chat";
import { Box, Dialog, DialogContent, DialogTitle, Modal, Typography } from "@mui/material";
import "./App.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [login, setLogin] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const username = sessionStorage.getItem("username");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const handleSubmit = async ({e}) => {
    // alert(password);
    e.preventDefault();
        try {
            const response = await axios.post('https://live-chat-be.onrender.com/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            if(response.data.token){
                navigate('/chat');
            }
            // Redirect or show success message
        } catch (err) {
            setError('Login failed');
        }
  }
  return (
    <div>
      <div className="App">
        <h1>Welcome to Live Chat!</h1>
        {/* <h2><a style={{cursor:"pointer", color:"GrayText"}} onClick={()=>{alert("register")}}>Register</a> or <a style={{cursor:"pointer",color:"GrayText"}} onClick={()=>{alert("login")}}>Login</a> to start chatting!</h2> */}
        <div className="log-reg">
          {/* <button
            style={{ backgroundColor: login ? "#cce6ff" : "#f2f2f2" }}
            onClick={() => {
              setLogin(true);
            }}
          >
            Login
          </button> */}
          {/* <button
            style={{ backgroundColor: !login ? "#cce6ff" : "#f2f2f2" }}
            onClick={() => {
              setLogin(false);
            }}
          >
            Register
          </button> */}
        </div>
        {login ? <Login /> : <Register open={open} setOpen={setOpen} />}
      </div>
      {/* <h1>Live Chat Application</h1>
            <Register />
            <br/>
            <Login /> */}
      {/* <Chat /> */}
      {/* <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        k
      </button> */}
      <Dialog open={open} onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{maxWidth:"100%"}}
      >

      <DialogTitle id="modal-modal-title">Enter your Password to Login!</DialogTitle>
      <DialogContent>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="password" style={{width:"200px", padding:"10px",borderRadius:"5px", border :"1px solid #ccc"}} onChange={(e)=>setPassword(e.target.value)}/>
        <button type="submit" style={{padding:"10px",borderRadius:"5px",border :"1px solid #ccc"}}>Login</button>
      </form>

      </DialogContent>
        {/* <Box sx={style}>
        padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
        width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter your Password to Login!
          </Typography>
          <input type="password" placeholder="password" />
        </Box> */}
      </Dialog>
    </div>
  );
};

export default Home;
