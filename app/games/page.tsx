"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Trophy, Clock, Target } from "lucide-react"
import NavigationWrapper from "@/components/navigation-wrapper"
import TechBackground from "@/components/tech-background"
import StarfallBackground from "@/components/starfall-background"
import GradientBackground from "@/components/gradient-background"

// Game Components
const BinaryConversionPuzzle = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const [question, setQuestion] = useState(generateQuestion(difficulty))
  const [answer, setAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  function generateQuestion(diff: 'easy' | 'medium' | 'hard') {
    const numBits = diff === 'easy' ? 4 : diff === 'medium' ? 8 : 12
    const decimal = Math.floor(Math.random() * Math.pow(2, numBits))
    return { decimal, binary: decimal.toString(2).padStart(numBits, '0') }
  }

  const checkAnswer = () => {
    const correct = parseInt(question.binary, 2) === parseInt(answer)
    if (correct) {
      setScore(score + 1)
      setFeedback("Correct! 🎉")
      setTimeout(() => {
        setQuestion(generateQuestion(difficulty))
        setAnswer("")
        setFeedback("")
      }, 1500)
    } else {
      setFeedback("Try again! ❌")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Binary Conversion Puzzle
        </CardTitle>
        <CardDescription>Convert binary to decimal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-mono">{question.binary}</p>
          <p className="text-sm text-muted-foreground">Binary</p>
        </div>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter decimal value"
          className="w-full p-2 border rounded"
        />
        <Button onClick={checkAnswer} className="w-full">Check Answer</Button>
        {feedback && <p className="text-center font-semibold">{feedback}</p>}
        <p className="text-center">Score: {score}</p>
      </CardContent>
    </Card>
  )
}

const SortingAlgorithmQuiz = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const [array, setArray] = useState<number[]>([])
  const [algorithm, setAlgorithm] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  const generateArray = (size: number) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100))
  }

  const startGame = () => {
    const size = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12
    setArray(generateArray(size))
    setAlgorithm("")
    setFeedback("")
  }

  const checkAlgorithm = () => {
    const sorted = [...array].sort((a, b) => a - b)
    const isBubbleSort = algorithm.toLowerCase().includes('bubble')
    const isQuickSort = algorithm.toLowerCase().includes('quick')
    const isMergeSort = algorithm.toLowerCase().includes('merge')

    if ((isBubbleSort && array.length <= 8) || (isQuickSort && array.length > 8) || (isMergeSort && array.length > 8)) {
      setScore(score + 1)
      setFeedback("Correct! 🎉")
    } else {
      setFeedback("Not the most efficient choice! ❌")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Sorting Algorithm Quiz
        </CardTitle>
        <CardDescription>Choose the best sorting algorithm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="font-mono">[{array.join(', ')}]</p>
        </div>
        <input
          type="text"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          placeholder="Enter algorithm name"
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2">
          <Button onClick={startGame} className="flex-1">New Array</Button>
          <Button onClick={checkAlgorithm} className="flex-1">Check</Button>
        </div>
        {feedback && <p className="text-center font-semibold">{feedback}</p>}
        <p className="text-center">Score: {score}</p>
      </CardContent>
    </Card>
  )
}

