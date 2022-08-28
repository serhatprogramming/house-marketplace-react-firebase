import { useLocation, useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      // if user doesn't exist then create it
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-up" ? "Up" : "In"} with</p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="google sign in" />
      </button>
      <Link
        to={location.pathname !== "/sign-up" ? "/sign-up" : "/sign-in"}
        className="registerLink"
      >
        Sign {location.pathname !== "/sign-up" ? "Up" : "In"} Instead
      </Link>
    </div>
  );
}

export default OAuth;
