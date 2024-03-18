"use client";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-textarea/styles.css";

const port = 4201;
const host = "localhost";
console.log(`Listening at http://${host}:${port}`);

export default function RootLayout({ children }) {
  return (
    <CopilotKit url="htttp://localhost:4201">
      {children}
    </CopilotKit>
  );
}