// Code Debugging Challenge
const CodeDebuggingChallenge = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  const codeSnippets = {
    easy: [
      { code: "console.log('Hello World')", error: "Missing semicolon", fixed: "console.log('Hello World');" },
      { code: "let x = 5\nconsole.log(x)", error: "Variable declared but not used properly", fixed: "let x = 5;\nconsole.log(x);" }
    ],
    medium: [
      { code: "function add(a, b) {\n  return a + b\n}", error: "Missing semicolon", fixed: "function add(a, b) {\n  return a + b;\n}" },
      { code: "const arr = [1, 2, 3];\nconsole.log(arr[3])", error: "Array index out of bounds", fixed: "const arr = [1, 2, 3];\nconsole.log(arr[2])" }
    ],
    hard: [
      { code: "async function fetchData() {\n  const response = await fetch('/api/data');\n  return response.json()\n}", error: "Missing semicolon and error handling", fixed: "async function fetchData() {\n  try {\n    const response = await fetch('/api/data');\n    return response.json();\n  } catch (error) {\n    console.error(error);\n  }\n}" },
      { code: "class Rectangle {\n  constructor(width, height) {\n    this.width = width;\n    this.height = height;\n  }\n  area() {\n    return this.width * this.height\n  }\n}", error: "Missing semicolon", fixed: "class Rectangle {\n  constructor(width, height) {\n    this.width = width;\n    this.height = height;\n  }\n  area() {\n    return this.width * this.height;\n  }\n}" }
    ]
  }

  const [currentSnippet, setCurrentSnippet] = useState(codeSnippets[difficulty][0])

  const checkCode = () => {
    if (code.trim() === currentSnippet.fixed) {
      setScore(score + 1)
      setFeedback("Perfect! 🎉")
      setTimeout(() => {
        const snippets = codeSnippets[difficulty]
        const randomIndex = Math.floor(Math.random() * snippets.length)
        setCurrentSnippet(snippets[randomIndex])
        setCode("")
        setFeedback("")
      }, 1500)
    } else {
      setFeedback("Not quite right. Try again! ❌")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Code Debugging Challenge
        </CardTitle>
        <CardDescription>Fix the code errors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded">
          <p className="text-sm text-red-600 mb-2">Error: {currentSnippet.error}</p>
          <pre className="text-sm font-mono whitespace-pre-wrap">{currentSnippet.code}</pre>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter the corrected code here"
          className="w-full p-2 border rounded h-32 font-mono text-sm"
        />
        <Button onClick={checkCode} className="w-full">Check Code</Button>
        {feedback && <p className="text-center font-semibold">{feedback}</p>}
        <p className="text-center">Score: {score}</p>
      </CardContent>
    </Card>
  )
}

// Network Topology Matching
const NetworkTopologyMatching = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const [topology, setTopology] = useState("")
  const [description, setDescription] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  const topologies = {
    easy: [
      { name: "Star", description: "All devices connected to a central hub" },
      { name: "Bus", description: "All devices share a single communication line" }
    ],
    medium: [
      { name: "Ring", description: "Devices connected in a circular fashion" },
      { name: "Mesh", description: "Every device connected to every other device" }
    ],
    hard: [
      { name: "Tree", description: "Hierarchical structure like a tree" },
      { name: "Hybrid", description: "Combination of two or more topologies" }
    ]
  }

  const [currentTopology, setCurrentTopology] = useState(topologies[difficulty][0])

  const checkAnswer = () => {
    if (topology.toLowerCase() === currentTopology.name.toLowerCase()) {
      setScore(score + 1)
      setFeedback("Correct! 🎉")
      setTimeout(() => {
        const tops = topologies[difficulty]
        const randomIndex = Math.floor(Math.random() * tops.length)
        setCurrentTopology(tops[randomIndex])
        setTopology("")
        setFeedback("")
      }, 1500)
    } else {
      setFeedback("Try again! ❌")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Network Topology Matching
        </CardTitle>
        <CardDescription>Identify the network topology</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded">
          <p className="text-sm">{currentTopology.description}</p>
        </div>
        <input
          type="text"
          value={topology}
          onChange={(e) => setTopology(e.target.value)}
          placeholder="Enter topology name"
          className="w-full p-2 border rounded"
        />
        <Button onClick={checkAnswer} className="w-full">Check Answer</Button>
        {feedback && <p className="text-center font-semibold">{feedback}</p>}
        <p className="text-center">Score: {score}</p>
      </CardContent>
    </Card>
  )
}

