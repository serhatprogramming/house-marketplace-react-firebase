import { getAuth, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Profile() {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listing");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLogout = (e) => {
    e.preventDefault();
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { name });
      }
    } catch (error) {
      toast.error("Could not update.");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure to delete the listing?")) {
      await deleteDoc(doc(db, "listing", listingId));
      const updatedListings = listings.filter(
        ({ id, data }) => id !== listingId
      );
      setListings(updatedListings);
      toast.success("Listing deleted succesfully.");
    }
  };

  const onEdit = async (listingId) => navigate(`/edit-listing/${listingId}`);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change display name"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              id="name"
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="email"
              className="profileEmail"
              id="email"
              disabled={true}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRightIcon} alt="right arrow" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listing</p>
            <ul className=" listingsList ">
              {listings.map(({ id, data }) => (
                <ListingItem
                  key={id}
                  listing={data}
                  id={id}
                  onDelete={() => onDelete(id)}
                  onEdit={() => onEdit(id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
