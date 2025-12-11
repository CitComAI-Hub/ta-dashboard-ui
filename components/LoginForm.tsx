import { useState } from "react";
import { login } from "../services/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await login(username, password);
    setLoading(false);
    if (res.token) {
      onLogin();
    } else {
      setError(res.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <Shield className="h-10 w-10 text-blue-600 mb-2" />
          <CardTitle className="text-2xl font-bold text-center">Trust Anchor Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="text-red-600 text-center text-sm font-medium">{error}</div>}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                required
                placeholder="Enter your username"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 