import { createTwoFilesPatch } from "diff";
import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";

const oldText = "This is the old text.";
const newText = "This is the new text!";

const diff = createTwoFilesPatch("Old", "New", oldText, newText);

const PassageDiffViewer = () => (
  <div
    dangerouslySetInnerHTML={{
      __html: Diff2Html.html(diff, { matching: "lines" , outputFormat: "side-by-side" }),
    }}
  />
);

export default PassageDiffViewer;
