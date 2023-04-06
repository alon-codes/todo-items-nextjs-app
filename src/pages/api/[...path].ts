import { proxy } from "../../server/proxy";

export default (req, res) => {
    return new Promise((resolve, reject) => {
      // removes the api prefix from url
      req.url = req.url.replace(/^\/api/, "");
      proxy.web(req, res);
    }
}