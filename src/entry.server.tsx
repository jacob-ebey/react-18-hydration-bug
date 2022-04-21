import * as React from "react";
import { renderToPipeableStream } from "react-dom/server";
import type { Response } from "express";

import Root from "./root";

const ABORT_DELAY = 5000;

export default function renderDocumentRequest(res: Response) {
  let status = 200;

  const { abort, pipe } = renderToPipeableStream(<Root />, {
    onShellReady() {
      res.statusCode = status;
      res.set("Content-Type", "text/html");
      pipe(res);
    },
    onShellError(error) {
      res.statusCode = 500;
      res.end("Internal Server Error");
      console.error(error);
    },
    onError(error) {
      status = 500;
      console.error(error);
    },
  });

  setTimeout(abort, ABORT_DELAY);
}
