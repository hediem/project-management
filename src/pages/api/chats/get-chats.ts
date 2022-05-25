import type { NextApiRequest, NextApiResponse } from "next";
import { pathMaker } from "../../../Back-End/library/Controler";
import Chats from "../../../Back-End/models/Chats";
import Chat_user_links from "../../../Back-End/models/Chat_user_links";
import Images from "../../../Back-End/models/Images";
import Messages from "../../../Back-End/models/Messages";
import Users from "../../../Back-End/models/Users";

type Data = {
  status: boolean;
  errors?: string[];
  result?: any;
};

type User = {
  username: string;
  profile: string;
  type: number;
};

type Message = {
  type: number;
  text: string;
  tm: number;
  sender: User;
  todo_status: boolean;
  parent_id: number;
};

type Answer = {
  title: string;
  type: number;
  logo: string;
  numberOfUnread: number;
  members: User[];
  messages: Message[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    let { userId } = req.body;
    if (!userId) throw new Error("missing argument");

    let cul = new Chat_user_links(),
      c = new Chats(),
      u = new Users(),
      m = new Messages(),
      img = new Images();

    let res, answer: Answer[];

    rrr = await cul.find(`user_id/=/${userId}`);
    for (let i = 0; i < rrr.lengh; i++) {
      let ans: Answer = {
        title: "",
        type: 0,
        logo: "",
        members: [],
        messages: [],
        numberOfUnread: 0,
      };
      let r = c.find(`id/=/${rrr[i].chat_id}`);
      if (r.lengh > 0) {
        ans = { ...ans, title: r[0].title, type: r[0].type };

        let r1 = img.find(`id/=/${r[0].profile_id}`);
        ans.logo = r1.length > 0 ? pathMaker(r1[0].path) : "";

        r = cul.find(
          `chat_id/=/${rrr[i].id}`,
          [],
          [{ type: "LEFT", fieldName: "user_id" }]
        );
        let a: User[] | Message[] = [];
        for (let j = 0; j < rrr.lengh; j++) {
          let rr = img.find(`id/=/${r[j].profile_img_id}`);
          a.push({
            username: r[j].username,
            profile: rr.length > 0 ? pathMaker(rr[0].path) : "",
            type: r[i].user_type,
          });
        }
        ans.members = [...a];

        r = m.find(`id/=/${rrr[i].last_message_saw}`);
        let messageCount = 0,
          lastMessageTm = "";
        if (r.length > 0) lastMessageTm = r[0].mtm;

        r = m.find(`chat_id/=/${rrr[i].chat_id}`);

        for (let j = 0; j < r.length; j++) {
          let rr1 = u.find(`id/=/${r[j].sender_id}`);
          if (rr1.length == 0) continue;
          let rr = img.find(`id/=/${rr1[0].profile_img_id}`);
          a.push({
            parent_id: r[j].reply_id,
            type: r[j].type,
            text: r[j].text,
            tm: r[j].mtm,
            sender: {
              username: rr1[0].username,
              profile: rr.length > 0 ? pathMaker(rr[0].path) : "",
              type: r[i].user_type,
            },
            todo_status: r[j].todo_status,
          });

          if (
            lastMessageTm != "" &&
            parseInt(lastMessageTm) < parseInt(r[j].mtm)
          )
            messageCount++;
        }

        ans.messages = [...a];
        ans.numberOfUnread = messageCount;

        answer.push(ans);
      }
    }

    result = {
      status: true,
      result: {
        answer,
        data: req.body,
      },
    };
  } catch (err) {
    result = { status: false, errors: [err.message] };
  }
  res.status(200).json(result);
}