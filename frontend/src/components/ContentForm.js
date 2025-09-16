import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Loader2, Upload, Send, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { moderateText, moderateImage, moderateUrl } from '../services/api';

const StatusBadge = ({ status, confidence }) => {
  const variants = {
    approved: { variant: "default", icon: CheckCircle, className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
    review: { variant: "secondary", icon: AlertTriangle, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
    flagged: { variant: "destructive", icon: XCircle, className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" }
  };

  const config = variants[status] || variants.review;
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} gap-1.5`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)} ({Math.round(confidence * 100)}%)
    </Badge>
  );
};

const ContentForm = () => {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("text");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !file) {
      toast({
        title: "Error",
        description: "Please provide content to moderate",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let moderationResult;
      
      // Call appropriate API based on content type
      if (contentType === 'text') {
        moderationResult = await moderateText(content);
      } else if (contentType === 'image' && file) {
        moderationResult = await moderateImage(file);
      } else if (contentType === 'url') {
        moderationResult = await moderateUrl(content);
      } else {
        throw new Error('Invalid content type or missing file');
      }
      
      // Transform API response to match UI expectations
      const transformedResult = {
        id: moderationResult.result_id,
        content: file ? file.name : content,
        type: contentType,
        status: moderationResult.decision === 'safe' ? 'approved' : 
                moderationResult.decision === 'block' ? 'flagged' : 'review',
        confidence: moderationResult.confidence,
        categories: moderationResult.categories || [],
        flaggedReasons: moderationResult.explanation ? [moderationResult.explanation] : [],
        timestamp: moderationResult.processed_at,
        reviewer: 'AI System',
        severity_score: moderationResult.severity_score
      };
      
      setResult(transformedResult);
      
      toast({
        title: "Content Moderated",
        description: `Status: ${transformedResult.status} (${Math.round(transformedResult.confidence * 100)}% confidence)`,
        variant: transformedResult.status === "flagged" ? "destructive" : "default"
      });
      
    } catch (error) {
      console.error('Moderation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to moderate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setContent(`[File: ${selectedFile.name}]`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Content Moderation</h1>
        <p className="text-slate-600 dark:text-slate-400">Submit content for AI-powered moderation analysis</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Submit Content
            </CardTitle>
            <CardDescription>Enter text or upload a file for moderation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {contentType === "text" ? (
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter the content you want to moderate..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="mt-2 resize-none"
                  />
                </div>
              ) : contentType === "url" ? (
                <div>
                  <Label htmlFor="content">URL</Label>
                  <input
                    id="content"
                    type="url"
                    placeholder="Enter the URL you want to moderate..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="file">Upload File</Label>
                  <div className="mt-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <input
                      type="file"
                      id="file"
                      onChange={handleFileChange}
                      accept={contentType === "image" ? "image/*" : "*"}
                      className="hidden"
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {file ? file.name : `Click to upload ${contentType}`}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading || (!content.trim() && !file)}
                className="w-full h-12 bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-slate-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Moderate Content
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Moderation Result
                <StatusBadge status={result.status} confidence={result.confidence} />
              </CardTitle>
              <CardDescription>Analysis completed by {result.reviewer}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Content</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  {result.content}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Confidence Score</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{Math.round(result.confidence * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          result.status === 'approved' ? 'bg-green-500' :
                          result.status === 'review' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{width: `${result.confidence * 100}%`}}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Processing Time</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">~1.2s</p>
                </div>
              </div>

              {result.categories.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Flagged Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.flaggedReasons.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Reasons</Label>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                    {result.flaggedReasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Label className="text-sm font-medium">Timestamp</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentForm;