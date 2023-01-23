import type { NextApiRequest, NextApiResponse } from "next";

import middleware from "src/lib/utils/middleware";

export default middleware(async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  let result;
  switch (method) {
    case "POST":
    default:
      result = { ...body, status: 1 };
      break;
  }

  return res.json(result);
});
