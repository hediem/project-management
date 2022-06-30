import React, { useContext, useState } from "react";
import MessangerContext from "../../context/MessangerContext";
import AuthenticationContext from "../../context/Authentication.tsx";

import editIcon from "../../assets/images/icons8-edit-64.png";
const ChatInfo = () => {
  const { chat } = useContext(MessangerContext);
  const { userInfo } = useContext(AuthenticationContext);
  let admin;
  const [edit, setEdit] = useState(false);
  chat.members.map((value) => {
    if (value.type == 2) {
      if (value.id == userInfo.id) {
        return (admin = true);
      } else {
        return (admin = false);
      }
    }
  });
  console.log(admin);
  console.log(chat);
  return (
    <div
      className="modal fade chatinfo"
      id="infoModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {/* <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Modal title
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div> */}
          <div className="modal-body">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div
                  className="profile_pic"
                  data-bs-toggle="modal"
                  data-bs-target="#infoModal"
                >
                  <img src={chat.logo} alt="profilePic" />
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    marginRight: "15px",
                    fontWeight: "500",
                  }}
                >
                  {admin && edit == true ? (
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    ></input>
                  ) : (
                    <div>{chat.title}</div>
                  )}
                </div>
              </div>
              {admin ? (
                <div>
                  <img src={editIcon.src} alt="edit" width={30} height={30} />
                </div>
              ) : (
                ""
              )}
            </div>
            {chat.type == 1 ? (
              <div>
                <hr />
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    marginBottom: "10px",
                  }}
                >
                  اعضای گروه:
                </div>
                {chat.members.map((value) => {
                  return (
                    <div className="d-flex align-items-center members">
                      <div
                        className="profile_pic member"
                        data-bs-toggle="modal"
                        data-bs-target="#infoModal"
                      >
                        <img src={value.profile} alt="profilePic" />
                      </div>
                      <div
                        style={{
                          fontSize: "20px",
                          marginRight: "15px",
                          fontWeight: "500",
                        }}
                      >
                        {value.username}
                      </div>
                      <span style={{ color: "#363062" }}>
                        {value.type == 2
                          ? " (owner) "
                          : value.type == 1
                          ? " (admin) "
                          : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
          {/* <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
