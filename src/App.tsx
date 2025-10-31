import { useState } from "react";
import "./App.css";
import { compactDecrypt } from "jose";
import { uint8ArrayToBase64Url } from "@sd-jwt/utils";

async function decryptJWE(jwe: string, privateKey: JsonWebKey) {
  try {
    const { plaintext, protectedHeader } = await compactDecrypt(
      jwe,
      privateKey
    );

    // plaintext는 Uint8Array로 반환됨
    const decodedText = uint8ArrayToBase64Url(plaintext);

    console.log("복호화된 메시지:", decodedText);
    console.log("보호된 헤더:", protectedHeader);

    return decodedText;
  } catch (error) {
    console.error("복호화 실패:", error);
    throw error;
  }
}

export const encKey = {
  kty: "EC",
  d: "H5jo9QcyLQ69NEMib6JRpVmMzchFmR4vIkborjxA1dA",
  use: "enc",
  crv: "P-256",
  kid: "key-1",
  x: "ICobFkIt6Q3zDRTh9V_9Foy-lZ96dv_Fx8mTxT_fmKc",
  y: "7N3F9JRjXZkZZIWMeRjM-6uXbvQX94cnHL-sBJssqxM",
  alg: "ECDH-ES",
};

async function request() {
  if (typeof (window as any).DigitalCredential === "undefined") {
    alert("DigitalCredential is not defined");
    return;
  }
  const controller = new AbortController();
  const dcResponse = await navigator.credentials.get({
    signal: controller.signal,
    mediation: "required",
    digital: {
      requests: [
        {
          protocol: "openid4vp-v1-unsigned",
          data: {
            response_type: "vp_token",
            nonce: "596517540237152598101737",
            client_metadata: {
              jwks: {
                keys: [
                  {
                    kty: "EC",
                    use: "enc",
                    crv: "P-256",
                    kid: "key-1",
                    x: "ICobFkIt6Q3zDRTh9V_9Foy-lZ96dv_Fx8mTxT_fmKc",
                    y: "7N3F9JRjXZkZZIWMeRjM-6uXbvQX94cnHL-sBJssqxM",
                    alg: "ECDH-ES",
                  },
                ],
              },
              vp_formats: {
                mso_mdoc: {
                  alg: ["EdDSA", "ES256", "ES384"],
                },
                jwt_vc: {
                  alg: ["EdDSA", "ES256", "ES384", "ES256K"],
                },
                jwt_vc_json: {
                  alg: ["EdDSA", "ES256", "ES384", "ES256K"],
                },
                jwt_vp_json: {
                  alg: ["EdDSA", "ES256", "ES384", "ES256K"],
                },
                jwt_vp: {
                  alg: ["EdDSA", "ES256", "ES384", "ES256K"],
                },
                ldp_vc: {
                  proof_type: ["Ed25519Signature2020"],
                },
                ldp_vp: {
                  proof_type: ["Ed25519Signature2020"],
                },
                "vc+sd-jwt": {
                  "kb-jwt_alg_values": ["EdDSA", "ES256", "ES384", "ES256K"],
                  "sd-jwt_alg_values": ["EdDSA", "ES256", "ES384", "ES256K"],
                },
                "dc+sd-jwt": {
                  "kb-jwt_alg_values": ["EdDSA", "ES256", "ES384", "ES256K"],
                  "sd-jwt_alg_values": ["EdDSA", "ES256", "ES384", "ES256K"],
                },
              },
              logo_uri: "https://funke.animo.id/assets/verifiers/bunde.png",
              client_name: "Die Bundesregierung",
              response_types_supported: ["vp_token"],
            },
            dcql_query: {
              credentials: [
                {
                  id: "0",
                  format: "mso_mdoc",
                  meta: {
                    doctype_value: "org.iso.18013.5.1.mDL",
                  },
                  claims: [
                    {
                      id: "document_number",
                      path: ["org.iso.18013.5.1", "document_number"],
                      intent_to_retain: false,
                    },
                  ],
                },
              ],
              credential_sets: [
                {
                  options: [["0"]],
                  purpose:
                    "Authorize to the government using your mobile drivers license",
                },
              ],
            },
            client_id: "x509_san_dns:dcapi-test.vercel.app",
            expected_origins: ["https://dcapi-test.vercel.app"],
            response_mode: "dc_api.jwt",
          },
        },
      ],
    },
  } as any);
  console.log(dcResponse);
  if (!dcResponse) return;
  return decryptJWE((dcResponse as any).data.response, encKey);
}

function App() {
  const [dcResponse, setDcResponse] = useState<any>(null);
  const dcapi = async () => {
    const result = (await request()) as any;
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
