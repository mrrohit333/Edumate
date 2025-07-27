"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartTypeRegistry,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function CalculatorPage() {
  // Calculator state and logic will go here
  const [sgpaSubjects, setSgpaSubjects] = useState([{ credits: '', grade: '' }])
  const [sgpa, setSgpa] = useState<number | null>(null)
  const [cgpaSemesters, setCgpaSemesters] = useState([{ sgpa: '', totalCredits: '' }])
  const [cgpa, setCgpa] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('sgpa')
  const [calculationPerformed, setCalculationPerformed] = useState(false);

  // SGPA Calculator Logic
  const handleSgpaSubjectChange = (index: number, field: 'credits' | 'grade', value: number) => {
    const newSubjects = [...sgpaSubjects]
    newSubjects[index][field] = value
    setSgpaSubjects(newSubjects)
  }

  const addSgpaSubject = () => {
    setSgpaSubjects([...sgpaSubjects, { credits: '', grade: '' }])
  }

  const removeSgpaSubject = (index: number) => {
    const newSubjects = sgpaSubjects.filter((_, i) => i !== index)
    setSgpaSubjects(newSubjects)
  }

  const calculateSgpa = () => {
    let totalCredits = 0
    let weightedSum = 0
    sgpaSubjects.forEach(subject => {
      // Ensure values are treated as numbers for calculation
      const credits = parseFloat(String(subject.credits)) || 0;
      const grade = parseFloat(String(subject.grade)) || 0;
      totalCredits += credits;
      weightedSum += credits * grade;
    })
    if (totalCredits === 0) {
      setSgpa(0)
    } else {
      setSgpa(weightedSum / totalCredits)
    }
    setCalculationPerformed(true);
  }

  // Data for SGPA chart
  const sgpaChartData = {
    labels: sgpaSubjects.map((_, index) => `Subject ${index + 1}`), // Labels for each subject
    datasets: [
      {
        label: 'Grade Points',
        data: sgpaSubjects.map(subject => {
           const credits = parseFloat(String(subject.credits)) || 0;
           const grade = parseFloat(String(subject.grade)) || 0;
           return credits * grade; // Contribution to SGPA
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for SGPA chart
  const sgpaChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Subject Contribution to SGPA',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Subject',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Grade Points (Credit × Grade)',
        },
      },
    },
  };

  // CGPA Calculator Logic
  const handleCgpaSemesterChange = (index: number, field: 'sgpa' | 'totalCredits', value: number) => {
    const newSemesters = [...cgpaSemesters]
    newSemesters[index][field] = value
    setCgpaSemesters(newSemesters)
  }

  const addCgpaSemester = () => {
    setCgpaSemesters([...cgpaSemesters, { sgpa: '', totalCredits: '' }])
  }

  const removeCgpaSemester = (index: number) => {
    const newSemesters = cgpaSemesters.filter((_, i) => i !== index)
    setCgpaSemesters(newSemesters)
  }

  const calculateCgpa = () => {
    let totalWeightedSum = 0
    let totalTotalCredits = 0
    cgpaSemesters.forEach(semester => {
      // Ensure values are treated as numbers for calculation
      const sgpa = parseFloat(String(semester.sgpa)) || 0;
      const totalCredits = parseFloat(String(semester.totalCredits)) || 0;
      totalWeightedSum += sgpa * totalCredits;
      totalTotalCredits += totalCredits;
    })
    if (totalTotalCredits === 0) {
      setCgpa(0)
    } else {
      setCgpa(totalWeightedSum / totalTotalCredits)
    }
    setCalculationPerformed(true);
  }

  // Data for CGPA chart
  const cgpaChartData: ChartData<keyof ChartTypeRegistry> = {
    labels: cgpaSemesters.map((_, index) => `Semester ${index + 1}`), // Labels for each semester
    datasets: [
      {
        label: 'SGPA',
        data: cgpaSemesters.map(semester => parseFloat(String(semester.sgpa)) || 0), // SGPA of each semester
        backgroundColor: 'rgba(153, 102, 255, 0.6)' as string,
        borderColor: 'rgba(153, 102, 255, 1)' as string,
        borderWidth: 1,
      },
      {
         label: 'Final CGPA',
         data: cgpa !== null ? cgpaSemesters.map(() => cgpa) : cgpaSemesters.map(() => 0),
         backgroundColor: 'rgba(255, 159, 64, 0.6)' as string,
         borderColor: 'rgba(255, 159, 64, 1)' as string,
         borderWidth: 1,
         type: 'line' as const, // Use a line to represent the final CGPA, cast as const
         fill: false,
       },
    ],
  };

  // Options for CGPA chart
  const cgpaChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Semester SGPAs vs. Final CGPA',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Semester',
        },
      },
      y: {
        beginAtZero: true,
        max: 10, // Assuming max SGPA/CGPA is 10
        title: {
          display: true,
          text: 'GPA / CGPA',
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">SGPA & CGPA Calculator</h1>
      {/* Conditional rendering based on calculationPerformed */}
      {calculationPerformed ? (
        // Two-column layout after calculation
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column for Calculator */}
          <div className="w-full lg:w-1/3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sgpa">SGPA Calculator</TabsTrigger>
                <TabsTrigger value="cgpa">CGPA Calculator</TabsTrigger>
              </TabsList>
              <TabsContent value="sgpa">
                <Card>
                  <CardHeader>
                    <CardTitle>SGPA Calculator</CardTitle>
                    <CardDescription>Calculate your Semester Grade Point Average.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Input fields for subjects */}
                      {sgpaSubjects.map((subject, index) => (
                        <div key={index} className="flex gap-4 items-center">
                          <Input
                            type="number"
                            placeholder="Credits"
                            value={String(subject.credits)}
                            onChange={(e) => handleSgpaSubjectChange(index, 'credits', parseFloat(e.target.value))}
                            className="w-1/3"
                          />
                          <Input
                            type="number"
                            placeholder="Grade (e.g., 9)"
                            value={String(subject.grade)}
                            onChange={(e) => handleSgpaSubjectChange(index, 'grade', parseFloat(e.target.value))}
                            className="w-1/3"
                          />
                          <Button variant="destructive" onClick={() => removeSgpaSubject(index)}>
                            -
                          </Button>
                        </div>
                      ))}

                      {/* Add Subject button */}
                      <Button onClick={addSgpaSubject} variant="outline">
                        + Add Subject
                      </Button>

                      {/* Calculate button */}
                      <Button onClick={calculateSgpa} className="w-full">
                        Calculate SGPA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="cgpa">
                 <Card>
                  <CardHeader>
                    <CardTitle>CGPA Calculator</CardTitle>
                    <CardDescription>Calculate your Cumulative Grade Point Average.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                       {/* Input fields for semesters */}
                      {cgpaSemesters.map((semester, index) => (
                        <div key={index} className="flex gap-4 items-center">
                          <Input
                            type="number"
                            placeholder="SGPA"
                            value={String(semester.sgpa)}
                            onChange={(e) => handleCgpaSemesterChange(index, 'sgpa', parseFloat(e.target.value))}
                            className="w-1/3"
                          />
                           <Input
                            type="number"
                            placeholder="Total Credits"
                            value={String(semester.totalCredits)}
                            onChange={(e) => handleCgpaSemesterChange(index, 'totalCredits', parseFloat(e.target.value))}
                            className="w-1/3"
                          />
                          <Button variant="destructive" onClick={() => removeCgpaSemester(index)}>
                            -
                          </Button>
                        </div>
                      ))}

                       {/* Add Semester button */}
                      <Button onClick={addCgpaSemester} variant="outline">
                        + Add Semester
                      </Button>

                      {/* Calculate button */}
                      <Button onClick={calculateCgpa} className="w-full">
                        Calculate CGPA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column for Chart */}
          <div className="w-full lg:w-2/3">
             {activeTab === 'sgpa' && sgpa !== null && (
                <Card className="h-full">
                   <CardHeader>
                    <CardTitle>SGPA Details</CardTitle>
                     {sgpa !== null && (
                        <CardDescription className="mt-4 text-xl font-semibold text-green-600">
                          Your SGPA: {sgpa.toFixed(2)}
                        </CardDescription>
                      )}
                  </CardHeader>
                  <CardContent>
                    <div className="mt-6">
                      <Bar data={sgpaChartData} options={sgpaChartOptions} />
                    </div>
                  </CardContent>
                </Card>
             )}

             {activeTab === 'cgpa' && cgpa !== null && (
                <Card className="h-full">
                   <CardHeader>
                    <CardTitle>CGPA Details</CardTitle>
                     {cgpa !== null && (
                        <CardDescription className="mt-4 text-xl font-semibold text-green-600">
                          Your CGPA: {cgpa.toFixed(2)}
                        </CardDescription>
                      )}
                  </CardHeader>
                  <CardContent>
                    <div className="mt-6">
                       <Bar data={cgpaChartData} options={cgpaChartOptions} />
                    </div>
                  </CardContent>
                </Card>
             )}
          </div>
        </div>
      ) : (
        // Original single-column layout before calculation
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sgpa">SGPA Calculator</TabsTrigger>
            <TabsTrigger value="cgpa">CGPA Calculator</TabsTrigger>
          </TabsList>
          <TabsContent value="sgpa">
            <Card>
              <CardHeader>
                <CardTitle>SGPA Calculator</CardTitle>
                <CardDescription>Calculate your Semester Grade Point Average.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Input fields for subjects */}
                  {sgpaSubjects.map((subject, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <Input
                        type="number"
                        placeholder="Credits"
                        value={String(subject.credits)}
                        onChange={(e) => handleSgpaSubjectChange(index, 'credits', parseFloat(e.target.value))}
                        className="w-1/3"
                      />
                      <Input
                        type="number"
                        placeholder="Grade (e.g., 9)"
                        value={String(subject.grade)}
                        onChange={(e) => handleSgpaSubjectChange(index, 'grade', parseFloat(e.target.value))}
                        className="w-1/3"
                      />
                      <Button variant="destructive" onClick={() => removeSgpaSubject(index)}>
                        -
                      </Button>
                    </div>
                  ))}

                  {/* Add Subject button */}
                  <Button onClick={addSgpaSubject} variant="outline">
                    + Add Subject
                  </Button>

                  {/* Calculate button */}
                  <Button onClick={calculateSgpa} className="w-full">
                    Calculate SGPA
                  </Button>

                  {/* SGPA Result and Chart */}
                  {sgpa !== null && (
                    <>
                      <div className="mt-4 text-xl font-semibold">
                        Your SGPA: {sgpa.toFixed(2)}
                      </div>
                      <div className="mt-6">
                        <Bar data={sgpaChartData} options={sgpaChartOptions} />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cgpa">
            <Card>
              <CardHeader>
                <CardTitle>CGPA Calculator</CardTitle>
                <CardDescription>Calculate your Cumulative Grade Point Average.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                   {/* Input fields for semesters */}
                  {cgpaSemesters.map((semester, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <Input
                        type="number"
                        placeholder="SGPA"
                        value={String(semester.sgpa)}
                        onChange={(e) => handleCgpaSemesterChange(index, 'sgpa', parseFloat(e.target.value))}
                        className="w-1/3"
                      />
                       <Input
                        type="number"
                        placeholder="Total Credits"
                        value={String(semester.totalCredits)}
                        onChange={(e) => handleCgpaSemesterChange(index, 'totalCredits', parseFloat(e.target.value))}
                        className="w-1/3"
                      />
                      <Button variant="destructive" onClick={() => removeCgpaSemester(index)}>
                        -
                      </Button>
                    </div>
                  ))}

                   {/* Add Semester button */}
                  <Button onClick={addCgpaSemester} variant="outline">
                    + Add Semester
                  </Button>

                  {/* Calculate button */}
                  <Button onClick={calculateCgpa} className="w-full">
                    Calculate CGPA
                  </Button>

                  {/* CGPA Result and Chart */}
                  {cgpa !== null && (
                    <>
                      <div className="mt-4 text-xl font-semibold">
                        Your CGPA: {cgpa.toFixed(2)}
                      </div>
                      <div className="mt-6">
                         <Bar data={cgpaChartData} options={cgpaChartOptions} />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 