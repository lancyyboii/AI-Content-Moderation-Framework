import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { 
  Settings, 
  Shield, 
  Bell, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  Trash2,
  Plus
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { mockSettings } from "../services/mockData";

const SettingsPanel = () => {
  const [settings, setSettings] = useState(mockSettings);
  const [customRule, setCustomRule] = useState("");
  const [customRules, setCustomRules] = useState([
    "Block content with excessive capitalization",
    "Flag links to unknown domains",
    "Review content with multiple languages"
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSensitivityChange = (category, value) => {
    setSettings(prev => ({
      ...prev,
      sensitivity: {
        ...prev.sensitivity,
        [category]: value[0] / 100
      }
    }));
  };

  const handleCategoryToggle = (category, enabled) => {
    setSettings(prev => ({
      ...prev,
      enabledCategories: {
        ...prev.enabledCategories,
        [category]: enabled
      }
    }));
  };

  const handleThresholdChange = (type, value) => {
    setSettings(prev => ({
      ...prev,
      [type]: value[0] / 100
    }));
  };

  const handleNotificationToggle = (type, enabled) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: enabled
      }
    }));
  };

  const handleAddCustomRule = () => {
    if (customRule.trim()) {
      setCustomRules(prev => [...prev, customRule.trim()]);
      setCustomRule("");
      toast({
        title: "Custom Rule Added",
        description: "Your custom rule has been added successfully",
      });
    }
  };

  const handleRemoveCustomRule = (index) => {
    setCustomRules(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Custom Rule Removed",
      description: "The custom rule has been removed",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Settings Saved",
      description: "Your moderation settings have been updated successfully",
    });
    
    setIsSaving(false);
  };

  const handleReset = () => {
    setSettings(mockSettings);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
    });
  };

  const categories = [
    { key: 'hate_speech', label: 'Hate Speech', description: 'Detect hateful or discriminatory content' },
    { key: 'spam', label: 'Spam', description: 'Identify unsolicited promotional content' },
    { key: 'adult_content', label: 'Adult Content', description: 'Flag sexually explicit material' },
    { key: 'violence', label: 'Violence', description: 'Detect violent or graphic content' },
    { key: 'harassment', label: 'Harassment', description: 'Identify bullying or harassment' },
    { key: 'misinformation', label: 'Misinformation', description: 'Flag potentially false information' }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Configure your content moderation preferences</p>
      </div>

      <div className="space-y-6">
        {/* Category Settings */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Moderation Categories
            </CardTitle>
            <CardDescription>
              Configure which categories to monitor and their sensitivity levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {categories.map((category) => (
              <div key={category.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={settings.enabledCategories[category.key]}
                        onCheckedChange={(enabled) => handleCategoryToggle(category.key, enabled)}
                      />
                      <div>
                        <Label className="text-sm font-medium">{category.label}</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{category.description}</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="min-w-16">
                    {Math.round(settings.sensitivity[category.key] * 100)}%
                  </Badge>
                </div>
                
                {settings.enabledCategories[category.key] && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Sensitivity</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {Math.round(settings.sensitivity[category.key] * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.sensitivity[category.key] * 100]}
                      onValueChange={(value) => handleSensitivityChange(category.key, value)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Lenient</span>
                      <span>Strict</span>
                    </div>
                  </div>
                )}
                
                {category.key !== categories[categories.length - 1].key && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Threshold Settings */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Decision Thresholds
            </CardTitle>
            <CardDescription>
              Set confidence score thresholds for automated decisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Auto-Approval Threshold</Label>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    {Math.round(settings.autoApprovalThreshold * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Content above this confidence score will be automatically approved
                </p>
                <Slider
                  value={[settings.autoApprovalThreshold * 100]}
                  onValueChange={(value) => handleThresholdChange('autoApprovalThreshold', value)}
                  max={100}
                  min={50}
                  step={5}
                />
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Manual Review Threshold</Label>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                    {Math.round(settings.manualReviewThreshold * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Content below this score will require manual review
                </p>
                <Slider
                  value={[settings.manualReviewThreshold * 100]}
                  onValueChange={(value) => handleThresholdChange('manualReviewThreshold', value)}
                  max={95}
                  min={10}
                  step={5}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Rules */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Custom Rules
            </CardTitle>
            <CardDescription>
              Add custom moderation rules for specific use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Enter a custom moderation rule..."
                value={customRule}
                onChange={(e) => setCustomRule(e.target.value)}
                rows={2}
                className="flex-1"
              />
              <Button onClick={handleAddCustomRule} disabled={!customRule.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {customRules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{rule}</span>
                  <Button
                    onClick={() => handleRemoveCustomRule(index)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you want to be notified about moderation events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">Receive email alerts for flagged content</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(enabled) => handleNotificationToggle('email', enabled)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Slack Integration</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">Send alerts to your Slack workspace</p>
              </div>
              <Switch
                checked={settings.notifications.slack}
                onCheckedChange={(enabled) => handleNotificationToggle('slack', enabled)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Webhook Notifications</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">Send POST requests to your endpoint</p>
              </div>
              <Switch
                checked={settings.notifications.webhook}
                onCheckedChange={(enabled) => handleNotificationToggle('webhook', enabled)}
              />
            </div>

            {settings.notifications.webhook && (
              <div className="mt-4">
                <Label>Webhook URL</Label>
                <Input
                  placeholder="https://your-endpoint.com/webhook"
                  className="mt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <Button onClick={handleSave} disabled={isSaving} className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-slate-100">
            {isSaving ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;