// SQL Query Builder
const SQLQueryBuilder = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const [query, setQuery] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  const queries = {
    easy: [
      { description: "Select all users from the users table", correct: "SELECT * FROM users" },
      { description: "Count total number of products", correct: "SELECT COUNT(*) FROM products" }
    ],
    medium: [
      { description: "Select users older than 18", correct: "SELECT * FROM users WHERE age > 18" },
      { description: "Get average price of products", correct: "SELECT AVG(price) FROM products" }
    ],
    hard: [
      { description: "Join users and orders tables", correct: "SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id" },
      { description: "Group products by category and count", correct: "SELECT category, COUNT(*) FROM products GROUP BY category" }
    ]
  }

  const [currentQuery, setCurrentQuery] = useState(queries[difficulty][0])

  const checkQuery = () => {
    if (query.toUpperCase().replace(/\s+/g, ' ').trim() === currentQuery.correct.toUpperCase()) {
      setScore(score + 1)
      setFeedback("Excellent! 🎉")
      setTimeout(() => {
        const qs = queries[difficulty]
        const randomIndex = Math.floor(Math.random() * qs.length)
        setCurrentQuery(qs[randomIndex])
        setQuery("")
        setFeedback("")
      }, 1500)
    } else {
      setFeedback("Check your syntax! ❌")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          SQL Query Builder
        </CardTitle>
        <CardDescription>Write the correct SQL query</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded">
          <p className="text-sm">{currentQuery.description}</p>
        </div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter SQL query here"
          className="w-full p-2 border rounded h-24 font-mono text-sm"
        />
        <Button onClick={checkQuery} className="w-full">Check Query</Button>
        {feedback && <p className="text-center font-semibold">{feedback}</p>}
        <p className="text-center">Score: {score}</p>
      </CardContent>
    </Card>
  )
}

// Time Complexity Guesser
const TimeComplexityGuesser = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const [complexity, setComplexity] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  const complexities = {
    easy: [
      { code: "for (let i = 0; i < n; i++) { console.log(i); }", correct: "O(n)" },
      { code: "console.log('Hello');", correct: "O(1)" }
    ],
    medium: [
      { code: "for (let i = 0; i < n; i++) {\n  for (let j = 0; j < n; j++) {\n    console.log(i, j);\n  }\n}", correct: "O(n²)" },
      { code: "for (let i = 0; i < n; i *= 2) {\n  console.log(i);\n}", correct: "O(log n)" }
    ],
    hard: [
      { code: "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}", correct: "O(2ⁿ)" },
      { code: "for (let i = 0; i < n; i++) {\n  for (let j = i; j < n; j++) {\n    console.log(i, j);\n  }\n}", correct: "O(n²)" }
    ]
  }

  const [currentComplexity, setCurrentComplexity] = useState(complexities[difficulty][0])

  const checkComplexity = () => {
    if (complexity.toLowerCase().replace(/\s/g, '') === currentComplexity.correct.toLowerCase()) {
      setScore(score + 1)
      setFeedback("Correct! 🎉")
      setTimeout(() => {
        const comps = complexities[difficulty]
        const randomIndex = Math.floor(Math.random() * comps.length)
        setCurrentComplexity(comps[randomIndex])
        setComplexity("")
        setFeedback("")
      }, 1500)
    } else {
      setFeedback("Think about the loops! ❌")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Complexity Guesser
        </CardTitle>
        <CardDescription>Determine the time complexity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded">
          <pre className="text-sm font-mono whitespace-pre-wrap">{currentComplexity.code}</pre>
        </div>
        <input
          type="text"
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
          placeholder="e.g., O(n), O(log n), O(n²)"
          className="w-full p-2 border rounded"
        />
        <Button onClick={checkComplexity} className="w-full">Check Complexity</Button>
        {feedback && <p className="text-center font-semibold">{feedback}</p>}
        <p className="text-center">Score: {score}</p>
      </CardContent>
    </Card>
  )
}

