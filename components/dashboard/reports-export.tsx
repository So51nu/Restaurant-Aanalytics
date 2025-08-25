"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, FileText, BarChart3, Users, Star, DollarSign, Clock } from "lucide-react"
import { useState } from "react"

interface ReportsExportProps {
  selectedRestaurant: string
  dateRange: string
}

export function ReportsExport({ selectedRestaurant, dateRange }: ReportsExportProps) {
  const [reportType, setReportType] = useState("sales")
  const [exportFormat, setExportFormat] = useState("csv")

  const reportTypes = [
    { id: "sales", name: "Sales Report", icon: DollarSign, description: "Revenue, orders, and sales trends" },
    { id: "menu", name: "Menu Performance", icon: Star, description: "Top selling items and category analysis" },
    { id: "customer", name: "Customer Analytics", icon: Users, description: "Customer behavior and segmentation" },
    { id: "operational", name: "Operational Report", icon: Clock, description: "Peak hours and operational metrics" },
    { id: "comprehensive", name: "Comprehensive Report", icon: BarChart3, description: "All metrics combined" },
  ]

  const recentReports = [
    { name: "Weekly Sales Report", date: "2025-08-19", type: "Sales", status: "Ready" },
    { name: "Menu Performance Analysis", date: "2025-08-18", type: "Menu", status: "Ready" },
    { name: "Customer Insights Report", date: "2025-08-17", type: "Customer", status: "Processing" },
    { name: "Monthly Comprehensive Report", date: "2025-08-15", type: "Comprehensive", status: "Ready" },
  ]

  const handleGenerateReport = () => {
    // In a real app, this would trigger report generation
    console.log(`Generating ${reportType} report in ${exportFormat} format`)
  }

  const handleDownloadReport = (reportName: string) => {
    // In a real app, this would download the report
    console.log(`Downloading ${reportName}`)
  }

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate New Report
          </CardTitle>
          <CardDescription>Create custom reports for your restaurant analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Export Format</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV File</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleGenerateReport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">{reportTypes.find((type) => type.id === reportType)?.name}</h4>
            <p className="text-sm text-muted-foreground">
              {reportTypes.find((type) => type.id === reportType)?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((type) => (
          <Card key={type.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <type.icon className="h-5 w-5" />
                {type.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => setReportType(type.id)}
              >
                Select Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Reports
          </CardTitle>
          <CardDescription>Download or view previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{report.name}</h4>
                    <Badge
                      variant={report.status === "Ready" ? "default" : "secondary"}
                      className={report.status === "Ready" ? "bg-green-100 text-green-800" : ""}
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>Generated: {report.date}</span>
                    <span>Type: {report.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.status === "Ready" && (
                    <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.name)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Export Options */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Export</CardTitle>
            <CardDescription>Export current dashboard data instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Current Overview (CSV)
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Sales Data (Excel)
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Customer List (CSV)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
            <CardDescription>Set up automatic report generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium text-sm">Daily Sales Summary</p>
                  <p className="text-xs text-muted-foreground">Every day at 9:00 AM</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium text-sm">Weekly Performance</p>
                  <p className="text-xs text-muted-foreground">Every Monday at 8:00 AM</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                + Add Scheduled Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
