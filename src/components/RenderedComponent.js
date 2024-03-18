import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import {
  useMakeCopilotReadable,
  useMakeCopilotActionable,
} from "@copilotkit/react-core";
import axios from "axios";
import Button from "./Button";
import Wrapper from "./Wrapper";

function RenderedComponent() {
  const [renderedComponentHtml, setRenderedComponentHtml] = useState(""); // At any given time, there will be the currently rendered object, given BOTH as an HTML string, and also rendered. Create a variable to hold the HTML string of the currently rendered component.

  const [promptText, setPromptText] = useState("");
  const [openAIResponse, setOpenAIResponse] = useState("");
  const [toggleComponent, setToggleComponent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useMakeCopilotReadable("current component html: " + renderedComponentHtml);

  useMakeCopilotReadable("current prompt: " + promptText);

  useEffect(() => {
    if (openAIResponse) {
      setRenderedComponentHtml(openAIResponse);
      // setRenderedComponentHtml(
      //   ReactDOMServer.renderToStaticMarkup(openAIResponse)
      // );
    }
  }, [openAIResponse]);

  const handlePromptChange = (event) => {
    const text = event.target.value; //getting user value/variable from input
    setPromptText(text);
  };

  async function handleSubmit() {
    setIsLoading(true);

    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const endpoint = "https://api.openai.com/v1/chat/completions";
      const data = {
        messages: [
          {
            role: "system",
            content: `using React, HTML, and Tailwind CSS build a ${promptText}`,
          },
        ],
        model: "gpt-3.5-turbo",
      };
      const response = await axios.post(endpoint, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });
      // console.log(response?.data?.choices[0]?.message?.content);
      const resData = response?.data?.choices[0]?.message?.content;
      const extractJSXCode = (resData) => {
        const jsxRegex = /<(\w+)([^>]*)>(.*?)<\/\1>/gs;
        const jsxMatches = resData.match(jsxRegex);
        const extractedJSX = jsxMatches ? jsxMatches.join("") : "";
        return extractedJSX;
      };
      // Extract JSX code from responseconst
      const extractedJSX = extractJSXCode(resData);
      console.log(extractedJSX);
      // setOpenAIResponse(response?.data?.choices[0]?.message?.content);
      setOpenAIResponse(extractedJSX);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  }

  const updateRenderedComponent = () => {
    setRenderedComponentHtml(openAIResponse);
  };

  useMakeCopilotActionable({
    action: updateRenderedComponent,
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-center m-auto h-full bg-[#F3F4F6]">
      <div className="md:w-[20%] h-full bg-[#FFFFFF] fixed top-0 left-0 px-5 z-50 shadow-lg">
        <div className="border-b-2 text-center border-gray-200/100 w-[90%] m-auto">
          <h1 className="text-3xl font-bold mb-6">v0-Clone</h1>
        </div>
        <Wrapper>
          <div
            dangerouslySetInnerHTML={{ __html: renderedComponentHtml }} //render the ‘current rendered react component’ via  (dangerouslySetInnerHTML)
          ></div>
        </Wrapper>
      </div>

      <div className="bg-[#F3F4F6] text-black min-h-screen container ml-auto p-8 items-center justify-center max-w-8xl">
        <div className="flex justify-end">
          <Button
            bgColor="bg-[#0F172A]"
            textColor="text-white"
            text={toggleComponent ? "Component UI" : "Code </>"}
            borderRadius="rounded"
            handleClick={() => setToggleComponent(!toggleComponent)}
          />
        </div>
        <div className="p-8 bg-white shadow-md rounded-md">
          {toggleComponent ? (
            <div className="mt-4 h-48 bg-slate-900 text-sky-500 max-w-full overflow-y-auto">
              <p className="text-gray-500 text-sm mb-2">Generated Code</p>
              <div className="whitespace-normal max-w-full">
                <pre
                  style={{ wordWrap: "break-word" }}
                >{`{${renderedComponentHtml}}`}</pre>
              </div>
            </div>
          ) : (
            <div className="shadow-md border p-4 w-full">
              <div
                dangerouslySetInnerHTML={{ __html: renderedComponentHtml }}
              ></div>
            </div>
          )}
          {/* Create an input textbox — to let the end-user prompt what to build with React. Also, create a variable to hold the current contents of the prompt textbox.
           */}
          <input
            type="text"
            value={promptText}
            onChange={handlePromptChange}
            className="w-full px-4 py-2 rounded-md bg-gray-200 placeholder-gray-500 focus:outline-none mt-4"
            placeholder="Enter prompt..."
          />
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              id="generateBtn"
              className="w-1/2 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none mr-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? "  Generating..." : "  Generate"}
            </button>
            <button
              id="stopBtn"
              disabled
              className="w-1/2 px-4 py-2 rounded-md border border-gray-500 text-gray-500 hover:text-gray-700 hover:border-gray-700 focus:outline-none ml-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RenderedComponent;
