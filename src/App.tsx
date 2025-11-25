import { useState } from "react";
import "./App.css";
import axios from "axios";

async function request() {
  if (typeof (window as any).DigitalCredential === "undefined") {
    alert("DigitalCredential is not defined");
    return;
  }

  const { data: requestData } = await axios.post(
    "https://iata-poc.dev.hopae.app/openid4vp/sessions",
    {
      expected_origins: ["https://dcapi-test.vercel.app"],
    }
  );

  const { request, sessionId } = requestData;

  const controller = new AbortController();
  const dcResponse = await navigator.credentials.get({
    signal: controller.signal,
    mediation: "required",
    digital: {
      requests: [request],
    },
  } as any);
  console.log(dcResponse);
  if (!dcResponse) return;

  const {
    data: { response },
  } = dcResponse as any;

  const verified = await axios.post(
    `https://iata-poc.dev.hopae.app/openid4vp/verification/${sessionId}`,
    {
      response,
    }
  );

  return verified.data;
}

function App() {
  const [dcResponse, setDcResponse] = useState<any>(null);
  const dcapi = async () => {
    const result = (await request()) as any;
    console.log(result);
    if (result) setDcResponse(result);
  };
  return (
    <>
      <h1>Digital Credential API</h1>
      <div className="card">
        <button onClick={dcapi}>Request</button>
      </div>
      {dcResponse && (
        <pre
          style={{
            width: "300px",
            wordBreak: "break-all",
            whiteSpace: "normal",
          }}
        >
          {JSON.stringify(dcResponse, null, 2)}
        </pre>
      )}
    </>
  );
}

export default App;
