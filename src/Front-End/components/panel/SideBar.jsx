import React, { useState, useContext } from "react";
import { useRouter } from "next/router";

import MessangerContext from "../../context/MessangerContext";
import AuthenticationContext from "../../context/Authentication.tsx";

import WithPortal from "../../hoc/WithPortal";
import AddChatModal from "./AddChatModal";
import SettingModal from "./SettingModal";

import plus from "../../assets/images/icons8-plus-32.png";
import moshtaghi from "../../assets/images/photo_2022-05-22_09-37-49.jpg";
import kia from "../../assets/images/photo_2022-05-22_09-38-07.jpg";
import niko from "../../assets/images/photo_2022-05-22_09-37-57.jpg";
import setting from "../../assets/images/icons8-settings-48.png";
import menu from "../../assets/images/icons8-menu-24.png";
import logoutIcon from "../../assets/images/icons8-logout-50.png";
const SideBar = () => {
  const { chat, chats, setChat } = useContext(MessangerContext);
  const { userInfo, logout } = useContext(AuthenticationContext);
  const router = useRouter();

  const onClickHandlerLogout = () => {
    router.push("/");
    logout();
  };
  // console.log(userInfo);
  return (
    <div
      className={`col-3 col-xxl-2 sidebar ${chats.length >= 9 ? "scroll" : ""}`}
    >
      <div className="accordion accordion-flush" id="accordionFlushExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingOne">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
              <img src={menu.src} alt="menu" />
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <div className="d-flex flex-column">
                <div
                  className="profile_pic"
                  data-bs-toggle="modal"
                  data-bs-target="#infoModal"
                >
                  <img src={userInfo.profile} alt="profilePic" />
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    marginTop: "5px",
                    marginRight: "5px",
                    fontWeight: "500",
                  }}
                >
                  {userInfo.username}
                </div>
                <hr />
              </div>
              <div
                data-bs-toggle="modal"
                data-bs-target="#addChatModal"
                style={{ cursor: "pointer" }}
              >
                <button className="plus" type="button">
                  <img src={plus.src} alt="add" />
                </button>
                <span
                  style={{
                    fontWeight: "500",
                    fontSize: "18px",
                    marginRight: "5px",
                  }}
                >
                  چت جدید
                </span>
              </div>
              <hr />
              <div
                data-bs-toggle="modal"
                data-bs-target="#settingModal"
                style={{ cursor: "pointer" }}
              >
                <img src={setting.src} alt="setting" />
                <span style={{ fontWeight: "500", fontSize: "18px" }}>
                  تنظیمات
                </span>
              </div>
              <hr />
              <div onClick={onClickHandlerLogout} style={{ cursor: "pointer" }}>
                <img
                  src={logoutIcon.src}
                  alt="logout"
                  style={{ width: "40px", height: "40px" }}
                />
                <span
                  style={{
                    fontWeight: "500",
                    fontSize: "18px",
                    marginRight: "15px",
                  }}
                >
                  خروج از حساب کاربری
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {chats.map((value, index) => {
        return (
          <div
            className={`card ${chat.id == value.id ? "selected" : ""}`}
            key={index}
            onClick={() => setChat(value)}
          >
            <div className="col-12 description">
              <div className="right">
                <div>
                  {value.logo == "" ? (
                    <div
                      className={`round empty ${
                        index % 2 != 0 ? "odd" : "even"
                      }`}
                    ></div>
                  ) : value.logo == "" && value.members.length == 2 ? (
                    <div className="round">
                      <img src={value.members[1].profile} alt="profilePic" />
                    </div>
                  ) : (
                    <div className="round">
                      <img src={value.logo} alt="profilePic" />
                    </div>
                  )}
                </div>
                <div>
                  {value.title == null
                    ? value.members[1].username
                    : value.title}
                  <div className="text">
                    {value.messages.slice(-1).length != 0
                      ? value.messages.slice(-1)[0].text
                      : ""}
                  </div>
                </div>
              </div>
              {value.numberOfUnread == 0 ? (
                ""
              ) : (
                <div className="number">{value.numberOfUnread}</div>
              )}
            </div>
          </div>
        );
      })}
      {/* <button
        className="plus"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#addChatModal"
      >
        <img src={plus.src} alt="add" />
      </button> */}
      <WithPortal>
        <AddChatModal />
        <SettingModal />
      </WithPortal>
    </div>
  );
};

export default SideBar;
