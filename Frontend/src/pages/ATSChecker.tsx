import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Download,
  Eye,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ATSResult {
  overallScore: number;
  sections: {
    keywords: { score: number; feedback: string[] };
    formatting: { score: number; feedback: string[] };
    experience: { score: number; feedback: string[] };
    skills: { score: number; feedback: string[] };
  };
  suggestions: string[];
}

const mockATSResult: ATSResult = {
  overallScore: 87,
  sections: {
    keywords: {
      score: 92,
      feedback: [
        "Strong use of technical keywords",
        "Good alignment with job requirements",
        "Consider adding more industry-specific terms",
      ],
    },
    formatting: {
      score: 85,
      feedback: [
        "Clean and professional layout",
        "Good use of bullet points",
        "Headers are well structured",
      ],
    },
    experience: {
      score: 90,
      feedback: [
        "Clear progression in roles",
        "Quantified achievements well",
        "Good variety of experiences",
      ],
    },
    skills: {
      score: 82,
      feedback: [
        "Comprehensive skill list",
        "Mix of technical and soft skills",
        "Consider organizing by categories",
      ],
    },
  },
  suggestions: [
    "Add more quantifiable achievements",
    "Include relevant certifications",
    "Optimize for mobile ATS scanning",
    "Use more action verbs in descriptions",
    "Add a professional summary section",
  ],
};

export const ATSChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ATSResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (
        uploadedFile.type === "application/pdf" ||
        uploadedFile.type.includes("word")
      ) {
        setFile(uploadedFile);
        toast({
          title: "File Uploaded",
          description: `${uploadedFile.name} is ready for analysis.`,
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        });
      }
    }
  };

  const analyzeResume = () => {
    if (!file) return;

    setIsAnalyzing(true);

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setResults(mockATSResult);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully!",
      });
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-success" />;
    if (score >= 70) return <AlertTriangle className="h-4 w-4 text-warning" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ATS Resume Checker</h1>
              <p className="text-sm text-muted-foreground">
                Optimize your resume for Applicant Tracking Systems
              </p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {!results ? (
          <div className="max-w-2xl mx-auto">
            {/* Upload Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-secondary">
                <CardHeader>
                  <CardTitle>Upload Your Resume</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      {file ? file.name : "Drop your resume here or click to browse"}
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Supports PDF and Word documents
                    </p>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Button triggers input click */}
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>

                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={analyzeResume}
                        disabled={isAnalyzing}
                        className="bg-gradient-primary text-primary-foreground"
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                      </Button>
                    </motion.div>
                  )}

                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm">Analyzing your resume...</span>
                      </div>
                      <Progress value={33} className="animate-pulse" />
                      <p className="text-xs text-muted-foreground">
                        This may take a few moments while we analyze your content, formatting, and ATS compatibility.
                      </p>
                    </motion.div>
                  )}

                  <Alert>
                    <Eye className="h-4 w-4" />
                    <AlertDescription>
                      Your resume is processed securely and never stored on our servers.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overall Score */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-secondary">
                <CardContent className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-primary text-primary-foreground text-4xl font-bold mb-4"
                  >
                    {results.overallScore}%
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">
                    ATS Compatibility Score
                  </h2>
                  <p className="text-muted-foreground">
                    Your resume is well-optimized for most Applicant Tracking Systems
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(results.sections).map(([section, data], index) => (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="capitalize">{section}</span>
                        <div className="flex items-center space-x-2">
                          {getScoreIcon(data.score)}
                          <span className={`font-bold ${getScoreColor(data.score)}`}>
                            {data.score}%
                          </span>
                        </div>
                      </CardTitle>
                      <Progress value={data.score} className="h-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {data.feedback.map((item, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-muted-foreground flex items-start space-x-2"
                          >
                            <span className="text-primary">•</span>
                            <span>{item}</span>
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-muted rounded-lg"
                      >
                        <Badge variant="secondary" className="mt-0.5 shrink-0">
                          {index + 1}
                        </Badge>
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center space-x-4"
            >
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setResults(null);
                }}
              >
                Analyze Another Resume
              </Button>
              <Button className="bg-gradient-primary text-primary-foreground">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;
