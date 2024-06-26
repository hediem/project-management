import type { NextApiRequest, NextApiResponse } from "next";

import formidable from "formidable";

import FileController from "../../Back-End/library/FileControler";
import { makePath, makeResponse } from "../../Back-End/helpers/functions";
import { ResponseData } from "../../Back-End/types/ActionRecordTypes";
import Images from "../../Back-End/models/Images";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function hander(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>
): Promise<void> {
  let result: ResponseData;
  let img = new Images();
  try {
    if (request.method !== "POST") {
      throw new Error("Wrong Method!");
    }
    let controller = new FileController();
    let answer = [],
      theFields = [],
      theFiles = [];

    await new Promise((resolve, reject) => {
      const form = formidable({ multiples: true, maxFileSize: 1000000000000 });

      form.parse(
        request,
        async (err, fields: formidable.Fields, files: any) => {
          theFields.push(fields);
          theFiles.push(files);
          if (err) reject({ err });

          if (!files.files) return;

          let filepaths;
          if (files.files.filepath) {
            filepaths = await controller.upload(files.files);
            filepaths = [filepaths];
            // answer.push(id);
          } else {
            // answer = await controller.groupUpload(files.files);
            filepaths = await controller.groupUpload(files.files);
          }
          for (let i = 0; i < filepaths.length; i++) {
            let x = await img.insert({ path: filepaths[i] });
            answer.push({
              id: x,
              path: makePath(filepaths[i]),
            });
          }
          resolve({ err, fields, files });
        }
      );
    });
    result = makeResponse(answer);
  } catch (err) {
    result = makeResponse(err.message, "error");
  }
  response.status(200).json(result);
}
