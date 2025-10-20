import "./App.css";

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
          protocol: "openid4vp",
          data: {
            response_type: "vp_token",
            nonce: "596517540237152598101737",
            client_metadata: {
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
                      id: "given_name",
                      path: ["org.iso.18013.5.1", "given_name"],
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
            client_id: "x509_san_dns:funke.animo.id",
            expected_origins: ["https://funke.animo.id"],
            response_mode: "dc_api",
          },
        },
      ],
    },
  } as any);
  console.log(dcResponse);
}

function App() {
  const dcapi = async () => {
    const result = await request();
    console.log(result);
  };
  return (
    <>
      <h1>Digital Credential API</h1>
      <div className="card">
        <button onClick={dcapi}>Request</button>
      </div>
    </>
  );
}

export default App;
