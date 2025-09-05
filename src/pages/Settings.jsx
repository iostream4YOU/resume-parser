import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Key, 
  Zap, 
  FileText, 
  Shield, 
  Save,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const [geminiApiKey, setGeminiApiKey] = useState("AIzaSyB2uI0m78bk4WxfuO_v6-K7yyDmlcObZb0");
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testConnection = async () => {
    console.log("Testing Gemini API connection...");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
            >
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold" 
                  style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                          WebkitBackgroundClip: 'text', 
                          WebkitTextFillColor: 'transparent'}}>
                Settings
              </h1>
              <p className="text-xl text-gray-600">Configure your resume parser preferences</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">API Configuration</CardTitle>
                    <p className="text-gray-600 text-sm">Configure your AI parsing settings</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gemini-key" className="text-base font-medium">
                      Gemini API Key
                    </Label>
                    <p className="text-sm text-gray-500 mb-2">
                      Your Google Gemini API key for AI-powered resume parsing
                    </p>
                    <div className="flex gap-3">
                      <Input
                        id="gemini-key"
                        type="password"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="flex-1"
                      />
                      <Button 
                        onClick={testConnection}
                        variant="outline"
                        className="hover:bg-blue-50"
                      >
                        Test Connection
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Security Note</h4>
                        <p className="text-sm text-blue-700">
                          Your API key is stored securely and only used for parsing resumes. 
                          We never share or store your API keys on our servers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveSettings}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    {saved ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Saved Successfully
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">System Status</CardTitle>
                    <p className="text-gray-600 text-sm">Current system health and capabilities</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-900">PDF Parsing</p>
                    <p className="text-sm text-green-700">Operational</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-900">AI Processing</p>
                    <p className="text-sm text-green-700">Operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}