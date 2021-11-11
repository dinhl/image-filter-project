import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // image_url: URL of a publicly accessible image
  // image_url=https://images.pexels.com/photos/298842/pexels-photo-298842.jpeg
  app.get("/filteredimage", async (req, res) => {
    try {
      let { image_url } = req.query;

      //    1. validate the image_url query
      if (!image_url) {
        return res.status(422).send({ message: "Image url is required!" });
      }

      // 2. call filterImageFromURL(image_url) to filter the image
      const filteredpath = await filterImageFromURL(image_url);

      //    3. send the resulting file in the response
      //    4. deletes any files on the server on finish of the response
      res.status(200).sendFile(filteredpath, () => {
        deleteLocalFiles([filteredpath]);
      });
    } catch (error) {
      res.send(error);
    }
  });
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();