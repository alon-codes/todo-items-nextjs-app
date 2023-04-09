import { proxy } from "../../server/proxy";

// @ts-ignore
export default (req, res) => {
    return new Promise((resolve, reject) => {
      // removes the api prefix from url
      console.log({ u: req.url });
      req.url = req.url.replace(/^\/api/, "") + "/";
      console.log({ u: req.url });
      proxy.once("error", reject);


      proxy.web(req, res, {
        selfHandleResponse: false
      });
    });
}

export const config = {
  api: {
    bodyParser: false,
  },
};