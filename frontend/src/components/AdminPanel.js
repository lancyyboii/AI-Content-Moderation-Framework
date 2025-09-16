import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Search, Filter, Download, Trash2, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { mockModerationResults } from "../services/mockData";

const StatusBadge = ({ status }) => {
  const variants = {
    approved: { icon: CheckCircle, className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
    review: { icon: AlertTriangle, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
    flagged: { icon: XCircle, className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" }
  };

  const config = variants[status] || variants.review;
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} gap-1.5`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const AdminPanel = () => {
  const [results, setResults] = useState(mockModerationResults);
  const [filteredResults, setFilteredResults] = useState(mockModerationResults);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let filtered = results;

    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(result => result.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(result => result.type === typeFilter);
    }

    setFilteredResults(filtered);
  }, [searchTerm, statusFilter, typeFilter, results]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredResults.map(result => result.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to perform bulk actions",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (action === "approve") {
      setResults(prev => prev.map(result => 
        selectedItems.includes(result.id) 
          ? { ...result, status: "approved" }
          : result
      ));
      toast({
        title: "Bulk Action Completed",
        description: `${selectedItems.length} items approved`,
      });
    } else if (action === "flag") {
      setResults(prev => prev.map(result => 
        selectedItems.includes(result.id) 
          ? { ...result, status: "flagged" }
          : result
      ));
      toast({
        title: "Bulk Action Completed",
        description: `${selectedItems.length} items flagged`,
      });
    } else if (action === "delete") {
      setResults(prev => prev.filter(result => !selectedItems.includes(result.id)));
      toast({
        title: "Bulk Action Completed",
        description: `${selectedItems.length} items deleted`,
      });
    }

    setSelectedItems([]);
    setIsLoading(false);
  };

  const handleExport = () => {
    const dataToExport = filteredResults.map(result => ({
      ID: result.id,
      Content: result.content,
      Type: result.type,
      Status: result.status,
      Confidence: Math.round(result.confidence * 100) + "%",
      Categories: result.categories.join(', '),
      Timestamp: new Date(result.timestamp).toLocaleString()
    }));

    const csvContent = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moderation-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Completed",
      description: "Moderation results have been exported to CSV",
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admin Panel</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage and review all moderation results</p>
      </div>

      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Moderation History
            </span>
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleBulkAction("approve")}
                    disabled={isLoading}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approve ({selectedItems.length})
                  </Button>
                  <Button
                    onClick={() => handleBulkAction("flag")}
                    disabled={isLoading}
                    size="sm"
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4" />
                    Flag ({selectedItems.length})
                  </Button>
                  <Button
                    onClick={() => handleBulkAction("delete")}
                    disabled={isLoading}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedItems.length})
                  </Button>
                </div>
              )}
              <Button onClick={handleExport} size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            {filteredResults.length} of {results.length} results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by content or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredResults.length && filteredResults.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(result.id)}
                        onCheckedChange={(checked) => handleSelectItem(result.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={result.content}>
                        {result.content}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{result.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {result.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={result.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {Math.round(result.confidence * 100)}%
                        </span>
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              result.status === 'approved' ? 'bg-green-500' :
                              result.status === 'review' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{width: `${result.confidence * 100}%`}}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {result.categories.slice(0, 2).map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category.replace('_', ' ')}
                          </Badge>
                        ))}
                        {result.categories.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{result.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(result.timestamp).toLocaleDateString()}
                      <br />
                      {new Date(result.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No results found</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;