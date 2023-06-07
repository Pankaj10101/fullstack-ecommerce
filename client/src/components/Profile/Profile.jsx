import React, { useContext, useState } from "react";
import { Context } from "../../store/context";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import {
  Container,
  Typography,
  Button,
  Box,
  Modal,
  TextField,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [displayName, setDisplayName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidationError, setIsValidationError] = useState(false);

  const handleCompleteProfile = () => {
    setIsModalOpen(true);
  };

  const handleUpdateProfile = () => {
    setIsModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (displayName.trim() === "" || profilePicture.trim() === "") {
      setIsValidationError(true);
      return;
    }

    updateProfile(user, { displayName, photoURL: profilePicture })
      .then(() => {
        toast.success("Profile updated successfully");
        navigate("/");
        console.log("Profile updated successfully");
      })
      .catch((error) => {
        toast.error("Error updating profile:", error);
        console.error("Error updating profile:", error);
      });

    setIsValidationError(false);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsValidationError(false);
    setIsModalOpen(false);
  };

  const isProfileComplete =
    displayName.trim() !== "" && profilePicture.trim() !== "";

  return (
    <Container maxWidth="sm" sx={{ height: "50vh" }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        my={4}
        mx={2}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            alt="Profile Picture"
            src={user?.photoURL || ""}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Box>
            <Typography variant="body1" component="p">
              Name: {user?.displayName || "N/A"}
            </Typography>
            <Typography variant="body1" component="p">
              Email: {user?.email || "N/A"}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={handleCompleteProfile}
        >
          Update Profile
        </Button>
      </Box>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" align="center">
            {isProfileComplete ? "Update Profile" : "Complete Profile"}
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <TextField
            label="Profile Picture URL"
            variant="outlined"
            fullWidth
            margin="normal"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
          {isValidationError && (
            <Typography variant="body2" color="error">
              Please fill in all the fields.
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveProfile}
            fullWidth
          >
            {isProfileComplete ? "Save" : "Complete"}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Profile;
