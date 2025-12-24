import { Avatar, Menu, MenuItem, Typography, Paper } from "@mui/joy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { logOutFunc, profilePicUpload } from "../../../API/ApiFunctions";
// import UserForm from "./uploadFileModal";

// import { showErrorToast } from "../../ui/toast";

const MenuProfileModal = ({
  open,
  anchor,
  handleClose,
  data,
  showVerifyModal,
}) => {
  const [openFileModal, setOpenFileModal] = useState(false);
  const navigate = useNavigate();

//   const logOut = async () => {
//     const response = await logOutFunc();
//     if (response) {
//       localStorage.removeItem("TokenId");
//       localStorage.removeItem("User");
//       navigate("/");
//       window.location.reload();
//     }else{
//         showErrorToast("Could not Logout")
//     }
//   };

  const user = JSON.parse(localStorage.getItem("User"));

  return (
    <>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: "w-64 p-4",
          elevation: 4,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Paper className="p-2">
          <div className="flex items-start space-x-3">
            <div onClick={() => setOpenFileModal(!openFileModal)}>
              {data?.profile ? (
                <img
                  src={data?.profile}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer">
                  {data?.name ? data.name.charAt(0).toUpperCase() : ""}
                </div>
              )}
            </div>
            <div>
              <Typography className="font-medium text-gray-900">
                {data?.name}
              </Typography>
              <Typography className="text-sm text-gray-500">
                {user?.phone}
              </Typography>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-2">
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/employerHome/profile");
              }}
            >
              <span className="text-sm text-gray-700">View profile</span>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/employerHome/company");
              }}
            >
              <span className="text-sm text-gray-700">Company Detail</span>
            </MenuItem>

            {!data?.is_verified && (
              <MenuItem
                onClick={() => {
                  handleClose();
                  showVerifyModal();
                }}
              >
                <span className="text-sm text-gray-700">Verify</span>
              </MenuItem>
            )}
            <MenuItem >
              <span className="text-sm text-red-600">Sign out</span>
            </MenuItem>
          </div>
        </Paper>
      </Menu>

      {/* {openFileModal && (
        <UserForm
          open={openFileModal}
          label="Profile Upload"
          onClose={() => setOpenFileModal(false)}
          metaData={{ onSubmitFunc: profilePicUpload }}
        />
      )} */}
    </>
  );
};

export default MenuProfileModal;
