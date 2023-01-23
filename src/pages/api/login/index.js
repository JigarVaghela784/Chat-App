import middleware from "../../../lib/utils/middleware";

export default middleware(async (req, res) => {
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
