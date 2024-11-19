import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Signup = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      dispatch(setAuthUser(res.data.user));
      navigate("/")
      }
    } catch (error) {
      //   console.log(error); // Check the full error object
      if (error.response) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center w-screen h-screen justify-center">
        <form
          onSubmit={signupHandler}
          className="shadow-lg flex flex-col gap-3 p-8"
        >
          <div className="my-2">
            <h1 className="text-center font-bold text-xl">Logo</h1>
            <p>Login to see photos & reels from your friends</p>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              autoComplete="email"
              className="focus-visible:ring-transparent my-2 rounded"
            ></Input>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              autoComplete="current-password"
              className="focus-visible:ring-transparent my-2 rounded"
            ></Input>
          </div>
          {loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2> Please
              wait
            </Button>
          ) : (
            <Button className="rounded" type="submit">
              Login
            </Button>
          )}

          <span className="text-center">
            Doesn't have an account?{" "}
            <Link to={"/signup"} className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default Signup;
