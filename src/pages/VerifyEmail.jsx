import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    fetch(`http://localhost:8080/api/auth/verify?token=${token}`)
      .then(async (res) => {
        const text = await res.text();
        if (res.ok) {
          setStatus("success");
          setMessage(text);
        } else {
          setStatus("error");
          setMessage(text);
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold">Verifying your email...</h1>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Email Verified!</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link to="/login" className="text-blue-600 underline font-medium">
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Verification Failed</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link to="/login" className="text-blue-600 underline font-medium">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