// Data Structure Identifier
const DataStructureIdentifier = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const [structure, setStructure] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  const structures = {
    easy: [
      { description: "Stores elements in a linear fashion, each element points to the next", correct: "Linked List" },
      { description: "Stores elements in contiguous memory locations", correct: "Array" }
    ],
    medium: [
      { description: "Follows Last In First Out (LIFO) principle", correct: "Stack" },
      { description: "Follows First In First Out (FIFO) principle", correct: "Queue" }
    ],
    hard: [
      { description: "A tree where each node has at most two children", correct: "Binary Tree" },
      { description: "A hash table with linked lists for collision resolution", correct: "Hash Table" }
    ]
  }

  const [currentStructure, setCurrentStructure] = useState(structures[difficulty][0])

  const checkStructure = () => {
    if (structure.toLowerCase() === currentStructure.correct.toLowerCase()) {
      setScore(score + 1)
      setFeedback("Correct! 🎉")
      setTimeout(() => {
        const structs = structures[difficulty]
        const randomIndex = Math.floor(Math.random() * structs.length)
        setCurrentStructure(structs[randomIndex])
        setStructure("")
        setFeedback("")
      }, 1500)
    } else {
      setFeedback("Think about the properties! ❌")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Data Structure Identifier
        </CardTitle>
        <CardDescription>Identify the data structure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded">
          <p className="text-sm">{currentStructure.description}</p>
        </div>
        <input
          type="text"
          value={structure}
          onChange={(e) => setStructure(e.target.value)}
          placeholder="Enter data structure name"
          className="w-full p-2 border rounded"
        />
        <Button onClick={checkStructure} className="w-full">Check Answer</Button>
        {feedback && <p className="text-center font-semibold">{feedback}</p>}
        <p className="text-center">Score: {score}</p>
      </CardContent>
    </Card>
  )
}

// Logic Gates Simulator
const LogicGatesSimulator = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const [input1, setInput1] = useState(false)
  const [input2, setInput2] = useState(false)
  const [gate, setGate] = useState("AND")
  const [userOutput, setUserOutput] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  const calculateOutput = (gate: string, a: boolean, b: boolean) => {
    switch (gate) {
      case "AND": return a && b
      case "OR": return a || b
      case "XOR": return a !== b
      case "NAND": return !(a && b)
      case "NOR": return !(a || b)
      default: return false
    }
  }

  const checkOutput = () => {
    const correctOutput = calculateOutput(gate, input1, input2)
    const userAnswer = userOutput.toLowerCase() === "true"
    if (userAnswer === correctOutput) {
      setScore(score + 1)
      setFeedback("Correct! 🎉")
      setTimeout(() => {
        setInput1(Math.random() < 0.5)
        setInput2(Math.random() < 0.5)
        const gates = difficulty === 'easy' ? ["AND", "OR"] : difficulty === 'medium' ? ["AND", "OR", "XOR"] : ["AND", "OR", "XOR", "NAND", "NOR"]
        setGate(gates[Math.floor(Math.random() * gates.length)])
        setUserOutput("")
        setFeedback("")
      }, 1500)
    } else {
      setFeedback("Wrong output! ❌")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Logic Gates Simulator
        </CardTitle>
        <CardDescription>Determine the output of logic gates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p>Input 1: {input1 ? "1" : "0"}</p>
            <p>Input 2: {input2 ? "1" : "0"}</p>
            <p>Gate: {gate}</p>
          </div>
        </div>
        <input
          type="text"
          value={userOutput}
          onChange={(e) => setUserOutput(e.target.value)}
          placeholder="true or false"
          className="w-full p-2 border rounded"
        />
        <Button onClick={checkOutput} className="w-full">Check Output</Button>
        {feedback && <p className="text-center font-semibold">{feedback}</p>}
        <p className="text-center">Score: {score}</p>
      </CardContent>
    </Card>
  )
}

// Password Strength Tester
const PasswordStrengthTester = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const [password, setPassword] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  const checkStrength = () => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const requiredStrength = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4
    if (strength >= requiredStrength) {
      setScore(score + 1)
      setFeedback("Strong password! 🎉")
      setTimeout(() => {
        setPassword("")
        setFeedback("")
      }, 1500)
    } else {
      setFeedback("Password too weak! ❌")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Password Strength Tester
        </CardTitle>
        <CardDescription>Create a strong password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a password"
          className="w-full p-2 border rounded"
        />
        <Button onClick={checkStrength} className="w-full">Check Strength</Button>
        {feedback && <p className="text-center font-semibold">{feedback}</p>}
        <p className="text-center">Score: {score}</p>
      </CardContent>
    </Card>
  )
}

