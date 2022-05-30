import React, { useContext, useEffect, useState } from "react";
import SideBar from "../../Front-End/components/SideBar";
import ShowPage from "../../Front-End/components/ShowPage";
import { apiHandler } from "../../Front-End/utilities/apihandler";
import MessangerContext from "../../Front-End/context/MessangerContext";
const Panel = () => {
  const { updater } = useContext(MessangerContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    apiHandler("chats/get-chats", { userId: 1 }).then((res) =>
      setChats(res.data.result.answer)
    );
  }, [updater]);
  console.log(chats);
  return (
    <div className="row main">
      <SideBar chats={chats} />
      <ShowPage />
    </div>
  );
};

export default Panel;
