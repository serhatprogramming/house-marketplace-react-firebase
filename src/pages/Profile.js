import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    console.log(auth.currentUser);
    setUser(auth.currentUser);
  }, []);

  return user ? <h1>{user.displayName}</h1> : "Not logged In!";
}

export default Profile;