// Programming Syntax Quiz
const ProgrammingSyntaxQuiz = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const [answer, setAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  const questions = {
    easy: [
      { question: "What symbol is used to declare a variable in JavaScript?", correct: "let" },
      { question: "What is the correct way to write a comment in Python?", correct: "#" }
    ],
    medium: [
      { question: "What is the syntax for a for loop in Java?", correct: "for(int i = 0; i < n; i++)" },
      { question: "How do you define a function in C++?", correct: "void functionName() {}" }
    ],
    hard: [
      { question: "What is the correct syntax for a lambda function in Python?", correct: "lambda x: x**2" },
      { question: "How do you declare a generic class in Java?", correct: "public class MyClass<T> {}" }
    ]
  }

  const [currentQuestion, setCurrentQuestion] = useState(questions[difficulty][0])

  const checkAnswer = () => {
    if (answer.toLowerCase().trim() === currentQuestion.correct.toLowerCase()) {
      setScore(score + 1)
      setFeedback("Correct! 🎉")
      setTimeout(() => {
        const qs = questions[difficulty]
        const randomIndex = Math.floor(Math.random() * qs.length)
        setCurrentQuestion(qs[randomIndex])
        setAnswer("")
        setFeedback("")
      }, 1500)
    } else {
      setFeedback("Wrong syntax! ❌")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Programming Syntax Quiz
        </CardTitle>
        <CardDescription>Test your programming knowledge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded">
          <p className="text-sm">{currentQuestion.question}</p>
        </div>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
          className="w-full p-2 border rounded"
        />
        <Button onClick={checkAnswer} className="w-full">Check Answer</Button>
        {feedback && <p className="text-center font-semibold">{feedback}</p>}
        <p className="text-center">Score: {score}</p>
      </CardContent>
    </Card>
  )
}

export default function GamesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  const games = [
    { id: 1, name: "Binary Conversion Puzzle", component: BinaryConversionPuzzle },
    { id: 2, name: "Sorting Algorithm Quiz", component: SortingAlgorithmQuiz },
    { id: 3, name: "Code Debugging Challenge", component: CodeDebuggingChallenge },
    { id: 4, name: "Network Topology Matching", component: NetworkTopologyMatching },
    { id: 5, name: "SQL Query Builder", component: SQLQueryBuilder },
    { id: 6, name: "Time Complexity Guesser", component: TimeComplexityGuesser },
    { id: 7, name: "Data Structure Identifier", component: DataStructureIdentifier },
    { id: 8, name: "Logic Gates Simulator", component: LogicGatesSimulator },
    { id: 9, name: "Password Strength Tester", component: PasswordStrengthTester },
    { id: 10, name: "Programming Syntax Quiz", component: ProgrammingSyntaxQuiz },
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <TechBackground />
      <StarfallBackground />
      <GradientBackground />
      <NavigationWrapper />
      <div className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">IT Games</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Test your knowledge with fun IT-themed puzzles and challenges
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <Button
                variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty('easy')}
              >
                Easy
              </Button>
              <Button
                variant={selectedDifficulty === 'medium' ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty('medium')}
              >
                Medium
              </Button>
              <Button
                variant={selectedDifficulty === 'hard' ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty('hard')}
              >
                Hard
              </Button>
            </div>
          </div>

          <Tabs defaultValue="1" className="w-full">
            <TabsList className="grid w-full grid-cols-10 mb-8">
              {games.map((game) => (
                <TabsTrigger key={game.id} value={game.id.toString()}>
                  {game.id}
                </TabsTrigger>
              ))}
            </TabsList>

            {games.map((game) => (
              <TabsContent key={game.id} value={game.id.toString()}>
                <div className="max-w-2xl mx-auto">
                  <game.component difficulty={selectedDifficulty} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
